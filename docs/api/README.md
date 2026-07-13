# API Notes

## Public Support Requests

### `POST /api/v1/public/support-requests`

Saves a public support request after the user reviews the preview screen.

Use JSON when there are no screenshots:

```json
{
  "platform": "instagram",
  "category": "account-disabled",
  "idempotencyKey": "browser-generated-key",
  "name": "User name",
  "platformHandle": "creator_page",
  "mobile": "9876543210",
  "email": "optional@example.com",
  "description": "Problem details in Telugu or English.",
  "preferredLanguage": "en",
  "consent": true
}
```

Use multipart form data when screenshots are selected. Send the same text fields plus file parts named `screenshots`.

Screenshot limits:

- Maximum files: 3
- Maximum size per file: 5 MB
- Maximum combined upload size: 12 MB
- Allowed formats: JPEG, JPG, PNG, WEBP

Successful response:

```json
{
  "success": true,
  "data": {
    "requestNumber": "RB-2026-AB2CDE",
    "platform": "instagram",
    "categoryName": "Account disabled",
    "maskedMobile": "••••••3210",
    "submittedAt": "2026-07-13T07:00:00.000Z",
    "attachmentCount": 1
  }
}
```

Behavior:

- Validates platform, category, contact details, description, language, and consent on the server.
- Confirms the category exists and is active in the database.
- Creates the support request and initial status history in one transaction.
- Generates the request number on the server.
- Validates screenshots by count, size, combined size, MIME type, extension, duplicate selection, and magic bytes.
- Uploads screenshots to private S3-compatible storage using generated storage paths.
- Creates one `request_attachments` row per successfully stored screenshot.
- Cleans up uploaded objects if a later upload or database write fails.
- Uses the idempotency key to avoid duplicate rows and duplicate attachments when a user submits twice in the same running process.
- Returns only safe confirmation details.

Not implemented yet:

- Request tracking API
- Admin dashboard support request APIs
- Admin replies, internal notes, and status update APIs
