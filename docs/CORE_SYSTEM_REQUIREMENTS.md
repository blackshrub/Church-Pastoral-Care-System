# FaithFlow Enterprise - Requirements for FaithTracker Integration

## Overview
FaithTracker (pastoral care app) needs to sync member data from FaithFlow Enterprise (core system) to maintain data consistency while keeping pastoral care operations local.

---

## What FaithTracker Will Do
- Pull member data from FaithFlow Enterprise every 6 hours
- Use existing `GET /api/members/` endpoint
- Authenticate using JWT (same as existing API)
- Merge member profile data while preserving care event history

---

## Requirements for Core System (FaithFlow Enterprise)

### ✅ Already Available (No Changes Needed)
These endpoints already exist and work perfectly:

1. **Authentication:**
   - `POST /api/auth/login` - Get JWT token
   - Response includes: `access_token`, `token_type`, `user` object

2. **Member List:**
   - `GET /api/members/` - List all members
   - Returns array with: `id`, `church_id`, `full_name`, `phone_whatsapp`, `date_of_birth`, `photo_base64`, `gender`, `personal_id_code`, `member_status`, `is_active`
   - Supports query params: `search`, `status`, `demographic`

3. **JWT Authentication:**
   - Authorization header: `Bearer {token}`
   - Token includes `church_id` for multi-tenant filtering

---

## What We Need from You (Core System Admin)

### 1. Service Account Credentials
Please provide dedicated API credentials for FaithTracker sync:

**Email:** `faithtracker-sync@yourdomain.com` (or similar)  
**Password:** [Strong password]  
**Role:** Should have read-only access to members  
**Church Access:** All campuses that use FaithTracker

**Why?** 
- Avoids using personal admin credentials
- Can be revoked independently if needed
- Audit trail shows "faithtracker-sync" as the API user

### 2. API Base URL
Please confirm the production API URL:

**Expected:** `https://faithflow.yourdomain.com/api`  
**Or:** `https://api.yourdomain.com`

### 3. Field Mapping Confirmation
Please verify these fields are available in `GET /api/members/` response:

**Required Fields:**
- `id` - Member UUID (maps to external_member_id in FaithTracker)
- `church_id` - Campus identifier
- `full_name` - Member's full name
- `phone_whatsapp` - Phone number (will be normalized to +6281xxx format)
- `is_active` - Boolean to determine if member should be archived

**Optional Fields (if available):**
- `date_of_birth` - For birthday tracking
- `photo_base64` - Profile photo (base64 encoded)
- `gender` - Male/Female
- `personal_id_code` - External ID reference
- `member_status` - Membership status

### 4. Rate Limiting
FaithTracker will call `GET /api/members/` every 6 hours (4 times per day).

**Please confirm:**
- Is this acceptable for your API rate limits?
- Do we need to request higher limits?
- Are there any specific API usage restrictions?

---

## What FaithTracker Will NOT Do

❌ **Will NOT:**
- Modify core member data (read-only access)
- Create new members in core system
- Delete members from core system
- Access events, devotions, accounting, or other core modules
- Share pastoral care data back to core (care events stay private)

✅ **Will ONLY:**
- Read member list periodically
- Update local member profiles to match core
- Preserve all pastoral care history locally

---

## Testing Requirements

Before going live, please provide:

1. **Test Environment:**
   - Test API URL: `https://test.faithflow.yourdomain.com/api`
   - Test credentials (email/password)
   - Sample church_id with test member data

2. **Sample Data:**
   - At least 5-10 test members
   - Include variety: active/inactive, with/without photos

---

## Security Considerations

**On Your Side (Core System):**
- Service account should have minimal permissions (read-only members)
- Monitor API usage from FaithTracker sync account
- Set appropriate rate limits if needed

**On Our Side (FaithTracker):**
- Credentials stored encrypted in database
- API calls over HTTPS only
- JWT tokens refreshed automatically
- Sync logs maintained for audit

---

## Timeline

**Phase 1:** Configuration & Testing (Week 1)
- Admin configures sync in FaithTracker settings
- Test sync with staging environment
- Verify data mapping is correct

**Phase 2:** Production Deployment (Week 2)
- Enable scheduled sync (every 6 hours)
- Monitor sync logs
- Verify member data consistency

---

## Questions for Core System Team

1. **Service Account:**
   - Can you create a dedicated service account for FaithTracker?
   - What email/password should we use?

2. **API Access:**
   - Is production API URL: `https://[domain]/api`?
   - Any IP whitelisting required?
   - Any specific headers needed beyond Authorization?

3. **Rate Limits:**
   - Is 4 API calls per day acceptable?
   - Each call fetches all members for one church (~100-500 members)
   - Should we paginate if church has >1000 members?

4. **Testing:**
   - Can you provide test environment access?
   - Which church_id should we use for testing?

5. **Future Enhancement:**
   - Are you open to implementing webhooks later for real-time sync?
   - This would require adding webhook triggers on member create/update/delete

---

## Contact

**FaithTracker Team:**
- Email: [your-email]
- For questions about sync integration

**Expected Response:**
- Service account credentials
- Production API URL
- Confirmation of field availability
- Any special requirements or restrictions

---

## Summary

**What you need to provide:**
1. ✅ Service account credentials (email/password)
2. ✅ Production API base URL
3. ✅ Confirmation that `GET /api/members/` returns expected fields
4. ✅ Any rate limiting or access restrictions

**What we'll handle:**
- All sync implementation in FaithTracker
- Configuration UI for admins
- Scheduled sync job
- Data merging and archival logic
- Error handling and retry logic

**Ready to proceed once we have credentials!** 🚀
