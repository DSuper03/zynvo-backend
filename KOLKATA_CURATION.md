# Kolkata event curation

The hourly Worker job reads the Kolkata Centre for Creativity calendar and queues up to three new listings for review. It verifies the title, date and venue against the organizer page, deduplicates by listing ID and normalized event details, and skips expired or unparseable dates. Prices that the organizer does not label are shown as unknown.

## Activate

1. Apply the Kolkata curation migration to the database before deploying the Worker. Keep the existing Firebase bindings.
2. Create a dedicated Telegram bot and open its private chat as the reviewer. Set the Worker bindings KOLKATA_BOT_TOKEN, KOLKATA_REVIEWER_ID (the numeric Telegram user ID), and KOLKATA_WEBHOOK_SECRET (a random Telegram-compatible secret). Use Worker secrets for the token and webhook secret.
3. Register the dedicated bot's webhook with Telegram setWebhook. Set url to the deployed Worker URL plus /api/v1/kolkata-events/telegram, secret_token to the same webhook secret, and allowed_updates to ["callback_query"].
4. Release the mobile changes after the backend is reachable. On Android, enable notifications and then turn on **Kolkata event alerts** under **Discover → Kolkata events** on a test account.
5. Wait for the next hourly scan. Confirm **Publish** creates a listing without sending a push. Then confirm **Publish + Notify** opens the listing on a locked Android phone subscribed to the topic.

## Review behavior

- **Publish** adds a listing to Discover and makes its share link available.
- **Publish + Notify** also sends an alert on the Kolkata topic. The database reserves at most one approval per Kolkata calendar day. Repeated callbacks do not resend.
- **Skip** dismisses the listing. The same event stays skipped on subsequent scans.
- Approval rechecks the organizer page. If the details change before approval, the Worker queues a replacement review. Organizer pages remain the source of truth for registration and any changes after publication.
- If Firebase delivery cannot be confirmed, the listing stays published and the bot reports the failure. The Worker does not automatically retry an ambiguous send.
