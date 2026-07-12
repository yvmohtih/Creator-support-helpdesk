import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  API_HOST: z.string().min(1).default('127.0.0.1'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1),
  SKIP_DATABASE_CONNECT: z.enum(['true', 'false']).default('false'),
  AUTH_SESSION_SECRET: z.string().min(16),
  JWT_SECRET: z.string().min(16),
  PASSWORD_HASH_PEPPER: z.string().min(16),
  STORAGE_PROVIDER: z.enum(['s3']).default('s3'),
  S3_REGION: z.string().min(1),
  S3_ENDPOINT: z.string().url(),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  SENTRY_DSN: z.string().optional(),
});

export function validateEnvironment(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const messages = parsed.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`,
    );
    throw new Error(`Invalid environment configuration: ${messages.join('; ')}`);
  }

  return parsed.data;
}
