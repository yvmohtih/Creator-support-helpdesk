# API Notes

## Public Support Requests

### `POST /api/v1/public/support-requests`

Saves a public support request after the user reviews the preview screen.

Request body:

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

Successful response:

```json
{
  "success": true,
  "data": {
    "requestNumber": "RB-2026-AB2CDE",
    "platform": "instagram",
    "categoryName": "Account disabled",
    "maskedMobile": "••••••3210",
    "submittedAt": "2026-07-13T07:00:00.000Z"
  }
}
```

Behavior:

- Validates platform, category, contact details, description, language, and consent on the server.
- Confirms the category exists and is active in the database.
- Creates the support request and initial status history in one transaction.
- Generates the request number on the server.
- Uses the idempotency key to avoid duplicate rows when a user submits twice.
- Returns only safe confirmation details.

Not implemented yet:

- Screenshot upload API
- Request tracking API
- Admin dashboard support request APIs
- Admin replies, internal notes, and status update APIs
