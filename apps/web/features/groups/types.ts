export interface Group {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InvitationStatus =
  'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';

export interface Invitation {
  id: string;
  groupId: string;
  invitedUserId: string;
  invitedByUserId: string;
  status: InvitationStatus;
  token: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
