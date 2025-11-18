# 📡 FaithTracker API Documentation

Complete API reference for the FaithTracker backend.

---

## Base URL

All API endpoints are prefixed with `/api`.

**Development:**
```
http://localhost:8001/api
```

**Production:**
```
https://your-domain.com/api
```

---

## Authentication

Most endpoints require authentication using a **Bearer Token** (JWT).

### Obtaining a Token

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "pastor@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "user-uuid-here",
    "email": "pastor@example.com",
    "name": "Pastor John",
    "role": "pastor",
    "church_id": "campus-uuid-here"
  }
}
```

### Using the Token

Include the token in all subsequent requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Lifetime:** 24 hours

---

## Multi-Tenancy & church_id

**Every request** is automatically scoped to the user's `church_id` (campus).

- For **Full Administrators**: Can switch campus via settings and subsequent requests use the selected campus
- For **Campus Admins & Pastors**: `church_id` is fixed to their assigned campus

**How it works:**
1. JWT token contains the user's `church_id` or selected campus
2. Backend automatically filters all queries by this `church_id`
3. You **cannot** manually specify `church_id` in requests (security feature)

---

## Response Format

### Success Response

```json
{
  "id": "uuid",
  "field1": "value1",
  "field2": "value2"
}
```

### Error Response

```json
{
  "detail": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## API Endpoints

### 1. Authentication & Users

#### **POST** `/api/auth/register`
Create a new user account (Full Admin only).

**Auth Required:** Yes (Full Admin)

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "secure_password",
  "name": "New User",
  "role": "pastor",
  "church_id": "campus-uuid-here"
}
```

**Response:** `201 Created`
```json
{
  "id": "user-uuid",
  "email": "newuser@example.com",
  "name": "New User",
  "role": "pastor",
  "church_id": "campus-uuid-here",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

#### **POST** `/api/auth/login`
Authenticate and receive access token.

**Auth Required:** No

**Request:**
```json
{
  "email": "pastor@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": "user-uuid",
    "email": "pastor@example.com",
    "name": "Pastor John",
    "role": "pastor",
    "church_id": "campus-uuid"
  }
}
```

---

#### **GET** `/api/auth/me`
Get current user profile.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": "user-uuid",
  "email": "pastor@example.com",
  "name": "Pastor John",
  "role": "pastor",
  "church_id": "campus-uuid",
  "created_at": "2023-05-10T08:00:00Z"
}
```

---

#### **GET** `/api/users`
List all users (Full Admin only).

**Auth Required:** Yes (Full Admin)

**Response:** `200 OK`
```json
[
  {
    "id": "user-uuid-1",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "full_admin",
    "church_id": null
  },
  {
    "id": "user-uuid-2",
    "email": "pastor@example.com",
    "name": "Pastor John",
    "role": "pastor",
    "church_id": "campus-uuid"
  }
]
```

---

#### **DELETE** `/api/users/{user_id}`
Delete a user (Full Admin only).

**Auth Required:** Yes (Full Admin)

**Response:** `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

---

### 2. Campuses

#### **POST** `/api/campuses`
Create a new campus (Full Admin only).

**Auth Required:** Yes (Full Admin)

**Request:**
```json
{
  "name": "Downtown Campus",
  "location": "123 Main Street, City",
  "timezone": "Asia/Jakarta"
}
```

**Response:** `201 Created`
```json
{
  "id": "campus-uuid",
  "name": "Downtown Campus",
  "location": "123 Main Street, City",
  "timezone": "Asia/Jakarta",
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

#### **GET** `/api/campuses`
List all campuses.

**Auth Required:** Yes

**Response:** `200 OK`
```json
[
  {
    "id": "campus-uuid-1",
    "name": "Downtown Campus",
    "location": "123 Main St",
    "timezone": "Asia/Jakarta"
  },
  {
    "id": "campus-uuid-2",
    "name": "Suburban Campus",
    "location": "456 Oak Ave",
    "timezone": "Asia/Jakarta"
  }
]
```

---

#### **GET** `/api/campuses/{campus_id}`
Get a specific campus.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": "campus-uuid",
  "name": "Downtown Campus",
  "location": "123 Main Street",
  "timezone": "Asia/Jakarta",
  "created_at": "2023-01-01T00:00:00Z"
}
```

---

#### **PUT** `/api/campuses/{campus_id}`
Update a campus (Full Admin only).

**Auth Required:** Yes (Full Admin)

**Request:**
```json
{
  "name": "Downtown Campus - Updated",
  "location": "New Address",
  "timezone": "Asia/Jakarta"
}
```

**Response:** `200 OK`
```json
{
  "id": "campus-uuid",
  "name": "Downtown Campus - Updated",
  "location": "New Address",
  "timezone": "Asia/Jakarta"
}
```

---

### 3. Members

#### **POST** `/api/members`
Create a new member.

**Auth Required:** Yes

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+6281234567890",
  "email": "john@example.com",
  "dob": "1985-03-15",
  "address": "123 Church Street",
  "family_group": "Doe Family",
  "notes": "Active volunteer"
}
```

**Response:** `201 Created`
```json
{
  "id": "member-uuid",
  "name": "John Doe",
  "phone": "+6281234567890",
  "email": "john@example.com",
  "dob": "1985-03-15",
  "address": "123 Church Street",
  "family_group": "Doe Family",
  "engagement_status": "active",
  "last_contact": null,
  "photo_url": null,
  "church_id": "campus-uuid",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

#### **GET** `/api/members`
List all members.

**Auth Required:** Yes

**Query Parameters:**
- `search` (optional): Search by name, phone, or email
- `family_group` (optional): Filter by family group
- `engagement_status` (optional): Filter by status (active, at_risk, disconnected)

**Example:**
```
GET /api/members?search=john&engagement_status=active
```

**Response:** `200 OK`
```json
[
  {
    "id": "member-uuid-1",
    "name": "John Doe",
    "phone": "+6281234567890",
    "email": "john@example.com",
    "dob": "1985-03-15",
    "engagement_status": "active",
    "last_contact": "2024-01-10T14:30:00Z",
    "photo_url": "/api/uploads/JEMAAT-ABC12.jpg"
  },
  {
    "id": "member-uuid-2",
    "name": "Jane Smith",
    "phone": "+6281234567891",
    "email": "jane@example.com",
    "dob": "1990-07-22",
    "engagement_status": "at_risk",
    "last_contact": "2023-11-15T10:00:00Z",
    "photo_url": null
  }
]
```

---

#### **GET** `/api/members/{member_id}`
Get a specific member's details.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": "member-uuid",
  "name": "John Doe",
  "phone": "+6281234567890",
  "email": "john@example.com",
  "dob": "1985-03-15",
  "address": "123 Church Street",
  "family_group": "Doe Family",
  "engagement_status": "active",
  "last_contact": "2024-01-10T14:30:00Z",
  "photo_url": "/api/uploads/JEMAAT-ABC12.jpg",
  "church_id": "campus-uuid",
  "notes": "Active volunteer",
  "created_at": "2023-05-10T08:00:00Z"
}
```

---

#### **PUT** `/api/members/{member_id}`
Update a member.

**Auth Required:** Yes

**Request:**
```json
{
  "name": "John Doe Updated",
  "phone": "+6281234567890",
  "email": "newemail@example.com",
  "address": "New Address"
}
```

**Response:** `200 OK`
```json
{
  "id": "member-uuid",
  "name": "John Doe Updated",
  "phone": "+6281234567890",
  "email": "newemail@example.com",
  "address": "New Address",
  ...
}
```

---

#### **DELETE** `/api/members/{member_id}`
Delete a member and all associated data.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "Member and all associated data deleted successfully"
}
```

---

#### **GET** `/api/members/at-risk`
Get members with "at_risk" or "disconnected" status.

**Auth Required:** Yes

**Response:** `200 OK`
```json
[
  {
    "id": "member-uuid",
    "name": "Jane Smith",
    "engagement_status": "at_risk",
    "last_contact": "2023-11-15T10:00:00Z",
    "days_since_contact": 61
  }
]
```

---

#### **POST** `/api/members/{member_id}/photo`
Upload a member photo.

**Auth Required:** Yes

**Content-Type:** `multipart/form-data`

**Request:**
```
POST /api/members/{member_id}/photo
Content-Type: multipart/form-data

file: [image file]
```

**Response:** `200 OK`
```json
{
  "message": "Photo uploaded successfully",
  "photo_url": "/api/uploads/JEMAAT-ABC12.jpg"
}
```

---

### 4. Care Events

#### **POST** `/api/care-events`
Create a new care event.

**Auth Required:** Yes

**Request:**
```json
{
  "member_id": "member-uuid",
  "event_type": "birthday",
  "event_date": "2024-03-15",
  "notes": "50th birthday celebration",
  "completed": false
}
```

**For Financial Aid:**
```json
{
  "member_id": "member-uuid",
  "event_type": "financial_aid",
  "event_date": "2024-01-15",
  "notes": "Monthly rent assistance",
  "aid_type": "housing",
  "schedule": {
    "frequency": "monthly",
    "day_of_month": 15,
    "start_date": "2024-01-15"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "event-uuid",
  "member_id": "member-uuid",
  "event_type": "birthday",
  "event_date": "2024-03-15",
  "notes": "50th birthday celebration",
  "completed": false,
  "ignored": false,
  "church_id": "campus-uuid",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

#### **GET** `/api/care-events`
List all care events.

**Auth Required:** Yes

**Query Parameters:**
- `member_id` (optional): Filter by member
- `event_type` (optional): Filter by type (birthday, grief_loss, etc.)
- `completed` (optional): Filter by completion status (true/false)
- `start_date` (optional): Filter events after this date (YYYY-MM-DD)
- `end_date` (optional): Filter events before this date (YYYY-MM-DD)

**Example:**
```
GET /api/care-events?event_type=birthday&completed=false
```

**Response:** `200 OK`
```json
[
  {
    "id": "event-uuid-1",
    "member_id": "member-uuid-1",
    "member_name": "John Doe",
    "event_type": "birthday",
    "event_date": "2024-03-15",
    "notes": "50th birthday",
    "completed": false,
    "ignored": false
  },
  {
    "id": "event-uuid-2",
    "member_id": "member-uuid-2",
    "member_name": "Jane Smith",
    "event_type": "grief_loss",
    "event_date": "2024-02-20",
    "grief_stage": "1_week",
    "completed": false,
    "ignored": false
  }
]
```

---

#### **GET** `/api/care-events/{event_id}`
Get a specific care event.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": "event-uuid",
  "member_id": "member-uuid",
  "member_name": "John Doe",
  "event_type": "birthday",
  "event_date": "2024-03-15",
  "notes": "50th birthday celebration",
  "completed": false,
  "completed_at": null,
  "completed_by": null,
  "ignored": false,
  "church_id": "campus-uuid",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

#### **PUT** `/api/care-events/{event_id}`
Update a care event.

**Auth Required:** Yes

**Request:**
```json
{
  "event_date": "2024-03-16",
  "notes": "Updated: Moved to Saturday"
}
```

**Response:** `200 OK`
```json
{
  "id": "event-uuid",
  "member_id": "member-uuid",
  "event_type": "birthday",
  "event_date": "2024-03-16",
  "notes": "Updated: Moved to Saturday",
  ...
}
```

---

#### **DELETE** `/api/care-events/{event_id}`
Delete a care event.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "Care event deleted successfully"
}
```

---

#### **POST** `/api/care-events/{event_id}/complete`
Mark a care event as completed.

**Auth Required:** Yes

**Request:**
```json
{
  "notes": "Called and wished happy birthday. Member was very grateful."
}
```

**Response:** `200 OK`
```json
{
  "id": "event-uuid",
  "completed": true,
  "completed_at": "2024-01-15T14:30:00Z",
  "completed_by": "user-uuid",
  "notes": "Called and wished happy birthday. Member was very grateful.",
  ...
}
```

---

#### **POST** `/api/care-events/{event_id}/ignore`
Ignore a care event (hide from task list).

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": "event-uuid",
  "ignored": true,
  ...
}
```

---

#### **POST** `/api/care-events/{event_id}/send-reminder`
Send a WhatsApp reminder for this event.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "Reminder sent successfully",
  "notification_id": "notification-uuid"
}
```

---

### 5. Dashboard & Reminders

#### **GET** `/api/dashboard/reminders`
Get all tasks (reminders) for the dashboard.

**Auth Required:** Yes

**Query Parameters:**
- `filter` (optional): `today`, `overdue`, `upcoming`

**Example:**
```
GET /api/dashboard/reminders?filter=overdue
```

**Response:** `200 OK`
```json
{
  "today": [
    {
      "id": "event-uuid-1",
      "member_id": "member-uuid-1",
      "member_name": "John Doe",
      "event_type": "birthday",
      "event_date": "2024-01-15",
      "notes": "50th birthday",
      "is_overdue": false
    }
  ],
  "overdue": [
    {
      "id": "event-uuid-2",
      "member_id": "member-uuid-2",
      "member_name": "Jane Smith",
      "event_type": "financial_aid",
      "event_date": "2024-01-10",
      "notes": "Monthly rent assistance",
      "is_overdue": true,
      "days_overdue": 5
    }
  ],
  "upcoming": [
    {
      "id": "event-uuid-3",
      "member_id": "member-uuid-3",
      "member_name": "Bob Johnson",
      "event_type": "grief_loss",
      "event_date": "2024-01-20",
      "grief_stage": "1_month",
      "is_overdue": false
    }
  ]
}
```

---

#### **GET** `/api/dashboard/stats`
Get dashboard statistics.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "total_members": 150,
  "active_members": 120,
  "at_risk_members": 20,
  "disconnected_members": 10,
  "tasks_today": 5,
  "tasks_overdue": 3,
  "tasks_upcoming": 12
}
```

---

#### **GET** `/api/dashboard/upcoming`
Get upcoming events for the next 7 days.

**Auth Required:** Yes

**Response:** `200 OK`
```json
[
  {
    "id": "event-uuid",
    "member_name": "John Doe",
    "event_type": "birthday",
    "event_date": "2024-01-20",
    "days_until": 5
  }
]
```

---

### 6. Financial Aid Schedules

#### **POST** `/api/financial-aid-schedules`
Create a financial aid schedule (recurring or one-time).

**Auth Required:** Yes

**Request (One-Time):**
```json
{
  "member_id": "member-uuid",
  "aid_type": "emergency",
  "amount": 500.00,
  "frequency": "one_time",
  "start_date": "2024-01-15",
  "notes": "Emergency medical assistance"
}
```

**Request (Recurring - Monthly):**
```json
{
  "member_id": "member-uuid",
  "aid_type": "housing",
  "amount": 1000.00,
  "frequency": "monthly",
  "day_of_month": 15,
  "start_date": "2024-01-15",
  "notes": "Monthly rent assistance"
}
```

**Request (Recurring - Weekly):**
```json
{
  "member_id": "member-uuid",
  "aid_type": "food",
  "amount": 100.00,
  "frequency": "weekly",
  "day_of_week": "friday",
  "start_date": "2024-01-19",
  "notes": "Weekly grocery assistance"
}
```

**Response:** `201 Created`
```json
{
  "id": "schedule-uuid",
  "member_id": "member-uuid",
  "aid_type": "housing",
  "amount": 1000.00,
  "frequency": "monthly",
  "day_of_month": 15,
  "start_date": "2024-01-15",
  "notes": "Monthly rent assistance",
  "is_active": true,
  "church_id": "campus-uuid",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

#### **GET** `/api/financial-aid-schedules`
List all financial aid schedules.

**Auth Required:** Yes

**Query Parameters:**
- `member_id` (optional): Filter by member
- `aid_type` (optional): Filter by aid type
- `is_active` (optional): Filter by active status (true/false)

**Response:** `200 OK`
```json
[
  {
    "id": "schedule-uuid-1",
    "member_id": "member-uuid-1",
    "member_name": "John Doe",
    "aid_type": "housing",
    "amount": 1000.00,
    "frequency": "monthly",
    "day_of_month": 15,
    "start_date": "2024-01-15",
    "is_active": true,
    "next_occurrence": "2024-02-15"
  },
  {
    "id": "schedule-uuid-2",
    "member_id": "member-uuid-2",
    "member_name": "Jane Smith",
    "aid_type": "education",
    "amount": 500.00,
    "frequency": "monthly",
    "day_of_month": 1,
    "start_date": "2024-01-01",
    "is_active": true,
    "next_occurrence": "2024-02-01"
  }
]
```

---

#### **GET** `/api/financial-aid-schedules/member/{member_id}`
Get all financial aid schedules for a specific member.

**Auth Required:** Yes

**Response:** `200 OK` (same format as above, filtered by member)

---

#### **POST** `/api/financial-aid-schedules/{schedule_id}/mark-distributed`
Mark an aid distribution as completed for a specific date.

**Auth Required:** Yes

**Request:**
```json
{
  "date": "2024-01-15",
  "notes": "Paid $1000 via bank transfer. Receipt #12345"
}
```

**Response:** `200 OK`
```json
{
  "message": "Aid distribution marked as completed",
  "schedule_id": "schedule-uuid",
  "date": "2024-01-15"
}
```

---

#### **POST** `/api/financial-aid-schedules/{schedule_id}/ignore`
Ignore a specific occurrence of a recurring schedule.

**Auth Required:** Yes

**Request:**
```json
{
  "date": "2024-02-15"
}
```

**Response:** `200 OK`
```json
{
  "message": "Occurrence ignored successfully"
}
```

---

#### **POST** `/api/financial-aid-schedules/{schedule_id}/clear-ignored`
Clear all ignored occurrences for a schedule.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "All ignored occurrences cleared"
}
```

---

#### **DELETE** `/api/financial-aid-schedules/{schedule_id}`
Delete a financial aid schedule.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "Financial aid schedule deleted successfully"
}
```

---

#### **POST** `/api/financial-aid-schedules/{schedule_id}/stop`
Stop a recurring schedule (sets `is_active` to false).

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "message": "Financial aid schedule stopped",
  "schedule_id": "schedule-uuid",
  "is_active": false
}
```

---

### 7. Family Groups

#### **POST** `/api/family-groups`
Create a new family group.

**Auth Required:** Yes

**Request:**
```json
{
  "name": "Smith Family",
  "address": "123 Main Street",
  "notes": "Active church family"
}
```

**Response:** `201 Created`
```json
{
  "id": "group-uuid",
  "name": "Smith Family",
  "address": "123 Main Street",
  "notes": "Active church family",
  "member_count": 0,
  "church_id": "campus-uuid",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

#### **GET** `/api/family-groups`
List all family groups.

**Auth Required:** Yes

**Response:** `200 OK`
```json
[
  {
    "id": "group-uuid-1",
    "name": "Smith Family",
    "address": "123 Main Street",
    "member_count": 4,
    "members": [
      {
        "id": "member-uuid-1",
        "name": "John Smith",
        "relationship": "Father"
      },
      {
        "id": "member-uuid-2",
        "name": "Mary Smith",
        "relationship": "Mother"
      }
    ]
  }
]
```

---

#### **GET** `/api/family-groups/{group_id}`
Get a specific family group with all members.

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "id": "group-uuid",
  "name": "Smith Family",
  "address": "123 Main Street",
  "notes": "Active church family",
  "member_count": 4,
  "members": [
    {
      "id": "member-uuid-1",
      "name": "John Smith",
      "phone": "+6281234567890",
      "email": "john@example.com",
      "relationship": "Father"
    },
    {
      "id": "member-uuid-2",
      "name": "Mary Smith",
      "phone": "+6281234567891",
      "email": "mary@example.com",
      "relationship": "Mother"
    }
  ]
}
```

---

### 8. Analytics

#### **GET** `/api/analytics/engagement-trends`
Get member engagement trends over time.

**Auth Required:** Yes

**Query Parameters:**
- `months` (optional): Number of months to include (default: 6)

**Example:**
```
GET /api/analytics/engagement-trends?months=12
```

**Response:** `200 OK`
```json
[
  {
    "month": "2023-07",
    "active": 110,
    "at_risk": 25,
    "disconnected": 15
  },
  {
    "month": "2023-08",
    "active": 115,
    "at_risk": 20,
    "disconnected": 15
  },
  {
    "month": "2023-09",
    "active": 120,
    "at_risk": 18,
    "disconnected": 12
  }
]
```

---

#### **GET** `/api/analytics/care-events-by-type`
Get distribution of care events by type.

**Auth Required:** Yes

**Response:** `200 OK`
```json
[
  {
    "event_type": "birthday",
    "count": 45,
    "percentage": 30.0
  },
  {
    "event_type": "grief_loss",
    "count": 30,
    "percentage": 20.0
  },
  {
    "event_type": "financial_aid",
    "count": 25,
    "percentage": 16.7
  },
  {
    "event_type": "regular_contact",
    "count": 50,
    "percentage": 33.3
  }
]
```

---

### 9. Import/Export

#### **POST** `/api/import/members/csv`
Import members from CSV file.

**Auth Required:** Yes

**Content-Type:** `multipart/form-data`

**Request:**
```
POST /api/import/members/csv
Content-Type: multipart/form-data

file: [CSV file]
```

**CSV Format:**
```csv
name,phone,email,dob,address,family_group
John Doe,+6281234567890,john@example.com,1980-05-15,123 Main St,Doe Family
Jane Smith,+6281234567891,jane@example.com,1985-07-20,456 Oak Ave,Smith Family
```

**Response:** `200 OK`
```json
{
  "message": "Import completed",
  "imported": 50,
  "failed": 2,
  "errors": [
    {
      "row": 5,
      "error": "Invalid phone number format"
    },
    {
      "row": 12,
      "error": "Missing required field: name"
    }
  ]
}
```

---

#### **POST** `/api/import/members/json`
Import members from JSON data.

**Auth Required:** Yes

**Request:**
```json
{
  "members": [
    {
      "name": "John Doe",
      "phone": "+6281234567890",
      "email": "john@example.com",
      "dob": "1980-05-15"
    },
    {
      "name": "Jane Smith",
      "phone": "+6281234567891",
      "email": "jane@example.com",
      "dob": "1985-07-20"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "message": "Import completed",
  "imported": 2,
  "failed": 0
}
```

---

#### **GET** `/api/export/members/csv`
Export all members to CSV.

**Auth Required:** Yes

**Response:** `200 OK`
```
Content-Type: text/csv
Content-Disposition: attachment; filename="members_export_2024-01-15.csv"

name,phone,email,dob,address,family_group,engagement_status,last_contact
John Doe,+6281234567890,john@example.com,1980-05-15,123 Main St,Doe Family,active,2024-01-10
Jane Smith,+6281234567891,jane@example.com,1985-07-20,456 Oak Ave,Smith Family,at_risk,2023-11-15
```

---

#### **GET** `/api/export/care-events/csv`
Export all care events to CSV.

**Auth Required:** Yes

**Response:** `200 OK`
```
Content-Type: text/csv
Content-Disposition: attachment; filename="care_events_export_2024-01-15.csv"

member_name,event_type,event_date,completed,notes
John Doe,birthday,2024-03-15,false,50th birthday celebration
Jane Smith,grief_loss,2024-02-01,true,Called to check in
```

---

### 10. Configuration & Settings

#### **GET** `/api/config/all`
Get all configuration options (event types, aid types, roles, etc.).

**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "event_types": [
    "birthday",
    "childbirth",
    "grief_loss",
    "new_house",
    "accident_illness",
    "financial_aid",
    "regular_contact"
  ],
  "aid_types": [
    "education",
    "medical",
    "emergency",
    "housing",
    "food",
    "funeral_costs",
    "other"
  ],
  "user_roles": [
    "full_admin",
    "campus_admin",
    "pastor"
  ],
  "engagement_statuses": [
    "active",
    "at_risk",
    "disconnected"
  ],
  "frequency_types": [
    "one_time",
    "weekly",
    "monthly",
    "annually"
  ]
}
```

---

### 11. Notifications & WhatsApp

#### **GET** `/api/notification-logs`
Get all notification logs (WhatsApp, email).

**Auth Required:** Yes

**Query Parameters:**
- `channel` (optional): Filter by channel (whatsapp, email)
- `status` (optional): Filter by status (sent, failed, pending)

**Response:** `200 OK`
```json
[
  {
    "id": "notification-uuid-1",
    "channel": "whatsapp",
    "recipient": "+6281234567890",
    "message": "Hi John, reminder about your birthday on March 15.",
    "status": "sent",
    "sent_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "notification-uuid-2",
    "channel": "whatsapp",
    "recipient": "+6281234567891",
    "message": "Hi Jane, checking in on you.",
    "status": "failed",
    "sent_at": "2024-01-15T10:35:00Z",
    "error": "Invalid phone number"
  }
]
```

---

#### **POST** `/api/integrations/ping/whatsapp`
Test WhatsApp gateway connection.

**Auth Required:** Yes

**Request:**
```json
{
  "phone": "+6281234567890",
  "message": "Test message from FaithTracker"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "WhatsApp test message sent successfully"
}
```

---

### 12. File Uploads

#### **GET** `/api/uploads/{filename}`
Retrieve an uploaded file (member photos).

**Auth Required:** No (public access)

**Example:**
```
GET /api/uploads/JEMAAT-ABC12.jpg
```

**Response:** `200 OK`
```
Content-Type: image/jpeg

[Image binary data]
```

---

## Error Handling

### Common Errors

**401 Unauthorized**
```json
{
  "detail": "Not authenticated"
}
```
**Solution:** Include valid Bearer token in Authorization header.

---

**403 Forbidden**
```json
{
  "detail": "Insufficient permissions"
}
```
**Solution:** Check your user role. Some actions require Full Admin or Campus Admin role.

---

**404 Not Found**
```json
{
  "detail": "Resource not found"
}
```
**Solution:** Verify the resource ID exists and belongs to your campus.

---

**400 Bad Request**
```json
{
  "detail": "Invalid input",
  "errors": {
    "phone": "Invalid phone number format",
    "dob": "Date of birth must be in the past"
  }
}
```
**Solution:** Fix input validation errors.

---

**500 Internal Server Error**
```json
{
  "detail": "Internal server error"
}
```
**Solution:** Check server logs. Contact administrator if persistent.

---

## Rate Limiting

Currently, there are **no rate limits** on API endpoints. However, for production deployments, it is recommended to implement rate limiting at the Nginx level or using a service like Cloudflare.

---

## Data Types & Enums

### EventType
- `birthday`
- `childbirth`
- `grief_loss`
- `new_house`
- `accident_illness`
- `financial_aid`
- `regular_contact`

### AidType
- `education`
- `medical`
- `emergency`
- `housing`
- `food`
- `funeral_costs`
- `other`

### GriefStage
- `mourning` (0-7 days)
- `1_week`
- `2_weeks`
- `1_month`
- `3_months`
- `6_months`
- `1_year`

### ScheduleFrequency
- `one_time`
- `weekly`
- `monthly`
- `annually`

### UserRole
- `full_admin` - Access all campuses, create users
- `campus_admin` - Manage one campus
- `pastor` - Basic pastoral care tasks

### EngagementStatus
- `active` - Care event in last 30 days
- `at_risk` - Last event 30-90 days ago
- `disconnected` - No event in 90+ days

---

## Best Practices

1. **Always check authentication**: Include Bearer token in all requests
2. **Handle pagination**: Large lists may be paginated in future versions
3. **Validate input**: Check required fields before sending requests
4. **Log errors**: Capture 4xx and 5xx responses for debugging
5. **Use HTTPS**: Always use secure connections in production
6. **Respect multi-tenancy**: Do not attempt to access data from other campuses
7. **Phone numbers**: Use E.164 format (+6281234567890) for WhatsApp compatibility
8. **Dates**: Use ISO 8601 format (YYYY-MM-DD) for all dates
9. **Timezones**: All dates are stored in campus timezone (Asia/Jakarta by default)

---

## Postman Collection

A Postman collection with all endpoints and example requests is available in `/docs/FaithTracker.postman_collection.json`.

**To import:**
1. Open Postman
2. Click "Import"
3. Select the JSON file
4. Update the `{{base_url}}` and `{{token}}` variables

---

## Support

For API issues or questions:
- GitHub Issues: [github.com/YOUR-USERNAME/faithtracker/issues]
- Email: api-support@yourdomain.com

---

**End of API Documentation**
