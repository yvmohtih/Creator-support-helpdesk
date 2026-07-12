import { AdminRole } from '@prisma/client';

export interface AdminSessionPayload {
  sub: string;
  email: string;
  role: AdminRole;
}

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
}
