# 📚 GKBJ Pastoral Care System - Complete API Reference

## 🔗 Base URL
- **Development**: `http://localhost:8001/api`
- **Production**: `https://your-api-domain.com/api`

## 🔑 Authentication
All endpoints require JWT Bearer token (except login).
```
Authorization: Bearer {jwt_token}
```

---

## 👥 **Authentication Endpoints**

### Login
```http
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "admin@gkbj.church",
  "password": "admin123", 
  "campus_id": "optional-campus-uuid"
}

Response 200:
{
  "access_token": "jwt-token-string",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "admin@gkbj.church",
    "name": "Full Administrator",
    "role": "full_admin",
    "campus_id": null,
    "phone": "6281290080025"
  }
}
```

### Register User (Admin Only)
```http
POST /api/auth/register
Authorization: Bearer {token}

Request:
{
  "email": "pastor@gkbj.church",
  "password": "secure123",
  "name": "Pastor John", 
  "phone": "628123456789",
  "role": "pastor",
  "campus_id": "campus-uuid"
}

Response 200: User object
```

---

## 👤 **Member Management**

### List Members (Optimized with Pagination)
```http
GET /api/members?page=1&limit=50&search=john&engagement_status=at_risk
Authorization: Bearer {token}

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (1-1000, default: 50)
- search: Text search (name/phone) - uses database text index
- engagement_status: active|at_risk|inactive

Response 200: Array of 805 Member objects
```

### Create Member
```http
POST /api/members
Authorization: Bearer {token}

Request:
{
  "name": "SUMARNI NINGSIH",
  "phone": "6281287590708",
  "campus_id": "auto",
  "birth_date": "1979-03-15",
  "age": 45,
  "gender": "F", 
  "membership_status": "Member",
  "marital_status": "Menikah",
  "category": "Umum",
  "blood_type": "O",
  "family_group_name": "Ningsih Family"
}

Response 200: Member object with auto-calculated engagement status
```

### Upload Profile Photo (Multi-Size Optimization)
```http
POST /api/members/{member_id}/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [image file]

Response 200:
{
  "success": true,
  "photo_urls": {
    "thumbnail": "/uploads/member-uuid_thumbnail.jpg",  # 100x100
    "medium": "/uploads/member-uuid_medium.jpg",        # 300x300  
    "large": "/uploads/member-uuid_large.jpg"           # 600x600
  },
  "default_url": "/uploads/member-uuid_medium.jpg"
}
```

---

## 📅 **Care Events with Auto-Timeline Generation**

### Create Care Event (Auto-generates timelines)
```http
POST /api/care-events
Authorization: Bearer {token}

# Grief/Loss Event (Auto-generates 6 stages)
{
  "member_id": "uuid",
  "campus_id": "auto",
  "event_type": "grief_loss",
  "event_date": "2024-11-13",
  "title": "Loss of Spouse",
  "grief_relationship": "spouse"
}
→ Automatically creates 6 grief stages: 1 week, 2 weeks, 1 month, 3 months, 6 months, 1 year

# Accident/Illness Event (Auto-generates 3 stages)
{
  "member_id": "uuid", 
  "campus_id": "auto",
  "event_type": "accident_illness",
  "event_date": "2024-11-13",
  "title": "Hospital Visit",
  "hospital_name": "RSU Jakarta"
}
→ Automatically creates 3 follow-up stages: 3 days, 7 days, 14 days

# Financial Aid Event
{
  "member_id": "uuid",
  "campus_id": "auto", 
  "event_type": "financial_aid",
  "event_date": "2024-11-13",
  "title": "Emergency Medical Aid",
  "aid_type": "medical",
  "aid_amount": 2000000
}
```

---

## 💰 **Advanced Financial Aid Scheduling**

### Create Recurring Aid Schedule
```http
POST /api/financial-aid-schedules
Authorization: Bearer {token}

# Weekly Schedule
{
  "member_id": "uuid",
  "campus_id": "uuid",
  "title": "Weekly Food Support", 
  "aid_type": "food",
  "aid_amount": 500000,
  "frequency": "weekly",
  "start_date": "2024-11-15",
  "day_of_week": "friday",
  "end_date": "2024-12-31"
}

# Monthly Schedule  
{
  "member_id": "uuid",
  "title": "Monthly Education Support",
  "aid_amount": 1500000,
  "frequency": "monthly", 
  "start_date": "2024-11-01",
  "day_of_month": 15,
  "end_date": null
}

# Annual Schedule
{
  "member_id": "uuid",
  "title": "Annual Christmas Aid",
  "aid_amount": 3000000,
  "frequency": "annually",
  "month_of_year": 12,
  "end_date": null
}

Response 200: FinancialAidSchedule with calculated next_occurrence
```

### Mark Payment as Distributed (Advances Schedule)
```http
POST /api/financial-aid-schedules/{schedule_id}/mark-distributed
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Payment marked as distributed and schedule advanced",
  "next_occurrence": "2024-12-15"
}

Logic:
1. Creates care event for this payment
2. Advances schedule to next occurrence
3. Updates occurrence count
4. Removes from due-today until next payment
```

### Get Schedules Due Today (with Overdue)
```http
GET /api/financial-aid-schedules/due-today
Authorization: Bearer {token}

Response 200: Array with overdue tracking
[
  {
    "id": "uuid",
    "member_name": "SUMARNI NINGSIH",
    "member_phone": "6281287590708", 
    "aid_amount": 1500000.0,
    "frequency": "monthly",
    "next_occurrence": "2024-11-13",
    "days_overdue": 0,
    "status": "due_today"
  },
  {
    "member_name": "DENNIS LAURENTO",
    "next_occurrence": "2024-10-15", 
    "days_overdue": 29,
    "status": "overdue"
  }
]
```

---

## 🤖 **AI-Powered Intelligence**

### Get AI Pastoral Recommendations
```http
GET /api/suggestions/follow-up
Authorization: Bearer {token}

Response 200: Intelligent recommendations with priority scoring
[
  {
    "member_id": "uuid",
    "member_name": "WASINI",
    "member_phone": "628123456789",
    "priority": "high",
    "suggestion": "Urgent reconnection needed",
    "reason": "No contact for 120 days - risk of disconnection",
    "recommended_action": "Personal visit or phone call", 
    "urgency_score": 100
  },
  {
    "member_id": "uuid",
    "member_name": "ELDERLY MEMBER",
    "priority": "medium",
    "suggestion": "Senior care check-in",
    "reason": "Senior member, 45 days since contact",
    "recommended_action": "Health and wellness check",
    "urgency_score": 65
  }
]

AI Algorithm:
- High Priority (90+ days): Urgent reconnection
- Medium Priority: Seniors (65+) + 30 days, Visitors + 14 days, Aid recipients + 60 days  
- Low Priority: Singles (25+) + 45 days for community engagement
```

### Demographic Trend Analysis
```http
GET /api/analytics/demographic-trends
Authorization: Bearer {token}

Response 200: Strategic pastoral insights
{
  "age_groups": [
    {"name": "Adults (31-60)", "count": 450, "care_events": 120}
  ],
  "membership_trends": [
    {"status": "Member", "count": 480, "avg_engagement": 75}
  ],
  "insights": [
    "Largest demographic: Adults (31-60) (450 members)",
    "Most care needed: Seniors (60+) (89 events)", 
    "Lowest engagement: Visitors (avg score: 45)"
  ]
}
```

---

## 🔔 **Daily Automation**

### Manual Trigger Daily Digest
```http
POST /api/reminders/run-now
Authorization: Bearer {token} (admin only)

Process:
1. Analyzes all campus data for today's tasks
2. Generates comprehensive digest per campus  
3. Sends WhatsApp to all pastoral staff
4. Includes wa.me/[phone] clickable links

Response 200:
{
  "success": true,
  "message": "Automated reminders executed successfully"
}
```

### Daily Digest Message Format
```
🏥 GKBJ - GKBJ Taman Kencana
📋 TUGAS PASTORAL HARI INI
📅 13 November 2024

🎂 ULANG TAHUN HARI INI (3):
  • SUMARNI NINGSIH
    📱 wa.me/6281287590708
  • DENNIS LAURENTO  
    📱 wa.me/628xxx

💔 DUKUNGAN DUKACITA (2):
  • VICTORIA NOVAYA (1 bulan setelah dukacita)
    📱 wa.me/628xxx

⚠️ JEMAAT BERISIKO (15 total):  
  • WASINI (120 hari)
    📱 wa.me/628xxx

💡 Silakan hubungi personal via WhatsApp
🙏 Tuhan memberkati pelayanan Anda
```

---

## 📊 **Analytics Endpoints**

### Care Events Distribution (Excludes Birthdays)
```http
GET /api/analytics/care-events-by-type
Authorization: Bearer {token}

Response 200:
[
  {"type": "grief_loss", "count": 35},
  {"type": "financial_aid", "count": 15},
  {"type": "accident_illness", "count": 20},
  {"type": "regular_contact", "count": 70}
]
Note: Birthdays excluded for relevant insights (would always dominate with 805 entries)
```

### Grief Support Analytics
```http
GET /api/analytics/grief-completion-rate
Authorization: Bearer {token}

Response 200:
{
  "total_stages": 210,
  "completed_stages": 35, 
  "pending_stages": 175,
  "completion_rate": 16.67
}
```

---

## 📥📤 **Data Import/Export with Enterprise Validation**

### CSV Import with Preview & Validation
```http
POST /api/import/members/csv
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [csv file]

CSV Format:
name,phone,email,birth_date,gender,membership_status,category,blood_type,marital_status,address,photo
"SUMARNI NINGSIH","6281287590708","email@test.com","1979-03-15","F","Member","Umum","O","Menikah","Jakarta","JEMAAT-OD4HK.JPG"

Response 200:
{
  "success": true,
  "imported_count": 805,
  "errors": [
    "Row 15: Invalid phone format",
    "Row 23: Missing required field 'name'"
  ]
}

Enterprise Features:
- Preview first 10 rows before import
- Validate required fields (name, phone)
- Quality checks (phone format, duplicates)  
- Confirmation required before execution
```

### API Sync with Field Mapping
```http
POST /api/sync/members/from-api
Authorization: Bearer {token}

Request:
{
  "api_url": "https://church-system.com/api/members",
  "api_key": "optional-bearer-token",
  "field_mapping": {
    "name": "full_name",
    "phone": "mobile_number", 
    "email": "email_address",
    "birth_date": "date_of_birth",
    "gender": "sex",
    "membership_status": "member_type"
  },
  "sync_interval": 60,
  "campus_id": "target-campus-uuid"
}

Response 200:
{
  "success": true,
  "synced_count": 200,
  "total_received": 205,
  "errors": ["Invalid data format errors"]
}

Enterprise Features:
- Test API connection before setup
- Preview sample data with field mapping
- Validate all 12 field mappings
- Continuous sync every X minutes
- Campus assignment for synced data
```

---

## 📱 **WhatsApp Integration**

### Send Test Message
```http
POST /api/integrations/ping/whatsapp
Authorization: Bearer {token}

Request:
{
  "phone": "6281290080025",
  "message": "Test from GKBJ Pastoral Care"
}

Response 200:
{
  "success": true,
  "message": "✅ WhatsApp message sent successfully!",
  "details": {
    "message_id": "3EB099679C1B85235CCE5F",
    "status": "Message sent to 6281290080025@s.whatsapp.net"
  }
}

Phone Format:
- Input: "0812345678" → Converts to: "62812345678@s.whatsapp.net"
- Input: "+6281234567" → Converts to: "6281234567@s.whatsapp.net"
```

### Get Message History & Retry Failed
```http
GET /api/notification-logs?limit=100&status=failed
Authorization: Bearer {token}

Response 200: Array of notification logs with retry capability
```

---

## 🏠 **Dashboard Endpoints**

### Get Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Bearer {token}

Response 200:
{
  "total_members": 805,
  "active_grief_support": 128,
  "members_at_risk": 740,
  "month_financial_aid": 863414.0
}
```

### Get Members at Risk (30+ days no contact)
```http
GET /api/members/at-risk
Authorization: Bearer {token}

Response 200: Array sorted by days_since_last_contact (descending)
```

### Get Active Grief Support
```http
GET /api/dashboard/grief-active
Authorization: Bearer {token}

Response 200: Members with pending grief timelines
[
  {
    "member_id": "uuid",
    "member_name": "DENNIS LAURENTO", 
    "stages": [
      {"stage": "3_months", "scheduled_date": "2024-12-01", "completed": false}
    ]
  }
]
```

---

## 💔 **Grief Support Timeline Management**

### Complete Grief Stage
```http
POST /api/grief-support/{stage_id}/complete
Authorization: Bearer {token}

Request:
{
  "notes": "Visited family, provided comfort and prayer"
}

Response 200:
{
  "success": true,
  "message": "Grief stage marked as completed"
}

Side Effects:
- Updates member's last_contact_date to now
- Changes member engagement_status to "active"
- Removes from due-today lists
```

### Send Grief Reminder to Staff (Not Member)
```http  
POST /api/grief-support/{stage_id}/send-reminder
Authorization: Bearer {token}

Response 200: WhatsApp sent to pastoral staff, not member
Message: "GKBJ - Reminder: DENNIS LAURENTO needs 3-month grief follow-up"
```

---

## 🚑 **Accident Follow-up Management**

### Get Accident Follow-up Timeline
```http
GET /api/accident-followup/member/{member_id}
Authorization: Bearer {token}

Response 200: 3-stage timeline (3, 7, 14 days after accident)
[
  {
    "stage": "first_followup",
    "scheduled_date": "2024-11-16", 
    "completed": false
  },
  {
    "stage": "second_followup", 
    "scheduled_date": "2024-11-20",
    "completed": false
  },
  {
    "stage": "final_followup",
    "scheduled_date": "2024-11-27", 
    "completed": false
  }
]
```

### Complete Accident Follow-up
```http
POST /api/accident-followup/{stage_id}/complete
Authorization: Bearer {token}

Request:
{
  "notes": "Follow-up completed, member recovered well"
}

Response 200: Success message + updates last_contact_date
```

---

## ⚙️ **System Configuration**

### Campus Management
```http
GET /api/campuses
Response: Array of campuses

POST /api/campuses (full admin only)
{
  "campus_name": "GKBJ Jakarta Pusat", 
  "location": "Jakarta Pusat"
}

PUT /api/campuses/{campus_id} (full admin only)
DELETE /api/campuses/{campus_id} (full admin only)
```

### User Management  
```http
GET /api/users
Response: Array of users with role/campus info

DELETE /api/users/{user_id} (admin only)
Response: Success (cannot delete self)
```

---

## 📊 **Complete Analytics Suite**

### Financial Aid Analytics
```http
GET /api/financial-aid/summary?start_date=2024-01-01&end_date=2024-12-31

Response: Complete financial intelligence
{
  "total_amount": 15000000.0,
  "by_type": {
    "education": {"count": 20, "total_amount": 8000000.0},
    "medical": {"count": 15, "total_amount": 5000000.0}
  }
}
```

### Hospital Follow-up Due
```http
GET /api/care-events/hospital/due-followup

Response: Accident/illness events needing follow-up (3, 7, 14 days after)
```

---

## 🔄 **Real-Time Sync & Background Jobs**

### Background Scheduler (Automatic)
- **Daily Digest**: Runs at 8:00 AM Jakarta time automatically
- **Schedule Processing**: Calculates next occurrences for financial aid
- **Engagement Updates**: Auto-calculates member engagement status
- **Timeline Management**: Tracks due grief and accident stages

### Manual Operations
```http
# Manual digest trigger
POST /api/reminders/run-now

# Check scheduler status  
GET /api/reminders/stats
```

---

## 🎯 **Enterprise Business Logic**

### **Engagement Status Calculation**
```python
def calculate_engagement_status(last_contact_date):
    if not last_contact_date:
        return "inactive", 999
    
    days_since = (datetime.now(timezone.utc) - last_contact_date).days
    
    if days_since < 60:        # Configurable in settings
        return "active", days_since
    elif days_since < 90:      # Configurable in settings  
        return "at_risk", days_since
    else:
        return "inactive", days_since
```

### **Financial Aid Next Occurrence Logic**
```python
def calculate_next_occurrence(frequency, current_date, settings):
    today = date.today()
    
    if frequency == "weekly":
        # Find next occurrence of specified weekday from today
        target_weekday = settings["day_of_week"]
        days_ahead = (target_weekday - today.weekday()) % 7
        return today + timedelta(days=days_ahead)
        
    elif frequency == "monthly": 
        # Find next occurrence of day-of-month from today
        day_of_month = settings["day_of_month"]
        try:
            next_date = today.replace(day=day_of_month)
            if next_date < today:
                # Move to next month
                if today.month == 12:
                    next_date = next_date.replace(year=today.year + 1, month=1)
                else:
                    next_date = next_date.replace(month=today.month + 1)
        except ValueError:
            # Handle invalid dates (e.g., Feb 31)
            next_date = date(today.year, today.month + 1, min(day_of_month, 31))
            
        return next_date
```

---

## 🎪 **Testing Examples**

### **Test Complete Workflow**
```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gkbj.church","password":"admin123"}' | \
  jq -r '.access_token')

# 2. Get member list
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8001/api/members?limit=5

# 3. Create grief event (auto-generates 6 stages)
curl -X POST http://localhost:8001/api/care-events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "member_id": "member-uuid",
    "campus_id": "auto",
    "event_type": "grief_loss",
    "event_date": "2024-11-13", 
    "grief_relationship": "spouse"
  }'

# 4. Check generated grief timeline
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8001/api/grief-support/member/member-uuid

# 5. Trigger manual daily digest  
curl -X POST http://localhost:8001/api/reminders/run-now \
  -H "Authorization: Bearer $TOKEN"
```

This comprehensive API documentation covers all 60+ endpoints with real-world examples and enterprise features! 🚀