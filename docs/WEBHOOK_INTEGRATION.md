# Webhook Integration Guide

Complete guide for integrating FaithFlow Enterprise webhooks with FaithTracker.

---

## Overview

FaithTracker supports real-time member data synchronization via webhooks from FaithFlow Enterprise (core system). When a member is created, updated, or deleted in the core system, FaithTracker is notified immediately and syncs only that specific member.

**Benefits:**
- ⚡ Real-time updates (1-2 seconds)
- 🎯 Efficient (syncs only changed member)
- 🔒 Secure (HMAC-SHA256 signatures)
- 📊 Logged (complete audit trail)

---

## Webhook Endpoint

**URL:** `https://your-faithtracker-domain.com/api/sync/webhook`

**Method:** POST

**Content-Type:** application/json

---

## Authentication & Security

### HMAC-SHA256 Signature

**All webhook requests MUST include a signature header:**

```
X-Webhook-Signature: {calculated_signature}
```

### Signature Generation (Python)

```python
import hmac
import hashlib
import json

# 1. Get webhook secret from FaithTracker
#    (Settings → API Sync → Active Sync Configuration → Webhook Secret)
webhook_secret = "YOUR_WEBHOOK_SECRET_FROM_FAITHTRACKER"

# 2. Prepare payload
payload = {
    "event_type": "member.updated",
    "church_id": "3880a17d-f858-4622-87c2-96eaa7b25c83",
    "member_id": "8655d76b-9be0-4681-bd2c-35cd5e09a809",
    "timestamp": "2025-11-20T01:40:00Z"
}

# 3. Convert to JSON bytes (NO extra spaces!)
payload_json = json.dumps(payload, separators=(',', ':'))
payload_bytes = payload_json.encode('utf-8')

# 4. Calculate HMAC-SHA256 signature
signature = hmac.new(
    webhook_secret.encode('utf-8'),
    payload_bytes,
    hashlib.sha256
).hexdigest()

# 5. Send webhook
import requests
response = requests.post(
    "https://your-faithtracker-domain.com/api/sync/webhook",
    data=payload_json,  # Send as raw JSON string
    headers={
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature  # Just hex hash, no prefix
    }
)

print(response.status_code, response.json())
```

### ⚠️ Critical Requirements

**Secret:**
- Must be UTF-8 encoded
- Exact secret from FaithTracker (case-sensitive)

**Payload:**
- Hash the **raw request body** (exact bytes being sent)
- Use UTF-8 encoding
- No extra spaces or formatting

**Signature:**
- Algorithm: SHA256 (not SHA1 or SHA512)
- Method: HMAC (not plain hash)
- Output: Lowercase hexadecimal string (64 characters)
- Header: `X-Webhook-Signature` (case-sensitive)
- Format: Just the hash (no "sha256=" prefix)

**Example:**
```
Webhook Secret: "TFRuCW5KkeGC_YF_wrBL..."
Payload: {"event_type":"member.updated","church_id":"xxx"}
Signature: "a1b2c3d4e5f6789..." (64-char hex)
Header: X-Webhook-Signature: a1b2c3d4e5f6789...
```

---

## Payload Format

### Required Fields

```json
{
  "event_type": "member.updated",
  "church_id": "3880a17d-f858-4622-87c2-96eaa7b25c83",
  "member_id": "8655d76b-9be0-4681-bd2c-35cd5e09a809",
  "timestamp": "2025-11-20T01:40:00Z"
}
```

**Field Descriptions:**
- `event_type` (required): Event type - see Event Types below
- `church_id` or `campus_id` (required): Church/campus identifier
- `member_id` (required for member events): Member UUID
- `timestamp` (optional): ISO 8601 timestamp

### Event Types

**Supported:**
- `test` or `ping` - Test webhook connection
- `member.created` - New member created
- `member.updated` - Member data changed
- `member.deleted` - Member deactivated/deleted

**Examples:**

**Test Webhook:**
```json
{
  "event_type": "test",
  "church_id": "3880a17d-f858-4622-87c2-96eaa7b25c83",
  "timestamp": "2025-11-20T01:40:00Z"
}
```

**Member Updated:**
```json
{
  "event_type": "member.updated",
  "church_id": "3880a17d-f858-4622-87c2-96eaa7b25c83",
  "member_id": "8655d76b-9be0-4681-bd2c-35cd5e09a809",
  "timestamp": "2025-11-20T01:40:00Z"
}
```

**Member Created:**
```json
{
  "event_type": "member.created",
  "church_id": "3880a17d-f858-4622-87c2-96eaa7b25c83",
  "member_id": "new-member-uuid-here",
  "timestamp": "2025-11-20T01:40:00Z"
}
```

**Member Deleted:**
```json
{
  "event_type": "member.deleted",
  "church_id": "3880a17d-f858-4622-87c2-96eaa7b25c83",
  "member_id": "deleted-member-uuid",
  "timestamp": "2025-11-20T01:40:00Z"
}
```

---

## Response Format

### Success Responses

**Test Webhook:**
```json
{
  "success": true,
  "message": "Webhook test successful! FaithTracker is ready to receive member updates.",
  "timestamp": "2025-11-20T01:40:03.519522+00:00"
}
```

**Member Event:**
```json
{
  "success": true,
  "message": "Member updated: SUMARNI NINGSIH",
  "member_id": "8655d76b-9be0-4681-bd2c-35cd5e09a809"
}
```

### Error Responses

**Missing Signature:**
```json
{
  "detail": "Missing webhook signature"
}
```
HTTP Status: 401

**Invalid Signature:**
```json
{
  "detail": "Invalid webhook signature"
}
```
HTTP Status: 401

**Missing campus_id:**
```json
{
  "detail": "Missing campus_id in payload"
}
```
HTTP Status: 400

**Sync Not Configured:**
```json
{
  "detail": "Sync not configured for this campus"
}
```
HTTP Status: 404

**Sync Disabled:**
```json
{
  "detail": "Sync is disabled for this campus"
}
```
HTTP Status: 403

---

## FaithTracker Configuration

### Step 1: Get Webhook Credentials

1. Log into FaithTracker as Admin
2. Go to **Settings → API Sync** tab
3. Configure sync:
   - Choose "Webhook" as sync method
   - Enter core API credentials
   - Save configuration
4. Copy webhook credentials:
   - **Webhook URL**: `https://your-domain.com/api/sync/webhook`
   - **Webhook Secret**: [32-character token]

### Step 2: Configure in FaithFlow Enterprise

In your FaithFlow Enterprise system:

1. Navigate to webhook configuration settings
2. Add webhook:
   - **URL**: [Webhook URL from FaithTracker]
   - **Secret**: [Webhook Secret from FaithTracker]
   - **Algorithm**: HMAC-SHA256
   - **Header Name**: X-Webhook-Signature
3. Enable events:
   - member.created
   - member.updated
   - member.deleted
4. Test webhook (event_type: "test")

---

## How It Works

### Webhook Flow

1. **Core System Event:**
   - Member updated in FaithFlow Enterprise
   - Webhook triggered

2. **Sign Payload:**
   - Calculate HMAC-SHA256 signature
   - Add to X-Webhook-Signature header

3. **Send to FaithTracker:**
   - POST to webhook endpoint
   - Include signed payload

4. **FaithTracker Processing:**
   - Verify signature (security)
   - Match church_id to campus
   - Check if sync enabled
   - Fetch specific member from core API: `GET /api/members/{member_id}`
   - Update member in FaithTracker database
   - Log webhook delivery

5. **Real-Time Update:**
   - Member data updated (1-2 seconds)
   - Care events preserved
   - Engagement status maintained

### Member Sync Process

**For member.created:**
- Fetches member from core API
- Creates new member in FaithTracker
- Applies sync filters (if configured)
- Sets initial engagement status
- Logs creation

**For member.updated:**
- Fetches updated member data
- Updates: name, phone, gender, birth_date, photo
- Preserves: care events, engagement, notes
- Calculates age from birth_date
- Logs update

**For member.deleted:**
- Archives member in FaithTracker
- Sets: is_archived=true, archived_reason="Deleted in core system"
- Preserves all care event history
- Logs archival

---

## Testing

### Test Webhook Connection

```bash
# Python test script
import hmac, hashlib, json, requests

webhook_url = "https://your-faithtracker-domain.com/api/sync/webhook"
webhook_secret = "YOUR_SECRET_HERE"

payload = {
    "event_type": "test",
    "church_id": "YOUR_CHURCH_ID"
}

payload_json = json.dumps(payload, separators=(',', ':'))
signature = hmac.new(
    webhook_secret.encode('utf-8'),
    payload_json.encode('utf-8'),
    hashlib.sha256
).hexdigest()

response = requests.post(
    webhook_url,
    data=payload_json,
    headers={
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature
    }
)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Webhook test successful! FaithTracker is ready to receive member updates."
}
```

### Test Member Update

```python
payload = {
    "event_type": "member.updated",
    "church_id": "YOUR_CHURCH_ID",
    "member_id": "MEMBER_UUID_HERE",
    "timestamp": "2025-11-20T01:40:00Z"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Member updated: MEMBER NAME",
  "member_id": "..."
}
```

---

## Troubleshooting

### "Missing webhook signature"
- Add `X-Webhook-Signature` header
- Value should be the HMAC-SHA256 hash

### "Invalid webhook signature"
- Check webhook secret is correct
- Hash the exact payload being sent
- Use UTF-8 encoding
- Output as lowercase hex
- No "sha256=" prefix

### "Missing campus_id in payload"
- Include `church_id` or `campus_id` in payload
- Must match church ID from FaithFlow

### "Sync not configured for this campus"
- Configure sync in FaithTracker Settings
- Save configuration with correct church
- Ensure `core_church_id` is stored

### "Sync is disabled for this campus"
- Enable sync in FaithTracker Settings
- Check "Enable Member Data Sync"
- Save configuration

### "Member not found"
- Check `member_id` is correct
- Verify member exists in core system
- Check core API GET /api/members/{member_id}

---

## Webhook Logs

FaithTracker logs all webhook deliveries in `webhook_logs` collection:

```javascript
{
  "id": "log-uuid",
  "campus_id": "campus-uuid",
  "event_type": "member.updated",
  "member_id": "member-uuid",
  "payload": {...},
  "signature_valid": true,
  "received_at": "2025-11-20T01:40:03.519522+00:00"
}
```

**View Logs:**
- Check MongoDB: `db.webhook_logs.find().sort({received_at: -1}).limit(10)`
- Backend logs: `tail -f /var/log/supervisor/backend.err.log | grep webhook`

---

## Best Practices

### 1. Security
- Rotate webhook secrets every 90 days
- Use HTTPS only (not HTTP)
- Validate signatures on every request
- Log all deliveries for audit

### 2. Reliability
- Implement retry logic (3 retries with exponential backoff)
- Handle timeout errors
- Log failed deliveries
- Enable daily reconciliation as safety net

### 3. Performance
- Send webhooks asynchronously (don't block)
- Include only minimal data in payload
- Use member_id (FaithTracker fetches full data)
- Batch events if possible (future enhancement)

### 4. Monitoring
- Monitor webhook delivery success rate
- Alert on failed webhooks
- Check FaithTracker sync logs
- Verify data consistency weekly

---

## FAQ

**Q: What happens if webhook fails?**
A: FaithTracker has daily reconciliation at 3 AM that catches missed updates.

**Q: How fast are webhook updates?**
A: 1-2 seconds from core system change to FaithTracker update.

**Q: Can I test webhooks without affecting production?**
A: Yes, use event_type: "test" or "ping" - returns success without syncing.

**Q: What if multiple members change at once?**
A: Send one webhook per member. FaithTracker processes them in parallel.

**Q: Does FaithTracker validate the webhook payload?**
A: Yes, signature is validated, and campus_id must match a configured sync.

**Q: What data gets synced via webhook?**
A: Basic profile only (name, phone, gender, birth_date, photo). Care events stay local.

**Q: Can webhooks create new members?**
A: Yes, if event_type is "member.created" and member passes sync filters.

**Q: What about deleted members?**
A: They are archived (hidden) but all care history is preserved.

---

## Support

For webhook integration issues:
- Check FaithTracker backend logs
- Check webhook_logs collection in MongoDB
- Verify signature generation matches specification
- Test with event_type: "test" first

**Contact:**
- GitHub Issues: [Your repo URL]
- Email: support@yourdomain.com

---

**Last Updated:** 2025-11-20
**FaithTracker Version:** 2.0.0
