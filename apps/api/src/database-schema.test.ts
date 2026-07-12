import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DataType, newDb } from 'pg-mem';
import { beforeEach, describe, expect, it } from 'vitest';

type TestDatabase = ReturnType<typeof createDatabase>;

const migrationSql = readFileSync(
  join(__dirname, '../prisma/migrations/20260712182000_u02_database_schema/migration.sql'),
  'utf8',
);
const pgMemCompatibleMigrationSql = migrationSql
  .replace(/CREATE EXTENSION IF NOT EXISTS "pgcrypto";\n\n/u, '')
  .replace(
    /\s+CONSTRAINT "chk_support_requests_request_number_format" CHECK \("request_number" ~ '\^RB-\[0-9\]\{4\}-\[A-Z0-9\]\{6\}\$'\),\n/u,
    '\n',
  )
  .replace(
    /\s+CONSTRAINT "chk_support_requests_email_basic_format" CHECK \("email" IS NULL OR "email" ~ '\^\[\^@\\s\]\+@\[\^@\\s\]\+\\\.\[\^@\\s\]\+\$'\)\n/u,
    '\n',
  )
  .replace(/,\n\);/gu, '\n);')
  .replace(/CREATE OR REPLACE FUNCTION set_updated_at\(\)[\s\S]*$/u, '');

const seedCategories = [
  ['instagram', 'Account disabled', 'ఖాతా నిలిపివేయబడింది', 10],
  ['instagram', 'Cannot log in', 'లాగిన్ కాలేకపోతున్నాను', 20],
  ['instagram', 'Copyright issue', 'కాపీరైట్ సమస్య', 30],
  ['instagram', 'Reach reduced', 'రీచ్ తగ్గింది', 40],
  ['instagram', 'Monetization problem', 'మోనిటైజేషన్ సమస్య', 50],
  ['instagram', 'Payment not received', 'చెల్లింపు రాలేదు', 60],
  ['facebook', 'Page disabled', 'పేజ్ నిలిపివేయబడింది', 10],
  ['facebook', 'Cannot log in', 'లాగిన్ కాలేకపోతున్నాను', 20],
  ['facebook', 'Monetization problem', 'మోనిటైజేషన్ సమస్య', 30],
  ['facebook', 'Payment not received', 'చెల్లింపు రాలేదు', 40],
  ['facebook', 'Copyright issue', 'కాపీరైట్ సమస్య', 50],
  ['youtube', 'Channel warning', 'చానల్ హెచ్చరిక', 10],
  ['youtube', 'Copyright strike', 'కాపీరైట్ స్ట్రైక్', 20],
  ['youtube', 'Monetization issue', 'మోనిటైజేషన్ సమస్య', 30],
  ['youtube', 'AdSense issue', 'AdSense సమస్య', 40],
  ['youtube', 'Payment issue', 'చెల్లింపు సమస్య', 50],
  ['youtube', 'Channel suspended', 'చానల్ సస్పెండ్ అయింది', 60],
  ['other', 'Other problem', 'ఇతర సమస్య', 10],
] as const;

function createDatabase() {
  const db = newDb({ autoCreateForeignKeyIndices: true });

  db.public.registerFunction({
    name: 'gen_random_uuid',
    returns: DataType.uuid,
    implementation: randomUUID,
  });
  db.public.registerFunction({
    name: 'btrim',
    args: [DataType.text],
    returns: DataType.text,
    implementation: (value: string) => value.trim(),
  });
  db.public.registerFunction({
    name: 'length',
    args: [DataType.text],
    returns: DataType.integer,
    implementation: (value: string) => value.length,
  });

  db.public.none(pgMemCompatibleMigrationSql);

  return db;
}

function seedIssueCategories(db: TestDatabase) {
  for (const [platform, nameEn, nameTe, sortOrder] of seedCategories) {
    const id = randomUUID();
    db.public.none(
      `INSERT INTO issue_categories (id, platform, name_en, name_te, sort_order)
       VALUES (${sqlValue(id)}, ${sqlValue(platform)}, ${sqlValue(nameEn)}, ${sqlValue(nameTe)}, ${sortOrder})`,
    );
  }
}

function sqlValue(value: string) {
  return `'${value.replace(/'/gu, "''")}'`;
}

function firstCategoryId(db: TestDatabase, platform = 'instagram') {
  const category = db.public.one(
    `SELECT id FROM issue_categories WHERE platform = ${sqlValue(platform)} ORDER BY sort_order LIMIT 1`,
  ) as { id: string };

  return category.id;
}

function insertSupportRequest(db: TestDatabase, requestNumber = 'RB-2026-AB12CD') {
  const categoryId = firstCategoryId(db);
  db.public.none(
    `INSERT INTO support_requests (
       request_number,
       platform,
       category_id,
       user_name,
       mobile_number,
       description
     )
     VALUES (${sqlValue(requestNumber)}, 'instagram', ${sqlValue(categoryId)}, 'Raju', '9876543210', 'Cannot log in')`,
  );
}

describe('U02 database schema', () => {
  let db: TestDatabase;

  beforeEach(() => {
    db = createDatabase();
    seedIssueCategories(db);
  });

  it('creates the required tables', () => {
    const tables = db.public.many(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'
       ORDER BY table_name`,
    ) as Array<{ table_name: string }>;

    expect(tables.map((table) => table.table_name)).toEqual(
      expect.arrayContaining([
        'admin_profiles',
        'issue_categories',
        'support_requests',
        'request_messages',
        'request_attachments',
        'request_status_history',
      ]),
    );
  });

  it('seeds the expected issue categories', () => {
    const result = db.public.one(`SELECT count(*)::int AS count FROM issue_categories`) as {
      count: number;
    };

    expect(result.count).toBe(18);
  });

  it('rejects duplicate request numbers', () => {
    insertSupportRequest(db);

    expect(() => insertSupportRequest(db)).toThrow();
  });

  it('rejects invalid status values', () => {
    const categoryId = firstCategoryId(db);

    expect(() =>
      db.public.none(
        `INSERT INTO support_requests (
           request_number,
           platform,
           category_id,
           user_name,
           mobile_number,
           description,
           status
         )
         VALUES ('RB-2026-BB12CD', 'instagram', ${sqlValue(categoryId)}, 'Raju', '9876543210', 'Help', 'bad_status')`,
      ),
    ).toThrow();
  });

  it('rejects invalid platform values', () => {
    const categoryId = firstCategoryId(db);

    expect(() =>
      db.public.none(
        `INSERT INTO support_requests (
           request_number,
           platform,
           category_id,
           user_name,
           mobile_number,
           description
         )
         VALUES ('RB-2026-CB12CD', 'bad_platform', ${sqlValue(categoryId)}, 'Raju', '9876543210', 'Help')`,
      ),
    ).toThrow();
  });

  it('rejects support requests with missing categories', () => {
    expect(() =>
      db.public.none(
        `INSERT INTO support_requests (
           request_number,
           platform,
           category_id,
           user_name,
           mobile_number,
           description
         )
         VALUES (
           'RB-2026-DB12CD',
           'instagram',
           '00000000-0000-0000-0000-000000000000',
           'Raju',
           '9876543210',
           'Help'
         )`,
      ),
    ).toThrow();
  });

  it('rejects messages with missing support requests', () => {
    expect(() =>
      db.public.none(
        `INSERT INTO request_messages (support_request_id, sender_type, message)
         VALUES ('00000000-0000-0000-0000-000000000000', 'user', 'Hello')`,
      ),
    ).toThrow();
  });

  it('prevents user messages from being internal notes', () => {
    insertSupportRequest(db);
    const request = db.public.one(`SELECT id FROM support_requests LIMIT 1`) as { id: string };

    expect(() =>
      db.public.none(
        `INSERT INTO request_messages (
           support_request_id,
           sender_type,
           message,
           is_internal_note
         )
         VALUES (${sqlValue(request.id)}, 'user', 'Secret user note', true)`,
      ),
    ).toThrow();
  });

  it('saves attachment metadata against a support request', () => {
    insertSupportRequest(db);
    const request = db.public.one(`SELECT id FROM support_requests LIMIT 1`) as { id: string };

    db.public.none(
      `INSERT INTO request_attachments (
         support_request_id,
         storage_path,
         original_file_name,
         mime_type,
         file_size,
         uploaded_by
       )
       VALUES (${sqlValue(request.id)}, 'requests/RB-2026-AB12CD/screenshot.png', 'screenshot.png', 'image/png', 1200, 'user')`,
    );

    const result = db.public.one(`SELECT count(*)::int AS count FROM request_attachments`) as {
      count: number;
    };

    expect(result.count).toBe(1);
  });

  it('saves request status history', () => {
    insertSupportRequest(db);
    const request = db.public.one(`SELECT id FROM support_requests LIMIT 1`) as { id: string };

    db.public.none(
      `INSERT INTO request_status_history (support_request_id, old_status, new_status, note)
       VALUES (${sqlValue(request.id)}, 'received', 'checking', 'Support started review')`,
    );

    const history = db.public.one(
      `SELECT new_status FROM request_status_history WHERE support_request_id = ${sqlValue(request.id)}`,
    ) as { new_status: string };

    expect(history.new_status).toBe('checking');
  });
});
