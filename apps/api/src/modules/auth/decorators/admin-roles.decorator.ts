import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { ADMIN_ROLES_KEY } from '../constants/admin-auth.constants';

export const AdminRoles = (...roles: AdminRole[]) => SetMetadata(ADMIN_ROLES_KEY, roles);
