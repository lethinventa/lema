// Drizzle schema — the source of truth for the entities described in
// docs/architecture/domain-model.md. Grows incrementally, one journey at a
// time (see docs/product/journeys/), not modeled all at once upfront.
import { pgSchema, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

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
