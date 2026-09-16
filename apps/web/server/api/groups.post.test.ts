// @vitest-environment node
import { fetch } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';
import {
  authHeaders,
  createFixtureSession,
  db,
  setupRouteTest,
} from '~/tests/route-test-helpers';

await setupRouteTest();

describe('POST /api/groups', () => {
  it('returns 401 when unauthenticated', async () => {
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Family' }),
    });

    expect(res.status).toBe(401);
  });

  it('creates the group and registers the creator as OWNER', async () => {
    const owner = await createFixtureSession();

    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: authHeaders(owner.token),
      body: JSON.stringify({ name: 'Family' }),
    });
    expect(res.status).toBe(201);
    const group = await res.json();

    const groupRow = await db.query.groups.findFirst({
      where: (g, { eq }) => eq(g.id, group.id),
    });
    expect(groupRow?.name).toBe('Family');

    const membershipRow = await db.query.groupMemberships.findFirst({
      where: (m, { and, eq }) =>
        and(eq(m.groupId, group.id), eq(m.userId, owner.userId)),
    });
    expect(membershipRow?.role).toBe('OWNER');
  });
});
