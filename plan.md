# Church Pastoral Care Tracking System – Development Plan (REVISED)

## 1) Objectives (MVP-first - Pastoral Care Focused)

**Core Purpose:** Complementary pastoral care tool to existing member system - focusing on care tracking, grief support, and engagement monitoring.

**Key Objectives:**
- Track pastoral care events (birthday, childbirth, **extended grief support**, new house, accident/illness, hospital visits, financial aid, regular contact)
- **Extended Grief Support System** ⭐ - Track 6-stage grief journey (1 week, 2 weeks, 1 month, 3 months, 6 months, 1 year after mourning service)
- Hospital visitation logging with follow-up reminders
- Financial aid tracking by type (education, medical, emergency, housing, food, funeral costs)
- Engagement monitoring (last contact date, days since contact, at-risk alerts)
- Send reminders via WhatsApp gateway (http://dermapack.net:3001) - **VERIFIED WORKING**
- Multi-language support (Bahasa Indonesia default, English secondary)
- Simple member records with family grouping (for future integration with main member system)
- Apply warm, compassionate design (Primary: Sage, Secondary: Peach, Accent: Teal per design_guidelines.md)

**What This Tool Is NOT:**
- ❌ Not a full church management system
- ❌ Not replacing existing member database
- ❌ Not handling small groups, attendance, or offering management
- ❌ Not a prayer wall or public-facing app
- ✅ Focused on pastoral care team's daily work

---

## 2) Strategic Phases & Implementation Steps

### PHASE 1: Core Integration POC ✅ **COMPLETED**
**Status:** ✅ COMPLETED (2025-11-13)

**Goal:** Prove outbound notifications work reliably.

**Completed Work:**
- ✅ WhatsApp gateway integration verified at http://dermapack.net:3001
- ✅ Backend endpoints created: `/api/integrations/ping/whatsapp`, `/api/integrations/ping/email`
- ✅ Environment variables configured: `WHATSAPP_GATEWAY_URL`, `CHURCH_NAME` (GKBJ)
- ✅ React integration test screen built with data-testid attributes
- ✅ End-to-end WhatsApp message sent successfully to test number 6281290080025
- ✅ Response shape documented: `message_id`, `status`, `phone` format

**Key Findings:**
- WhatsApp API endpoint: `POST {gateway_url}/send/message`
- Request payload: `{"phone": "{number}@s.whatsapp.net", "message": "text"}`
- No authentication required for gateway
- Success response: `{"code": "SUCCESS", "results": {"message_id": "...", "status": "..."}}`
- Email integration explicitly deferred (WhatsApp-only mode)

**Exit Criteria Met:**
- ✅ WhatsApp test message successfully sent end-to-end
- ✅ Response shape documented with message_id and status
- ✅ Email endpoint returns clear "pending provider" message

---

### PHASE 2: Core MVP Development (Focused Pastoral Care) 🚧 **IN PROGRESS**
**Status:** 🚧 IN PROGRESS - Ready to implement

**Goal:** Working pastoral care system with grief support, hospital tracking, financial aid, and engagement monitoring.

#### **Backend (FastAPI + MongoDB)**

**Database Models (UUIDs, timezone-aware):**

1. **`Member`** (Simplified for pastoral care)
   - `id`: UUID (primary key)
   - `name`: string (required)
   - `phone`: string (WhatsApp number, required)
   - `photo_url`: string (nullable, local file upload)
   - `family_group_id`: UUID (nullable, links to FamilyGroup)
   - `last_contact_date`: datetime (auto-updated when care event added)
   - `engagement_status`: enum (Active, At Risk, Inactive) - auto-calculated
   - `days_since_last_contact`: integer (computed field)
   - `external_member_id`: string (nullable, for future integration with main system)
   - `notes`: text (pastoral notes)
   - `created_at`: datetime
   - `updated_at`: datetime

2. **`FamilyGroup`** (Household grouping)
   - `id`: UUID
   - `group_name`: string (e.g., "Smith Family")
   - `created_at`: datetime
   - `updated_at`: datetime

3. **`CareEvent`** (Enhanced with grief, hospital, financial aid)
   - `id`: UUID
   - `member_id`: UUID (foreign key to Member)
   - `event_type`: enum (birthday, childbirth, grief_loss, new_house, accident_illness, hospital_visit, financial_aid, regular_contact)
   - `event_date`: date (when event occurred or scheduled)
   - `title`: string (brief description)
   - `description`: text (detailed notes)
   - `completed`: boolean (default false)
   - `completed_at`: datetime (nullable)
   
   **Grief Support Fields:**
   - `grief_relationship`: string (nullable - spouse, parent, child, sibling, friend)
   - `mourning_service_date`: date (nullable)
   - `grief_stage`: enum (nullable - mourning, 1_week, 2_weeks, 1_month, 3_months, 6_months, 1_year)
   
   **Hospital Visit Fields:**
   - `hospital_name`: string (nullable)
   - `admission_date`: date (nullable)
   - `discharge_date`: date (nullable)
   - `visitation_log`: JSON array (nullable - [{visitor_name, visit_date, notes, prayer_offered}])
   
   **Financial Aid Fields:**
   - `aid_type`: enum (nullable - education, medical, emergency, housing, food, funeral_costs, other)
   - `aid_amount`: decimal (nullable)
   - `aid_notes`: text (nullable)
   
   - `reminder_sent`: boolean (default false)
   - `reminder_sent_at`: datetime (nullable)
   - `created_at`: datetime
   - `updated_at`: datetime

4. **`GriefSupport`** (Auto-generated grief support timeline)
   - `id`: UUID
   - `care_event_id`: UUID (foreign key to CareEvent - the initial grief/loss event)
   - `member_id`: UUID (foreign key to Member)
   - `stage`: enum (mourning, 1_week, 2_weeks, 1_month, 3_months, 6_months, 1_year)
   - `scheduled_date`: date (auto-calculated from mourning_service_date)
   - `completed`: boolean (default false)
   - `completed_at`: datetime (nullable)
   - `notes`: text (pastoral notes for this touchpoint)
   - `reminder_sent`: boolean (default false)
   - `created_at`: datetime
   - `updated_at`: datetime

5. **`NotificationLog`**
   - `id`: UUID
   - `care_event_id`: UUID (nullable, foreign key)
   - `grief_support_id`: UUID (nullable, foreign key)
   - `member_id`: UUID (foreign key)
   - `channel`: enum (whatsapp, email)
   - `recipient`: string (phone or email)
   - `message`: text
   - `status`: enum (sent, failed, pending)
   - `response_data`: JSON (gateway response)
   - `created_at`: datetime

**API Endpoints (all `/api/*`):**

**Members:**
- `GET /members` - List all members with filters (engagement_status, family_group_id, search)
- `POST /members` - Create new member
- `GET /members/{id}` - Get member details with care events timeline
- `PUT /members/{id}` - Update member
- `DELETE /members/{id}` - Delete member
- `POST /members/{id}/photo` - Upload profile photo
- `GET /members/at-risk` - Get members with no contact 30+ days

**Family Groups:**
- `GET /family-groups` - List all family groups
- `POST /family-groups` - Create family group
- `GET /family-groups/{id}` - Get family group with members
- `PUT /family-groups/{id}` - Update family group
- `DELETE /family-groups/{id}` - Delete family group

**Care Events:**
- `GET /care-events` - List all care events with filters (event_type, member_id, date_range)
- `POST /care-events` - Create care event (auto-creates GriefSupport timeline if grief_loss type)
- `GET /care-events/{id}` - Get care event details
- `PUT /care-events/{id}` - Update care event
- `DELETE /care-events/{id}` - Delete care event
- `POST /care-events/{id}/complete` - Mark care event as completed
- `POST /care-events/{id}/send-reminder` - Send WhatsApp reminder for this event

**Grief Support:**
- `GET /grief-support` - List all active grief support timelines
- `GET /grief-support/member/{member_id}` - Get grief timeline for specific member
- `POST /grief-support/{id}/complete` - Mark grief stage as completed with notes
- `POST /grief-support/{id}/send-reminder` - Send WhatsApp reminder for this stage

**Hospital Visits:**
- `POST /care-events/{id}/visitation-log` - Add visitation log entry
- `GET /care-events/hospital/due-followup` - Get hospital events needing follow-up

**Financial Aid:**
- `GET /financial-aid/summary` - Get aid summary by type and date range
- `GET /financial-aid/member/{member_id}` - Get all aid given to member

**Dashboard:**
- `GET /dashboard/stats` - Overall stats (total members, active grief support, at-risk members, this month's aid)
- `GET /dashboard/upcoming` - Upcoming events (next 7 days)
- `GET /dashboard/at-risk` - Members with no contact 30+ days
- `GET /dashboard/grief-active` - Members currently in grief support timeline
- `GET /dashboard/hospital-followup` - Hospital visits needing follow-up
- `GET /dashboard/recent-activity` - Last 20 care events

**Analytics:**
- `GET /analytics/engagement-trends` - Engagement over time
- `GET /analytics/care-events-by-type` - Distribution of care event types
- `GET /analytics/financial-aid-by-type` - Aid distribution by type
- `GET /analytics/grief-completion-rate` - % of grief stages completed

**Data Import/Export:**
- `POST /import/members/csv` - Import members from CSV
- `POST /import/members/json` - Import members from JSON (for API integration)
- `POST /import/members/manual` - Manual entry endpoint
- `GET /export/members/csv` - Export members to CSV
- `GET /export/care-events/csv` - Export care events to CSV

**Language:**
- `GET /i18n/translations/{lang}` - Get translations (id/en)

#### **Frontend (React + Shadcn)**

**Design System Implementation:**
- CSS custom properties for sage/peach/teal color palette (per design_guidelines.md)
- Google Fonts: Manrope (headings), Inter (body), Cormorant Garamond (hero)
- Dark mode toggle with system preference detection
- Sonner toasts for all user feedback (in selected language)
- data-testid on all interactive elements
- **Language toggle** (ID/EN) in header - default Bahasa Indonesia

**Screens/Components:**

1. **Dashboard** (`/` or `/dashboard`)
   - Language toggle in header (Indonesian flag 🇮🇩 / British flag 🇬🇧)
   - **Stats Cards:**
     - Total Members
     - Active Grief Support (count + list)
     - Members at Risk (30+ days no contact)
     - This Month's Financial Aid (total amount)
   
   - **Priority Widgets:**
     - **"Active Grief Support"** - Members in grief timeline with next stage due
     - **"Members at Risk"** - No contact 30+ days, sorted by days
     - **"Hospital Follow-ups Due"** - Post-discharge follow-ups needed
     - **"Upcoming Events"** - Next 7 days (birthdays, scheduled visits)
   
   - **Recent Activity Feed** - Last 10 care events
   - **Quick Actions:** "Add Member", "Add Care Event", "Record Hospital Visit", "Record Financial Aid"

2. **Members List** (`/members`)
   - Table view with search and filters
   - **Columns:** Photo, Name, Phone, Family Group, Last Contact, Days Since Contact, Engagement Status (color-coded badge), Actions
   - **Filters:** Engagement Status (Active/At Risk/Inactive), Family Group, Search by name
   - **Sort by:** Name, Last Contact Date, Days Since Contact
   - **Add Member** button
   - Click row → Member Detail

3. **Member Detail** (`/members/{id}`)
   - **Member Info Card:**
     - Profile photo (with upload button)
     - Name, Phone, Family Group
     - Last Contact: [date] ([X] days ago)
     - Engagement Status badge
     - Edit button
   
   - **Tabs:**
     - **Care Timeline** - Chronological timeline of all care events (color-coded by type)
     - **Grief Support** - If member has active grief timeline, show all 6 stages with completion status
     - **Hospital Visits** - List of hospital admissions with visitation logs
     - **Financial Aid** - History of aid received with types and amounts
     - **Family Members** - Other members in same family group
   
   - **Actions:**
     - "Add Care Event" button
     - "Send WhatsApp Message" button
     - "Mark Contact Today" button (creates regular_contact event)

4. **Add/Edit Member Form** (Modal)
   - Name (required)
   - Phone/WhatsApp (required)
   - Profile Photo (upload from local file)
   - Family Group (dropdown - create new or select existing)
   - External Member ID (for future integration)
   - Notes
   - Save button

5. **Add/Edit Care Event Form** (Modal or page)
   - Member selector (if not from member detail)
   - Event Type dropdown with icons and colors:
     - 🎂 Birthday
     - 👶 Childbirth
     - 💔 Grief/Loss ⭐
     - 🏠 New House
     - 🚑 Accident/Illness
     - 🏥 Hospital Visit
     - 💰 Financial Aid
     - 📞 Regular Contact
   
   - Event Date picker
   - Title (auto-filled based on type, editable)
   - Description/Notes
   
   - **Conditional Fields based on Event Type:**
     
     **If Grief/Loss:**
     - Relationship to deceased (dropdown: Spouse, Parent, Child, Sibling, Friend, Other)
     - Mourning Service Date (required - triggers auto-generation of 6-stage timeline)
     - Initial notes
     - **Info Alert:** "A 6-stage grief support timeline will be automatically created (1 week, 2 weeks, 1 month, 3 months, 6 months, 1 year)"
     
     **If Hospital Visit:**
     - Hospital Name
     - Admission Date
     - Discharge Date (optional)
     - Initial Visitation Log Entry (visitor name, notes, prayer offered)
     
     **If Financial Aid:**
     - Aid Type (dropdown: Education Support, Medical Bills, Emergency Relief, Housing Assistance, Food Support, Funeral Costs, Other)
     - Amount (number input)
     - Aid Notes (reason, details)
   
   - **Action Buttons:**
     - "Save" - Save event only
     - "Save & Send Reminder" - Save and immediately send WhatsApp reminder

6. **Grief Support Timeline View** (`/grief-support` or within Member Detail)
   - Visual timeline showing all 6 stages
   - Each stage shows:
     - Stage name (e.g., "1 Month After Loss")
     - Scheduled date
     - Status: Pending / Completed / Overdue
     - Completion date and notes (if completed)
     - "Mark Complete" button with notes modal
     - "Send Reminder" button
   - Progress bar showing completion percentage
   - Member info at top with photo and name

7. **Hospital Visitation Log** (Component within Care Event detail)
   - Table of all visits:
     - Date, Visitor Name, Notes, Prayer Offered (yes/no)
   - "Add Visitation Entry" button
   - Follow-up reminders section (3 days, 1 week, 2 weeks post-discharge)

8. **Financial Aid Dashboard** (`/financial-aid`)
   - **Summary Cards:**
     - Total Aid This Month
     - Total Aid This Year
     - Most Common Aid Type
   - **Aid by Type Chart** (pie chart)
   - **Recent Aid Table:**
     - Date, Member, Aid Type, Amount, Notes
   - **Filters:** Date Range, Aid Type, Member
   - Export to CSV button

9. **Analytics Dashboard** (`/analytics`)
   - **Engagement Trends** - Line chart showing contacts per week/month
   - **Care Events by Type** - Pie chart
   - **Financial Aid Distribution** - Bar chart by type
   - **Grief Support Completion Rate** - Percentage with breakdown
   - **Members by Engagement Status** - Donut chart
   - Date range selector
   - Export reports button

10. **Data Import/Export** (`/settings/import-export`)
    - **Import Section:**
      - CSV Upload (with template download)
      - JSON Import (for API integration)
      - Manual Entry (redirect to Add Member)
    - **Export Section:**
      - Export Members to CSV
      - Export Care Events to CSV
      - Date range selector for exports

11. **Integration Test Panel** (`/integrations`)
    - Keep existing WhatsApp test component
    - Link from settings area

**Loading/Empty/Error States:**
- Skeleton loaders for data fetching (especially member lists, timelines)
- **Empty State Illustrations:**
  - No members: "Add your first member to start pastoral care tracking"
  - No care events: "No care events yet. Record your first interaction."
  - No active grief support: "No members currently in grief support timeline"
- Error alerts with retry buttons
- Toast notifications for all actions (success/error) in selected language

#### **Multi-Language Support (ID/EN)**

**Implementation:**
- i18n library (react-i18next)
- Language toggle in header (flag icons: 🇮🇩 Indonesia / 🇬🇧 English)
- Default: Bahasa Indonesia
- Translations for:
  - All UI labels and buttons
  - Event type names
  - Aid type names
  - Dashboard widgets
  - Toast messages
  - WhatsApp message templates
  - Form validation messages
  - Empty state messages

**Translation Files:**
- `/frontend/src/locales/id.json` (Bahasa Indonesia - default)
- `/frontend/src/locales/en.json` (English - secondary)

**Key Translations:**
- Grief stages in both languages
- Financial aid types in both languages
- Engagement status labels
- All dashboard widget titles
- All form labels and placeholders

#### **User Stories (Enhanced):**

**Core Functionality:**
1. ✅ As a pastor, I can add a member with name, phone, and photo
2. ✅ As a pastor, I can group members by family/household
3. ✅ As a pastor, I can create care events for members
4. ✅ As a pastor, I can see upcoming events and at-risk members on dashboard

**Grief Support (Key Feature):**
5. ⭐ As a pastor, when I record a family member's death, the system auto-creates a 6-stage grief support timeline
6. ⭐ As a pastor, I can see all members currently in grief support with next stage due dates
7. ⭐ As a pastor, I can mark each grief stage as complete with notes on the member's emotional state
8. ⭐ As a pastor, I receive reminders for upcoming grief support touchpoints (1 week, 2 weeks, 1 month, 3 months, 6 months, 1 year)
9. ⭐ As a pastor, I can view a visual timeline of a member's grief journey with all completed and pending stages

**Hospital Care:**
10. ✅ As a pastor, I can record hospital admissions with hospital name and dates
11. ✅ As a pastor, I can log each hospital visit (who visited, when, what was discussed, prayer offered)
12. ✅ As a pastor, I see alerts for members needing post-discharge follow-up (3 days, 1 week, 2 weeks)
13. ✅ As a pastor, I can view complete visitation history for each hospital stay

**Financial Aid:**
14. ✅ As a pastor, I can record financial aid given to members with type and amount
15. ✅ As a pastor, I can see total aid given per member
16. ✅ As a pastor, I can view aid distribution by type (education, medical, emergency, etc.)
17. ✅ As a leader, I can export financial aid reports by date range

**Engagement Monitoring:**
18. ✅ As a pastor, I can see how many days since last contact for each member
19. ✅ As a pastor, I see color-coded alerts for members at risk (30+ days) and inactive (60+ days)
20. ✅ As a pastor, I can quickly mark "contacted today" for a member

**Communication:**
21. ✅ As a pastor, I can manually send WhatsApp reminders for care events
22. ✅ As a pastor, I can send WhatsApp messages in Bahasa Indonesia or English

**Data Management:**
23. ✅ As an admin, I can import members from CSV
24. ✅ As an admin, I can import members from JSON (for future API integration)
25. ✅ As an admin, I can manually enter members one by one
26. ✅ As an admin, I can export members and care events to CSV
27. ✅ As an admin, I can prepare for future integration with main member system (via external_member_id)

**Analytics:**
28. ✅ As a leader, I can view engagement trends over time
29. ✅ As a leader, I can see care event distribution by type
30. ✅ As a leader, I can track grief support completion rates

**Multi-Language:**
31. ✅ As a user, I can switch between Bahasa Indonesia and English
32. ✅ As a user, my language preference is remembered across sessions
33. ✅ As a pastor, all WhatsApp messages are sent in the selected language

#### **Exit Criteria:**

**Functionality:**
- ✅ End-to-end flow works: add member → add care event → see in dashboard → send WhatsApp reminder
- ✅ Grief support auto-timeline generation works when recording death in family
- ✅ All 6 grief stages can be marked complete with notes
- ✅ Hospital visitation logs can be added and viewed
- ✅ Financial aid tracking with types and amounts works
- ✅ Engagement status auto-calculates based on last contact date
- ✅ At-risk members (30+ days) show in dashboard
- ✅ All CRUD operations functional for members, family groups, care events
- ✅ WhatsApp reminder sending works with proper success/error handling
- ✅ CSV import/export works for members and care events
- ✅ JSON import works for API integration
- ✅ Manual member entry works

**Design & UX:**
- ✅ UI follows design_guidelines.md (sage/peach/teal, proper spacing, Shadcn components)
- ✅ Multi-language toggle works (ID/EN) with persistent selection
- ✅ All text translates correctly including toast messages
- ✅ Profile photo upload from local files and display works
- ✅ Color-coded engagement status badges (green=active, yellow=at risk, red=inactive)
- ✅ Event type colors match design guidelines
- ✅ Grief timeline has visual progress indicator
- ✅ Dashboard widgets show real-time data

**Quality:**
- ✅ All interactive elements have data-testid attributes
- ✅ Loading states (skeletons) for all data fetching
- ✅ Empty states with helpful messages and CTAs
- ✅ Error handling with user-friendly messages and retry options
- ✅ Toast notifications for all user actions
- ✅ One round of automated E2E testing executed and major issues fixed

---

### PHASE 3: Authentication & Roles 📋 **NOT STARTED**
**Status:** 📋 PENDING (after Phase 2)

**Goal:** Restrict access and separate admin-only actions.

**Implementation Steps:**
- Simple JWT auth (email/password)
- User model with roles: ADMIN, PASTOR
- Protected routes on backend with role checks
- Login/Logout UI with token storage (localStorage)
- Axios interceptor for automatic token inclusion
- Admin screens:
  - User management (list, add, edit, delete users)
  - Settings (view gateway URL, church name, language preference)
  - Integration test panel access
  - Import/Export access

**User Stories:**
1. As a user, I can log in with email/password and access the app
2. As an admin, I can manage users and assign roles
3. As a pastor, I can access all pastoral care features but not admin settings
4. As a user, I remain signed in across refresh until token expires
5. As a user, I see clear feedback for invalid credentials

**Exit Criteria:**
- Protected endpoints enforce roles correctly
- Core flows remain functional under authentication
- Testing pass for auth flows and role restrictions
- Default admin account seeded in database

---

### PHASE 4: Automated Reminders & Scheduling 📋 **NOT STARTED**
**Status:** 📋 PENDING (after Phase 3)

**Goal:** Automate daily reminders and logs.

**Implementation Steps:**
- Implement APScheduler for periodic tasks
- **Automated Reminder Rules:**
  - **Birthdays:** 7, 3, 1 days before
  - **Grief Support:** Auto-reminders for each stage (1 week, 2 weeks, 1 month, 3 months, 6 months, 1 year after mourning service)
  - **Hospital Discharge:** 3 days, 1 week, 2 weeks after discharge
  - **New House:** 1 week after event
  - **Accident/Illness:** 3 days, 1 week, 2 weeks after
  - **Regular Contact:** Alert if no contact for 30+ days (at-risk threshold)
  
- **Message Templates** (bilingual ID/EN):
  - Birthday greetings
  - Grief support check-in messages (customized per stage)
  - Hospital follow-up messages
  - General pastoral care reminders
  - All include church name (GKBJ) and personalization
  
- NotificationLog entries for all automated sends
- Dashboard widgets: "Reminders Sent Today", "Pending Reminders"
- Manual trigger button for admins ("Run Reminders Now")

**User Stories:**
1. As a pastor, I see a daily list of members who need contact today
2. As a pastor, I receive automated reminders for grief support stages
3. As an admin, I can manually trigger reminder run with a button
4. As a pastor, I can view the history of automated reminders per member
5. As a pastor, I can retry failed automated reminders
6. As a user, I see which reminders were sent automatically vs manually

**Exit Criteria:**
- Daily scheduled run creates sends and logs with clear success/failure
- Grief support stage reminders trigger automatically at correct dates
- Hospital follow-up reminders trigger at 3 days, 1 week, 2 weeks post-discharge
- Manual trigger works correctly
- Failed reminders can be retried
- Dashboard shows automated reminder counts and status

---

### PHASE 5: Enhancements & Polish 📋 **NOT STARTED**
**Status:** 📋 PENDING (after Phase 4)

**Scope:**
- Calendar view (month) with color-coded events
- Advanced search/filter with multiple criteria
- Bulk WhatsApp messaging to multiple members
- Member assignment to specific caregivers/pastors
- Custom tags for members
- Advanced analytics dashboard (weekly/monthly reports)
- Performance optimization and accessibility audit
- UI/UX polish per design system
- Mobile app consideration (PWA or native)

**User Stories:**
1. As a pastor, I can see a calendar of upcoming care events by type
2. As a pastor, I can send bulk WhatsApp messages to selected members
3. As a leader, I can assign specific members to specific pastors
4. As a pastor, I can tag members with custom labels (e.g., "needs-frequent-contact", "elderly", "youth")
5. As a leader, I can view comprehensive weekly/monthly reports
6. As a user, I can install the app as PWA on my phone

**Exit Criteria:**
- All features above demonstrably working
- Tests clear with no critical bugs
- UI matches design tokens throughout
- Accessibility audit passed (WCAG AA)
- Performance optimized (page load < 2s)
- PWA installable on mobile devices

---

## 3) Configuration & Decisions Made

**WhatsApp Integration:**
- ✅ Gateway URL: http://dermapack.net:3001
- ✅ No authentication required
- ✅ Test phone: 6281290080025
- ✅ Church name: GKBJ
- ✅ Phone format: {number}@s.whatsapp.net

**Email Integration:**
- ⏸️ Deferred indefinitely (WhatsApp-only approach confirmed)
- Status: "Not planned for current scope"

**Event Categories & Colors** (from design_guidelines.md):
- Birthday: `hsl(45, 90%, 65%)` - Warm golden yellow 🎂
- Childbirth: `hsl(330, 75%, 70%)` - Soft pink 👶
- **Grief/Loss: `hsl(240, 15%, 45%)` - Muted blue-gray 💔** ⭐
- New House: `hsl(25, 85%, 62%)` - Warm peach 🏠
- Accident/Illness: `hsl(15, 70%, 58%)` - Warm coral 🚑
- **Hospital Visit: `hsl(200, 40%, 50%)` - Medical blue 🏥**
- **Financial Aid: `hsl(140, 55%, 48%)` - Success green 💰**
- Regular Contact: `hsl(180, 42%, 45%)` - Soft teal 📞

**Financial Aid Types:**
- Education Support
- Medical Bills
- Emergency Relief
- Housing Assistance
- Food Support
- Funeral Costs
- Other

**Grief Support Timeline (6 Stages):**
1. Mourning Service (initial event)
2. 1 Week After - Initial adjustment check-in
3. 2 Weeks After - Phone call support
4. 1 Month After - Home visit (grief deepening period)
5. 3 Months After - Support visit (hardest period)
6. 6 Months After - Continued care check-in
7. 1 Year Anniversary - Remember and honor the loss

**Engagement Status Thresholds:**
- **Active:** Last contact within 30 days (green badge)
- **At Risk:** Last contact 30-60 days ago (yellow badge)
- **Inactive:** Last contact 60+ days ago (red badge)

**Hospital Follow-up Schedule:**
- 3 days after discharge
- 1 week after discharge
- 2 weeks after discharge

**Design System:**
- Primary: Sage Green `hsl(140, 32%, 45%)`
- Secondary: Warm Peach `hsl(25, 88%, 62%)`
- Accent: Soft Teal `hsl(180, 42%, 45%)`
- Fonts: Manrope (headings), Inter (body), Cormorant Garamond (hero)
- Components: Shadcn/UI from `/app/frontend/src/components/ui/`

**Language:**
- Default: Bahasa Indonesia
- Secondary: English
- User preference stored in localStorage
- All UI, messages, and WhatsApp templates translated

**Timezone & Locale:**
- Default: Asia/Jakarta (UTC+7) - Indonesia
- Date format: DD/MM/YYYY (ID), MM/DD/YYYY (EN)

**Data Import/Export Formats:**
- ✅ CSV (with template download)
- ✅ JSON (for API integration with main member system)
- ✅ Manual entry (one by one)
- Future: Direct API endpoint for main member system integration

**Profile Photos:**
- ✅ Local file upload only (JPEG, PNG)
- Max size: 5MB
- Auto-resize to 400x400px
- Stored in `/app/backend/uploads/photos/`
- Fallback to initials avatar if no photo

---

## 4) Success Criteria (Project-level)

**Phase 1 (Integration POC):** ✅ ACHIEVED
- ✅ WhatsApp sends verified end-to-end with documented response shape
- ✅ Email integration clearly marked as deferred

**Phase 2 (Core MVP - Focused Pastoral Care):** 🎯 TARGET
- ⭐ **Grief support system fully functional** - Auto-timeline generation, 6-stage tracking, completion with notes
- ✅ Hospital visitation logging and follow-up reminders working
- ✅ Financial aid tracking by type with analytics
- ✅ Engagement monitoring with at-risk alerts
- ✅ Multi-language support (ID/EN) throughout app
- ✅ Add member → add care event → dashboard visibility → send WhatsApp reminder fully functional
- ✅ All CRUD operations working smoothly
- ✅ Dashboard provides actionable insights (at-risk members, active grief support, hospital follow-ups)
- ✅ UI follows design system consistently
- ✅ CSV/JSON import and CSV export functional
- ✅ Profile photo upload from local files working

**Phase 3 (Auth):** 🎯 TARGET
- Role-based access enforced without breaking core flows
- Secure authentication with JWT

**Phase 4 (Automation):** 🎯 TARGET
- Automated grief support reminders at each stage
- Hospital follow-up reminders automated
- Daily at-risk member alerts
- Manual trigger works reliably

**Phase 5 (Polish):** 🎯 TARGET
- Calendar view, bulk messaging, advanced analytics
- Performance and accessibility optimized
- Production-ready quality

**Overall Quality Standards:**
- Uses sage/peach/teal design tokens throughout
- Light/dark mode support
- Shadcn components exclusively
- data-testid on all interactive elements
- Multi-language support (ID/EN) fully implemented
- One automated test cycle per phase with fixes applied
- Responsive design (mobile, tablet, desktop)
- Accessibility WCAG AA compliant

---

## 5) Next Immediate Actions (Phase 2 Implementation)

**Step 1 - Backend Foundation (Priority 1):**
1. ✅ Install required Python packages (httpx already installed)
2. Create database models in separate files:
   - `models/member.py` - Member model
   - `models/family_group.py` - FamilyGroup model
   - `models/care_event.py` - CareEvent model
   - `models/grief_support.py` - GriefSupport model
   - `models/notification_log.py` - NotificationLog model
3. Create utility functions:
   - `utils/engagement.py` - Calculate engagement status and days since contact
   - `utils/grief_timeline.py` - Auto-generate 6-stage grief timeline
   - `utils/photo_upload.py` - Handle photo upload, resize, storage
4. Implement Member CRUD endpoints with family grouping
5. Implement CareEvent CRUD with auto-grief-timeline generation logic
6. Implement GriefSupport endpoints for timeline management
7. Create dashboard endpoints (stats, at-risk, active grief, hospital follow-up)
8. Add photo upload endpoint for member profiles
9. Add CSV/JSON import and CSV export endpoints
10. Add i18n translations endpoint (serve id.json and en.json)

**Step 2 - Frontend Foundation (Priority 2):**
1. Install required packages:
   - `yarn add react-i18next i18next`
   - `yarn add date-fns` (for date formatting)
   - `yarn add recharts` (for analytics charts)
2. Set up design tokens in `index.css`:
   - CSS custom properties for all colors (sage, peach, teal, event types)
   - Import Google Fonts (Manrope, Inter, Cormorant Garamond)
3. Configure Tailwind with custom colors in `tailwind.config.js`
4. Set up react-i18next:
   - Create `i18n.js` configuration
   - Create translation files: `locales/id.json`, `locales/en.json`
   - Add language toggle component
5. Configure Sonner for toast notifications (already available)
6. Create reusable components:
   - `LanguageToggle.js` - ID/EN switcher
   - `EngagementBadge.js` - Color-coded status badge
   - `EventTypeBadge.js` - Event type with color and icon
   - `MemberAvatar.js` - Photo or initials fallback
   - `GriefTimeline.js` - Visual 6-stage timeline
   - `VisitationLogTable.js` - Hospital visit log display

**Step 3 - Core Screens Implementation (Priority 3):**
1. **Dashboard** (`/dashboard`)
   - Stats cards component
   - Active grief support widget
   - Members at risk widget
   - Hospital follow-ups widget
   - Upcoming events widget
   - Recent activity feed
   - Quick action buttons

2. **Members List** (`/members`)
   - Table with all columns
   - Search and filter functionality
   - Engagement status filtering
   - Family group filtering
   - Sort functionality
   - Add member button

3. **Member Detail** (`/members/:id`)
   - Member info card with photo
   - Tabbed interface (Care Timeline, Grief Support, Hospital Visits, Financial Aid, Family)
   - Edit member button
   - Quick action buttons

4. **Add/Edit Member Form** (Modal)
   - All fields with validation
   - Photo upload component
   - Family group selector/creator
   - Save functionality

5. **Add/Edit Care Event Form** (Modal)
   - Event type selector
   - Conditional fields based on type
   - Grief loss: relationship, mourning date
   - Hospital: hospital name, admission/discharge dates
   - Financial aid: type, amount
   - Save and Save & Send Reminder buttons

6. **Grief Support Timeline** (Component)
   - Visual timeline with 6 stages
   - Completion status for each stage
   - Mark complete with notes modal
   - Send reminder button
   - Progress indicator

7. **Financial Aid Dashboard** (`/financial-aid`)
   - Summary cards
   - Pie chart by aid type
   - Recent aid table
   - Filters and export

8. **Analytics Dashboard** (`/analytics`)
   - Engagement trends line chart
   - Care events pie chart
   - Financial aid bar chart
   - Grief completion rate
   - Members by status donut chart

9. **Import/Export Interface** (`/settings/import-export`)
   - CSV upload with template download
   - JSON import
   - CSV export with date range

**Step 4 - Testing & Polish (Priority 4):**
1. **Grief Support Flow Testing:**
   - Create member
   - Add grief/loss event with mourning date
   - Verify 6-stage timeline auto-generated
   - Mark stages complete with notes
   - Send WhatsApp reminders for each stage
   - Verify timeline visualization

2. **Hospital Care Flow Testing:**
   - Add hospital visit event
   - Add visitation log entries
   - Record discharge date
   - Verify follow-up reminders (3 days, 1 week, 2 weeks)
   - Test visitation log display

3. **Financial Aid Flow Testing:**
   - Record aid with different types
   - Verify aid shows in member detail
   - Check financial aid dashboard
   - Test analytics charts
   - Export to CSV

4. **Engagement Monitoring Testing:**
   - Verify days since contact calculation
   - Test engagement status auto-calculation
   - Check at-risk members dashboard widget
   - Test "Mark Contact Today" quick action

5. **Multi-Language Testing:**
   - Switch between ID and EN
   - Verify all text translates
   - Check toast messages in both languages
   - Test WhatsApp messages in both languages
   - Verify language preference persistence

6. **Data Import/Export Testing:**
   - Import members from CSV
   - Import members from JSON
   - Export members to CSV
   - Export care events to CSV
   - Verify data integrity

7. **Photo Upload Testing:**
   - Upload various image formats
   - Test file size limits
   - Verify auto-resize
   - Check fallback to initials

8. **Comprehensive E2E Testing:**
   - Run automated testing agent
   - Fix all high-priority bugs
   - Fix all medium-priority bugs
   - Address low-priority issues

9. **Design System Verification:**
   - Check all colors match design guidelines
   - Verify font usage (Manrope, Inter, Cormorant Garamond)
   - Test dark mode throughout
   - Check spacing consistency
   - Verify all Shadcn components used correctly

10. **Quality Assurance:**
    - Verify all data-testid attributes present
    - Test all loading states
    - Test all empty states
    - Test all error states
    - Check toast notifications for all actions
    - Performance check (page load < 2s)

---

## 6) Technical Debt & Known Issues

**Current:**
- ✅ Backend .env file formatting issue (fixed)
- python-dotenv warning on line 3 (non-critical, doesn't affect functionality)

**To Address in Phase 2:**
- Implement proper error handling for all API calls
- Add input validation on all forms (especially phone numbers, dates, amounts)
- Implement pagination for members and events lists (if >100 items)
- Add loading states for all async operations
- Optimize photo upload (compression, format conversion)
- Add photo deletion when member is deleted
- Implement proper timezone handling for date pickers (Asia/Jakarta)
- Add confirmation dialogs for delete operations (especially grief timelines)
- Handle WhatsApp gateway downtime gracefully
- Implement retry mechanism for failed WhatsApp sends
- Add data validation for CSV/JSON imports
- Implement proper error messages for import failures

**Future Considerations:**
- API integration with main member system (Phase 2+ via external_member_id field)
- Email provider integration (if needed later - currently deferred)
- Automated reminder scheduling (Phase 4)
- Advanced analytics and reporting (Phase 5)
- Mobile app (PWA or native) (Phase 5)
- Bulk operations (bulk edit, bulk delete, bulk message)
- Audit log for sensitive operations (financial aid, member deletion)
- Backup and restore functionality
- Data encryption for sensitive pastoral notes

---

## 7) Key Innovations & Differentiators

**What Makes This System Special:**

1. **⭐ Extended Grief Support System**
   - Only pastoral care system with automated 6-stage grief journey tracking
   - Addresses the critical months AFTER mourning service when members feel most lonely
   - Visual timeline with completion tracking and pastoral notes
   - Auto-reminders at each stage (1 week, 2 weeks, 1 month, 3 months, 6 months, 1 year)
   - **User Insight:** "The critical moment is months after the service where our member feel lonely and grieving"

2. **Hospital Care Integration**
   - Detailed visitation logging (who visited, when, what was discussed, prayer offered)
   - Automated post-discharge follow-up reminders (3 days, 1 week, 2 weeks)
   - Complete hospital stay history per member
   - Ensures no member is forgotten during recovery

3. **Financial Aid Transparency**
   - Track all aid given with types and amounts
   - Analytics by aid type (education, medical, emergency, housing, food, funeral costs)
   - Total aid per member visibility
   - Export for reporting and accountability
   - Simple tracking without approval workflow (as requested)

4. **Engagement Monitoring**
   - Auto-calculated "days since last contact"
   - Color-coded engagement status (Active/At Risk/Inactive)
   - Dashboard alerts for members needing attention
   - Prevents members from falling through the cracks
   - **Goal:** "No member left behind"

5. **Complementary Design**
   - Designed to complement existing church member systems
   - External member ID for future integration
   - Focused on pastoral care, not trying to replace full ChMS
   - Simple, purpose-built for pastoral team's daily work
   - Supports CSV, JSON, and manual import for flexibility

6. **Multi-Language Support**
   - Full Bahasa Indonesia (default) and English support
   - WhatsApp messages in selected language
   - Easy language toggle in UI (Indonesian 🇮🇩 / English 🇬🇧 flags)
   - All translations including form validation and toast messages

7. **Compassionate Design**
   - Warm, calming colors (sage green, peach, teal)
   - Empathetic language in UI
   - Focus on care, not just data
   - Visual indicators that highlight needs, not just metrics
   - Follows comprehensive design_guidelines.md

8. **Flexible Data Import**
   - CSV import with template
   - JSON import for API integration
   - Manual entry for small churches
   - Future-ready for main system integration via external_member_id

---

## 8) Research Insights Applied

**From Pastoral Care Software Research:**
- ✅ Comprehensive member profiles with pastoral notes
- ✅ Engagement tracking with early warning signs
- ✅ Task and care management with automated reminders
- ✅ Mobile-friendly design (responsive)
- ✅ Data-driven insights (analytics dashboard)
- ❌ Volunteer management (out of scope)
- ❌ Event management (out of scope)
- ❌ Financial giving integration (out of scope - only aid tracking)

**From Hospital Patient Care Systems:**
- ✅ Real-time tracking (days since last contact)
- ✅ Visitor log management (hospital visitation logs)
- ✅ Health status monitoring (engagement status)
- ✅ Crisis management (grief support, hospital alerts)
- ✅ Integration with information systems (external_member_id for future)
- ❌ Real-time location tracking (not applicable)
- ❌ Access control (Phase 3 - authentication)

**From Church Crisis Response Systems:**
- ✅ Mass notification capability (WhatsApp integration)
- ✅ Emergency communication (manual WhatsApp sends)
- ✅ Small groups integration (family grouping)
- ❌ Panic buttons (not applicable)
- ❌ AI threat detection (not applicable)
- ❌ Facility management (not applicable)

**Unique Innovation - Extended Grief Support:**
- No existing system addresses the 6-month to 1-year grief journey
- Most systems only track initial bereavement
- Our system ensures consistent pastoral presence during the hardest months
- Based on user's real pastoral experience: "The critical moment is months after the service"

---

**Last Updated:** 2025-11-13
**Current Phase:** Phase 2 - Core MVP Development (Focused Pastoral Care)
**Status:** Ready to implement - All requirements confirmed
**Next Milestone:** Complete grief support system, hospital tracking, financial aid, and engagement monitoring with multi-language support
**Key Focus:** Extended grief support is the signature feature - ensure it's intuitive, compassionate, and truly helpful for pastoral work
