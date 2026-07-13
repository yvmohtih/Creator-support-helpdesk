# Storage Notes

## Screenshot Uploads

U08 uses the configured S3-compatible storage provider for screenshots.

Storage model:

- Screenshot binaries are stored outside PostgreSQL.
- `request_attachments` stores metadata only.
- Objects are private by default; no public ACL is set.
- Future admin viewing should use authenticated or signed access.
- Public users never receive storage paths, bucket names, or internal object IDs.

Path format:

```text
support-requests/{request-id}/{generated-file-id}.{extension}
```

Validation:

- Maximum files per request: 3
- Maximum size per file: 5 MB
- Maximum combined upload size: 12 MB
- Allowed formats: JPEG, JPG, PNG, WEBP
- Server checks count, size, combined size, MIME type, extension, duplicate file selection, and image magic bytes.
- Original filenames are preserved only as metadata and are never used as storage keys.

Cleanup strategy:

- If no screenshots are selected, request creation proceeds normally.
- If screenshots are selected, all selected screenshots must validate and upload.
- If a later upload fails, already-uploaded objects from that submission are deleted.
- If database attachment creation fails after upload, uploaded objects from that submission are deleted.
- The request is not marked successful unless required screenshot processing succeeds.

Known limitations:

- Upload idempotency is in-memory for the MVP, matching U07 request idempotency.
- Image metadata stripping is not implemented.
- Admin signed download URLs are not implemented yet.
