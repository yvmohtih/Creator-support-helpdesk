-- U03: Admin Authentication & Authorization
-- Adds password hash storage for administrator-only login.

ALTER TABLE "admin_profiles"
    ADD COLUMN "password_hash" TEXT NOT NULL;

ALTER TABLE "admin_profiles"
    ADD CONSTRAINT "chk_admin_profiles_password_hash_not_blank"
    CHECK (length(btrim("password_hash")) > 0);
