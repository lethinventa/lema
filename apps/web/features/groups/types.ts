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
  invitedEmail: string;
  invitedByUserId: string;
  status: InvitationStatus;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
