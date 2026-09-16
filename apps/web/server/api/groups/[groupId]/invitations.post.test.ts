// @vitest-environment node
import { fetch } from '@nuxt/test-utils/e2e';
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  authHeaders,
  createFixtureSession,
  db,
  setupRouteTest,
} from '~/tests/route-test-helpers';

await setupRouteTest();

describe('POST /api/groups/:groupId/invitations', () => {
  it('returns 401 when unauthenticated', async () => {
    const owner = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');

    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: owner.userId }),
    });

    expect(res.status).toBe(401);
  });

  it('registers a PENDING invitation when the inviter is a group member', async () => {
    const owner = await createFixtureSession();
    const invited = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');

    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(owner.token),
      body: JSON.stringify({ userId: invited.userId }),
    });

    expect(res.status).toBe(201);
    const invitationRows = await findInvitationRows(group.id, invited.userId);
    expect(invitationRows).toHaveLength(1);
    expect(invitationRows[0]).toMatchObject({
      groupId: group.id,
      invitedUserId: invited.userId,
      invitedByUserId: owner.userId,
      status: 'PENDING',
      acceptedAt: null,
    });
    expect(invitationRows[0]?.token).toBeTruthy();
  });

  it('rejects the invite when the inviter is not a group member', async () => {
    const owner = await createFixtureSession();
    const outsider = await createFixtureSession();
    const invited = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');

    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(outsider.token),
      body: JSON.stringify({ userId: invited.userId }),
    });

    expect(res.status).toBe(400);
    expect(await findInvitationRows(group.id, invited.userId)).toHaveLength(0);
  });

  it('rejects the invite when the invited person has no Lema account', async () => {
    const owner = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');
    const nonExistentUserId = randomUUID();

    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(owner.token),
      body: JSON.stringify({ userId: nonExistentUserId }),
    });

    expect(res.status).toBe(400);
    expect(await findInvitationRows(group.id, nonExistentUserId)).toHaveLength(
      0,
    );
  });

  it('rejects a duplicate PENDING invitation for the same person and group', async () => {
    const owner = await createFixtureSession();
    const invited = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');
    const body = JSON.stringify({ userId: invited.userId });

    await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(owner.token),
      body,
    });
    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(owner.token),
      body,
    });

    expect(res.status).toBe(400);
    // Confirms the duplicate attempt didn't insert a second row alongside
    // the one from the first, successful call.
    expect(await findInvitationRows(group.id, invited.userId)).toHaveLength(1);
  });
});

function findInvitationRows(groupId: string, invitedUserId: string) {
  return db.query.invitations.findMany({
    where: (i, { and, eq }) =>
      and(eq(i.groupId, groupId), eq(i.invitedUserId, invitedUserId)),
  });
}

async function createFixtureGroup(
  ownerToken: string,
  name: string,
): Promise<{ id: string }> {
  const res = await fetch('/api/groups', {
    method: 'POST',
    headers: authHeaders(ownerToken),
    body: JSON.stringify({ name }),
  });
  return res.json();
}
