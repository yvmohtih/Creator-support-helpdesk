import { AdminRole, PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

async function main() {
  const email = requiredEnv('ADMIN_EMAIL').trim().toLowerCase();
  const password = requiredEnv('ADMIN_PASSWORD');
  const pepper = requiredEnv('PASSWORD_HASH_PEPPER');
  const fullName = process.env.ADMIN_FULL_NAME?.trim() || 'System Admin';
  const role = (process.env.ADMIN_ROLE as AdminRole | undefined) || AdminRole.admin;

  if (!Object.values(AdminRole).includes(role)) {
    throw new Error('ADMIN_ROLE must be admin or support_agent');
  }

  const passwordHash = await argon2.hash(`${password}${pepper}`);

  await prisma.adminProfile.upsert({
    where: {
      authUserId: email,
    },
    create: {
      authUserId: email,
      fullName,
      role,
      passwordHash,
      isActive: true,
    },
    update: {
      fullName,
      role,
      passwordHash,
      isActive: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
