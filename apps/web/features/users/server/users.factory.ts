import { defineFactory } from '@praha/drizzle-factory';
import { randomUUID } from 'node:crypto';
import { groupMemberships, groups, users } from '~/lib/db/schema';

// drizzle-factory's schema must be Table-only — lib/db/schema.ts also
// exports groupRoleEnum (a PgEnum, not a Table), which import * as schema
// would pull in and fail defineFactory's type constraint.
export const usersFactory = defineFactory({
  schema: { users, groups, groupMemberships },
  table: 'users',
  resolver: ({ sequence }) => ({
    id: randomUUID(),
    name: `Test User ${sequence}`,
    photoUrl: null,
    timezone: 'America/Sao_Paulo',
    dateFormat: null,
    deletionRequestedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
});
