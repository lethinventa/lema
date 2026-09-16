// Drizzle schema — the source of truth for the entities described in
// docs/architecture/domain-model.md. Grows incrementally, one journey at a
// time (see docs/product/journeys/), not modeled all at once upfront.
import { sql } from 'drizzle-orm';
import {
  pgEnum,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

// auth.users is owned and migrated by Supabase Auth, not by us (see
// drizzle.config.ts schemaFilter) — this reference exists only so
// public.users can foreign-key into it.
const authSchema = pgSchema('auth');
const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  photoUrl: text('photo_url'),
  timezone: text('timezone').notNull(),
  dateFormat: text('date_format'),
  // UC-USER-004: soft-delete marker starting the 30-day recovery window.
  deletionRequestedAt: timestamp('deletion_requested_at', {
    withTimezone: true,
  }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// PD-001: only OWNER/MEMBER exist, no intermediate role.
export const groupRoleEnum = pgEnum('group_role', ['OWNER', 'MEMBER']);

// UC-GROUP-001. No owner/createdBy column on the group row itself: a group
// can have multiple OWNERs simultaneously (PD-001), so "who owns this
// group" is expressed entirely through group_memberships.role.
export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Domain model's Membership entity. Composite PK (groupId, userId) — its
// existence already implies membership, and this structurally prevents
// duplicate rows for the same user/group pair.
//
// onDelete: 'cascade' on userId means a hard-deleted user's memberships
// disappear with them — fine for a MEMBER, but if that user is a group's
// sole OWNER this can leave the group without one, which PD-001 says must
// never happen. Not reachable yet (no delete-group/remove-member/
// hard-delete-user flow exists), but UC-GROUP-004/005 and UC-USER-004 must
// guard against it explicitly when built.
export const groupMemberships = pgTable(
  'group_memberships',
  {
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: groupRoleEnum('role').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.groupId, table.userId] })],
);

export const invitationStatusEnum = pgEnum('invitation_status', [
  'PENDING',
  'ACCEPTED',
  'DECLINED',
  'EXPIRED',
  'CANCELLED',
]);

// UC-GROUP-002. The invited person is identified by userId, not email —
// inviting someone with no Lema account is not a valid operation (review
// decision on PR #6, narrowing the UC's "person not registered yet"
// variation out of this slice rather than resolving an email to an account).
export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    invitedUserId: uuid('invited_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    invitedByUserId: uuid('invited_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: invitationStatusEnum('status').notNull().default('PENDING'),
    token: uuid('token').notNull().defaultRandom().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    // Set only when status transitions to ACCEPTED — distinguishes an
    // acceptance from any other row update, which updatedAt alone can't.
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // UC-GROUP-002 business rule: a person can't have two simultaneous
    // PENDING invites for the same group. Enforced structurally via a
    // partial unique index (matched by insertInvitation's onConflictDoNothing
    // in group.repository.ts) rather than a read-then-write check in
    // application code, same philosophy as group_memberships' composite PK.
    uniqueIndex('invitations_pending_group_invited_user_idx')
      .on(table.groupId, table.invitedUserId)
      .where(sql`${table.status} = 'PENDING'`),
  ],
);
