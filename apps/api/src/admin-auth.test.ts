import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AdminRole } from '@prisma/client';
import argon2 from 'argon2';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggerService } from './common/logging/logger.service';
import { PrismaService } from './modules/database/prisma.service';

function responseCookies(response: request.Response) {
  const cookies = response.headers['set-cookie'];

  if (Array.isArray(cookies)) {
    return cookies;
  }

  return cookies ? [cookies] : [];
}

describe('admin authentication', () => {
  let app: INestApplication;
  let passwordHash: string;
  let adminRole: AdminRole = AdminRole.admin;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.API_PORT = '4000';
    process.env.WEB_ORIGIN = 'http://127.0.0.1:3000';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.SKIP_DATABASE_CONNECT = 'true';
    process.env.AUTH_SESSION_SECRET = 'test-auth-session-secret';
    process.env.JWT_SECRET = 'test-jwt-session-secret';
    process.env.PASSWORD_HASH_PEPPER = 'test-password-pepper';
    process.env.ADMIN_SESSION_COOKIE_NAME = 'admin_session';
    process.env.ADMIN_SESSION_COOKIE_SECURE = 'false';
    process.env.ADMIN_LOGIN_MAX_ATTEMPTS = '10';
    process.env.ADMIN_LOGIN_WINDOW_MS = '600000';
    process.env.S3_REGION = 'auto';
    process.env.S3_ENDPOINT = 'http://localhost:9000';
    process.env.S3_BUCKET = 'creator-support-test';
    process.env.S3_ACCESS_KEY_ID = 'test';
    process.env.S3_SECRET_ACCESS_KEY = 'test';

    passwordHash = await argon2.hash('correct-passwordtest-password-pepper');

    const prismaMock = {
      adminProfile: {
        findUnique: async ({ where }: { where: { id?: string; authUserId?: string } }) => {
          if (where.authUserId && where.authUserId !== 'admin@example.com') {
            return null;
          }

          if (where.id && where.id !== '00000000-0000-0000-0000-000000000001') {
            return null;
          }

          return {
            id: '00000000-0000-0000-0000-000000000001',
            authUserId: 'admin@example.com',
            fullName: 'Admin User',
            passwordHash,
            role: adminRole,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        },
      },
      $connect: async () => undefined,
      $disconnect: async () => undefined,
    };

    const { AppModule } = await import('./modules/app.module');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    const logger = app.get(LoggerService);
    const config = app.get(ConfigService);

    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.enableCors({
      origin: config.getOrThrow<string>('WEB_ORIGIN'),
      credentials: true,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        forbidUnknownValues: true,
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter(logger));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects invalid email format', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/admin/auth/login')
      .send({ email: 'bad-email', password: 'correct-password' })
      .expect(400);
  });

  it('rejects invalid password', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/admin/auth/login')
      .send({ email: 'admin@example.com', password: 'wrong-password' })
      .expect(401);
  });

  it('logs in with valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/auth/login')
      .send({ email: 'admin@example.com', password: 'correct-password' })
      .expect(201);

    expect(response.body.data.admin.email).toBe('admin@example.com');
    expect(responseCookies(response)[0]).toContain('admin_session=');
  });

  it('requires authentication for protected admin APIs', async () => {
    await request(app.getHttpServer()).get('/api/v1/admin/protected/ping').expect(401);
  });

  it('allows authenticated admins to access protected APIs', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/v1/admin/auth/login')
      .send({ email: 'admin@example.com', password: 'correct-password' });
    const cookie = responseCookies(login);
    expect(cookie.length).toBeGreaterThan(0);

    await request(app.getHttpServer())
      .get('/api/v1/admin/protected/ping')
      .set('Cookie', cookie)
      .expect(200);
  });

  it('allows support agents to access protected admin dashboard routes', async () => {
    adminRole = AdminRole.support_agent;
    const login = await request(app.getHttpServer())
      .post('/api/v1/admin/auth/login')
      .send({ email: 'admin@example.com', password: 'correct-password' });
    const cookie = responseCookies(login);
    expect(cookie.length).toBeGreaterThan(0);

    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.data.admin.role).toBe('support_agent');
    adminRole = AdminRole.admin;
  });

  it('clears the session cookie on logout', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/auth/logout')
      .expect(201);

    expect(responseCookies(response)[0]).toContain('admin_session=');
    expect(responseCookies(response)[0]).toContain('Expires=');
  });
});
