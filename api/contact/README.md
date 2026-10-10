# ONN Technologies secure contact endpoint

This folder defines the contract for the website contact backend.

## Request
POST JSON:
- name (required)
- company
- email (required)
- phone
- service
- message
- website (honeypot; must be empty)

## Response
- 200: {"ok":true}
- 400: invalid input
- 429: rate limited
- 500/502: mail delivery unavailable

## Security requirements
- Never expose Microsoft credentials, client secrets, or mailbox tokens in browser code.
- Allow requests only from the ONN Technologies website origin.
- Validate and length-limit all fields server-side.
- Reject the honeypot field when populated.
- Add rate limiting before production.
- Send notifications to information@onntechnologies.co.za.
- Keep the existing FormSubmit flow live until this endpoint is deployed and tested.
