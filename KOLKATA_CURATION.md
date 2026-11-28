# Kolkata lunchtime alerts

The Worker scans the Kolkata Centre for Creativity calendar hourly and queues up to three new listings for Telegram review. The organizer page supplies the venue and date. Approval and delivery each recheck the source.

## Activate

1. Apply both Kolkata curation migrations before deploying the Worker. Keep the existing Firebase bindings.
2. Configure a dedicated Telegram bot. Set KOLKATA_BOT_TOKEN, KOLKATA_REVIEWER_ID (the numeric Telegram user ID), and KOLKATA_WEBHOOK_SECRET. Store the token and webhook secret as Worker secrets.
3. Register the bot webhook at /api/v1/kolkata-events/telegram on the deployed Worker. Set secret_token to KOLKATA_WEBHOOK_SECRET and allowed_updates to ["message", "callback_query"].
4. Release the matching Android OTA. From **Profile → Menu → Kolkata lunchtime alerts**, choose a campus area and turn on alerts on a test account. Existing subscribers for recognized campuses move to their area when their Android device registers again.
5. Approve a pick and check a locked Android phone for the alert during the next 1–2 pm IST window.

## Review and delivery

- An organizer event review has an approve button for each campus area. Select the area the event is relevant to or skip it.
- For a place suggestion, send the bot **/spot area | title | address | useful tip**. Area values are beliaghata, garia, and sector-v. Example: **/spot garia | The Time Pass Cafe | Dakshin Raipur, Garia | Board games; open until 11 pm**. Review the bot's card before approving.
- Approval reserves one alert per area per Kolkata calendar day. Approvals at or after 2 pm queue for the next day if the pick still qualifies.
- The Worker sends only between 1 and 2 pm IST. Android delivery expires at 2 pm. An empty queue sends nothing.
- Current Android builds open Maps or the organizer from the notification. Older builds can open the individual alert. The public event collection is empty.
- An ambiguous Firebase send is claimed once and reported privately to the reviewer. It is not automatically retried.
