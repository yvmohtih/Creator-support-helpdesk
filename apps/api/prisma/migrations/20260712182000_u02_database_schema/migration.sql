-- U02: Database Schema and Migrations
-- Creates the MVP support request schema only. No business APIs or UI features.

CREATE SCHEMA IF NOT EXISTS "public";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "AdminRole" AS ENUM ('admin', 'support_agent');
CREATE TYPE "Platform" AS ENUM ('instagram', 'facebook', 'youtube', 'other');
CREATE TYPE "PreferredLanguage" AS ENUM ('en', 'te');
CREATE TYPE "RequestStatus" AS ENUM (
    'received',
    'checking',
    'need_more_details',
    'solution_provided',
    'completed'
);
CREATE TYPE "RequestPriority" AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE "MessageSenderType" AS ENUM ('user', 'admin', 'system');
CREATE TYPE "AttachmentUploadedBy" AS ENUM ('user', 'admin');

CREATE TABLE "admin_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "auth_user_id" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(160) NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'support_agent',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_admin_profiles_full_name_not_blank" CHECK (length(btrim("full_name")) > 0)
);

CREATE TABLE "issue_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "platform" "Platform" NOT NULL,
    "name_en" VARCHAR(120) NOT NULL,
    "name_te" VARCHAR(120) NOT NULL,
    "description_en" TEXT,
    "description_te" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "issue_categories_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_issue_categories_name_en_not_blank" CHECK (length(btrim("name_en")) > 0),
    CONSTRAINT "chk_issue_categories_name_te_not_blank" CHECK (length(btrim("name_te")) > 0),
    CONSTRAINT "chk_issue_categories_sort_order_non_negative" CHECK ("sort_order" >= 0)
);

CREATE TABLE "support_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "request_number" VARCHAR(32) NOT NULL,
    "platform" "Platform" NOT NULL,
    "category_id" UUID NOT NULL,
    "user_name" VARCHAR(160) NOT NULL,
    "platform_username" VARCHAR(255),
    "mobile_number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "description" TEXT NOT NULL,
    "preferred_language" "PreferredLanguage" NOT NULL DEFAULT 'te',
    "status" "RequestStatus" NOT NULL DEFAULT 'received',
    "priority" "RequestPriority" NOT NULL DEFAULT 'normal',
    "assigned_admin_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),
    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_support_requests_request_number_format" CHECK ("request_number" ~ '^RB-[0-9]{4}-[A-Z0-9]{6}$'),
    CONSTRAINT "chk_support_requests_user_name_not_blank" CHECK (length(btrim("user_name")) > 0),
    CONSTRAINT "chk_support_requests_mobile_number_not_blank" CHECK (length(btrim("mobile_number")) > 0),
    CONSTRAINT "chk_support_requests_description_not_blank" CHECK (length(btrim("description")) > 0),
    CONSTRAINT "chk_support_requests_email_basic_format" CHECK ("email" IS NULL OR "email" ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

CREATE TABLE "request_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "support_request_id" UUID NOT NULL,
    "sender_type" "MessageSenderType" NOT NULL,
    "sender_admin_id" UUID,
    "message" TEXT NOT NULL,
    "is_internal_note" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "request_messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_request_messages_message_not_blank" CHECK (length(btrim("message")) > 0),
    CONSTRAINT "chk_request_messages_user_not_internal" CHECK (NOT ("sender_type" = 'user' AND "is_internal_note" = true)),
    CONSTRAINT "chk_request_messages_admin_sender_reference" CHECK (("sender_type" <> 'admin') OR "sender_admin_id" IS NOT NULL)
);

CREATE TABLE "request_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "support_request_id" UUID NOT NULL,
    "request_message_id" UUID,
    "storage_path" TEXT NOT NULL,
    "original_file_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(120) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_by" "AttachmentUploadedBy" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "request_attachments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_request_attachments_storage_path_not_blank" CHECK (length(btrim("storage_path")) > 0),
    CONSTRAINT "chk_request_attachments_original_file_name_not_blank" CHECK (length(btrim("original_file_name")) > 0),
    CONSTRAINT "chk_request_attachments_mime_type_not_blank" CHECK (length(btrim("mime_type")) > 0),
    CONSTRAINT "chk_request_attachments_file_size_positive" CHECK ("file_size" > 0)
);

CREATE TABLE "request_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "support_request_id" UUID NOT NULL,
    "old_status" "RequestStatus",
    "new_status" "RequestStatus" NOT NULL,
    "changed_by_admin_id" UUID,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "request_status_history_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "chk_request_status_history_status_changed" CHECK ("old_status" IS NULL OR "old_status" <> "new_status")
);

CREATE UNIQUE INDEX "admin_profiles_auth_user_id_key" ON "admin_profiles"("auth_user_id");
CREATE INDEX "idx_admin_profiles_role" ON "admin_profiles"("role");
CREATE INDEX "idx_admin_profiles_is_active" ON "admin_profiles"("is_active");

CREATE INDEX "idx_issue_categories_platform_active_sort" ON "issue_categories"("platform", "is_active", "sort_order");
CREATE UNIQUE INDEX "uq_issue_categories_platform_name_en" ON "issue_categories"("platform", "name_en");
CREATE UNIQUE INDEX "uq_issue_categories_id_platform" ON "issue_categories"("id", "platform");

CREATE UNIQUE INDEX "support_requests_request_number_key" ON "support_requests"("request_number");
CREATE INDEX "idx_support_requests_status" ON "support_requests"("status");
CREATE INDEX "idx_support_requests_platform" ON "support_requests"("platform");
CREATE INDEX "idx_support_requests_mobile_number" ON "support_requests"("mobile_number");
CREATE INDEX "idx_support_requests_created_at" ON "support_requests"("created_at");
CREATE INDEX "idx_support_requests_category_id" ON "support_requests"("category_id");
CREATE INDEX "idx_support_requests_assigned_admin_id" ON "support_requests"("assigned_admin_id");

CREATE INDEX "idx_request_messages_request_created_at" ON "request_messages"("support_request_id", "created_at");
CREATE INDEX "idx_request_messages_sender_admin_id" ON "request_messages"("sender_admin_id");

CREATE INDEX "idx_request_attachments_request_id" ON "request_attachments"("support_request_id");
CREATE INDEX "idx_request_attachments_message_id" ON "request_attachments"("request_message_id");

CREATE INDEX "idx_request_status_history_request_created_at" ON "request_status_history"("support_request_id", "created_at");
CREATE INDEX "idx_request_status_history_admin_id" ON "request_status_history"("changed_by_admin_id");

ALTER TABLE "support_requests"
    ADD CONSTRAINT "support_requests_category_id_fkey"
    FOREIGN KEY ("category_id") REFERENCES "issue_categories"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "support_requests"
    ADD CONSTRAINT "support_requests_category_platform_fkey"
    FOREIGN KEY ("category_id", "platform") REFERENCES "issue_categories"("id", "platform")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "support_requests"
    ADD CONSTRAINT "support_requests_assigned_admin_id_fkey"
    FOREIGN KEY ("assigned_admin_id") REFERENCES "admin_profiles"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "request_messages"
    ADD CONSTRAINT "request_messages_support_request_id_fkey"
    FOREIGN KEY ("support_request_id") REFERENCES "support_requests"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "request_messages"
    ADD CONSTRAINT "request_messages_sender_admin_id_fkey"
    FOREIGN KEY ("sender_admin_id") REFERENCES "admin_profiles"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "request_attachments"
    ADD CONSTRAINT "request_attachments_support_request_id_fkey"
    FOREIGN KEY ("support_request_id") REFERENCES "support_requests"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "request_attachments"
    ADD CONSTRAINT "request_attachments_request_message_id_fkey"
    FOREIGN KEY ("request_message_id") REFERENCES "request_messages"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "request_status_history"
    ADD CONSTRAINT "request_status_history_support_request_id_fkey"
    FOREIGN KEY ("support_request_id") REFERENCES "support_requests"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "request_status_history"
    ADD CONSTRAINT "request_status_history_changed_by_admin_id_fkey"
    FOREIGN KEY ("changed_by_admin_id") REFERENCES "admin_profiles"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_admin_profiles_updated_at"
    BEFORE UPDATE ON "admin_profiles"
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "trg_issue_categories_updated_at"
    BEFORE UPDATE ON "issue_categories"
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "trg_support_requests_updated_at"
    BEFORE UPDATE ON "support_requests"
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
