# 🏗️ FaithTracker Codebase Structure

This document provides a comprehensive guide to the FaithTracker codebase architecture, file organization, and key patterns.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Root](#project-root)
3. [Backend Structure](#backend-structure)
4. [Frontend Structure](#frontend-structure)
5. [Key Files & Their Purpose](#key-files--their-purpose)
6. [Design Patterns](#design-patterns)
7. [State Management](#state-management)
8. [Styling & UI](#styling--ui)
9. [Development Workflow](#development-workflow)

---

## Overview

FaithTracker is a **monorepo** with separate backend and frontend codebases:

```
/app/
├── backend/          # FastAPI (Python) backend
├── frontend/         # React frontend
├── docs/             # Documentation
├── .env.example      # Environment variable template
├── .gitignore        # Git ignore rules
└── README.md         # Main project documentation
```

---

## Project Root

### `/app/`

| File/Directory | Purpose |
|----------------|---------|
| `README.md` | Main project documentation with quick start guide |
| `.env.example` | Template for environment variables (backend & frontend) |
| `.gitignore` | Git ignore rules (Python, Node, build artifacts) |
| `docs/` | Comprehensive documentation (FEATURES, API, DEPLOYMENT, etc.) |
| `backend/` | FastAPI backend application |
| `frontend/` | React frontend application |
| `tests/` | Integration and end-to-end tests |
| `test_reports/` | Testing agent reports (JSON format) |
| `plan.md` | Development plan and feature roadmap |
| `design_guidelines.md` | UI/UX design specifications |

---

## Backend Structure

### `/app/backend/`

```
backend/
├── server.py                   # Main FastAPI application (4400+ lines)
├── scheduler.py                # APScheduler for background jobs
├── .env                        # Environment variables (DO NOT COMMIT)
├── requirements.txt            # Python dependencies
├── uploads/                    # User-uploaded files (member photos)
├── jemaat/                     # Member photo archive
├── core_jemaat.csv             # Initial member data (import script)
├── import_data.py              # Script to import members from CSV
├── import_photos.py            # Script to bulk import member photos
├── recalculate_engagement.py  # Script to recalculate member engagement
├── create_indexes.py           # MongoDB index creation script
└── test_api.sh                 # Bash script for API testing
```

### Key Backend Files

#### **`server.py`** (MONOLITHIC - 4400+ lines)
This is the **heart of the backend** - a single file containing:
- **All Pydantic models** (User, Member, CareEvent, Campus, etc.)
- **All API endpoints** (~100 endpoints)
- **Business logic** for pastoral care workflows
- **Authentication & authorization** (JWT, role-based access)
- **Database operations** (MongoDB via Motor async driver)

**Structure within `server.py`:**
```python
# 1. Imports & Configuration (lines 1-60)
# 2. Enums (EventType, UserRole, EngagementStatus, etc.)
# 3. Pydantic Models (User, Member, CareEvent, etc.)
# 4. Auth Functions (JWT, password hashing)
# 5. Helper Functions (timezone, engagement calculation)
# 6. API Endpoints (~100 endpoints grouped by resource)
# 7. Startup/Shutdown Events (scheduler, database connections)
```

**Why monolithic?**
- Simplifies deployment (single file)
- Easy to search and understand data flow
- No complex module imports
- Common pattern for MVPs and small-medium applications

**Future refactoring:**
- Could be split into `models/`, `routes/`, `services/`, `utils/`
- Recommended when file exceeds 5000 lines or team grows

---

#### **`scheduler.py`**
Background task scheduler using APScheduler.

**Jobs:**
- **Daily Reminder Job**: Runs at 9 AM to generate tasks for birthdays, grief support, financial aid
- **Engagement Recalculation**: Updates member engagement status

**Usage:**
```python
from scheduler import start_scheduler, stop_scheduler

# In server.py
@app.on_event("startup")
async def startup_event():
    start_scheduler()

@app.on_event("shutdown")
async def shutdown_event():
    stop_scheduler()
```

---

#### **`requirements.txt`**
Python dependencies installed via pip.

**Key packages:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `motor` - Async MongoDB driver
- `pydantic` - Data validation
- `python-jose` - JWT tokens
- `passlib` - Password hashing
- `python-multipart` - File uploads
- `pillow` - Image processing
- `httpx` - HTTP client (for WhatsApp gateway)
- `APScheduler` - Background jobs

**Installation:**
```bash
pip install -r requirements.txt
```

---

#### **`uploads/` & `jemaat/` Directories**
Storage for member photos.

- `uploads/`: New photos uploaded via the UI
- `jemaat/`: Archive of existing member photos

**Photo Naming Convention:**
```
JEMAAT-[5-CHAR-ID].[ext]
Example: JEMAAT-ABC12.jpg
```

**Retrieval:**
```
GET /api/uploads/JEMAAT-ABC12.jpg
```

---

#### **Utility Scripts**

**`import_data.py`**
- Bulk import members from `core_jemaat.csv`
- Maps CSV columns to Member model fields
- Run once during initial setup

**`import_photos.py`**
- Bulk import member photos from `jemaat/` directory
- Associates photos with members by ID

**`recalculate_engagement.py`**
- Recalculates engagement status for all members
- Useful after bulk data changes
- Run manually when needed

**`create_indexes.py`**
- Creates MongoDB indexes for performance
- Indexes on: `church_id`, `email`, `phone`, `member_id`, `event_date`
- Run once during setup

---

## Frontend Structure

### `/app/frontend/`

```
frontend/
├── public/                     # Static assets
├── src/                        # React source code
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Shadcn/UI components
│   │   ├── charts/             # Chart components (Recharts wrappers)
│   │   ├── Layout.js           # Main layout wrapper
│   │   ├── DesktopSidebar.js   # Desktop navigation
│   │   ├── MobileBottomNav.js  # Mobile navigation
│   │   ├── EmptyState.js       # Empty state UI
│   │   ├── LoadingState.js     # Loading spinner
│   │   ├── ErrorState.js       # Error display
│   │   ├── MemberAvatar.js     # Member photo display
│   │   ├── EngagementBadge.js  # Status badge (active/at-risk/disconnected)
│   │   ├── EventTypeBadge.js   # Event type badge
│   │   └── LanguageToggle.js   # EN/ID language switcher
│   ├── pages/                  # Top-level page components
│   │   ├── Dashboard.js        # Main dashboard (TanStack Query)
│   │   ├── MemberDetail.js     # Member profile (TanStack Query)
│   │   ├── MembersList.js      # All members list
│   │   ├── Analytics.js        # Analytics & charts
│   │   ├── Settings.js         # User/campus settings
│   │   ├── FinancialAid.js     # Financial aid management
│   │   ├── ImportExport.js     # CSV import/export
│   │   ├── WhatsAppLogs.js     # Notification logs
│   │   ├── Calendar.js         # Calendar view (future)
│   │   ├── LoginPage.js        # Login form
│   │   └── AdminDashboard.js   # Admin-only dashboard
│   ├── context/                # React Context providers
│   │   └── AuthContext.js      # Authentication state & JWT storage
│   ├── hooks/                  # Custom React hooks
│   │   └── use-toast.js        # Toast notifications (Sonner)
│   ├── lib/                    # Utility libraries
│   │   └── utils.js            # Tailwind class merger, helpers
│   ├── locales/                # Internationalization (i18n)
│   │   ├── en.json             # English translations
│   │   └── id.json             # Indonesian translations
│   ├── App.js                  # Root React component
│   ├── App.css                 # Root styles
│   ├── index.js                # React entry point
│   ├── index.css               # Global CSS (Tailwind imports)
│   └── i18n.js                 # i18next configuration
├── .env                        # Environment variables (DO NOT COMMIT)
├── package.json                # Node.js dependencies
├── yarn.lock                   # Yarn lock file
├── tailwind.config.js          # Tailwind CSS configuration
├── jsconfig.json               # JS path aliases (@/ = src/)
└── craco.config.js             # Create React App override config
```

---

### Key Frontend Files

#### **`src/App.js`** (Root Component)
Entry point for the React application.

**Key Features:**
- Wraps app in `AuthContext.Provider` for authentication
- Wraps app in `QueryClientProvider` (TanStack React Query)
- Sets up routing (React Router)
- Includes `Toaster` component for notifications

**Structure:**
```jsx
<AuthContextProvider>
  <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/members/:id" element={<MemberDetail />} />
          {/* ... more routes */}
        </Route>
      </Routes>
    </Router>
    <Toaster />
  </QueryClientProvider>
</AuthContextProvider>
```

---

#### **`src/pages/Dashboard.js`** (CRITICAL - MOST COMPLEX PAGE)
The main user interface - a task-oriented dashboard.

**Architecture:**
- **State Management**: TanStack React Query (`useQuery`)
- **Data Fetching**: Automated caching, background refetching
- **UI**: Nested 3-tab structure (Tasks, Members, Care Events)
- **Sub-tabs**: Today, Overdue, Upcoming

**Key Functions:**
- `useDashboardData()` - Custom hook that fetches all dashboard data
- `handleCompleteTask()` - Marks a task complete, invalidates queries
- `handleIgnoreTask()` - Ignores a task
- `handleSendReminder()` - Sends WhatsApp reminder

**Data Flow:**
```
Dashboard.js
  └─ useQuery('dashboardData')
      └─ axios.get('/api/dashboard/reminders')
          └─ Backend filters by church_id
              └─ Returns: { today: [], overdue: [], upcoming: [] }
```

**Why TanStack Query?**
- Solves caching and data consistency issues
- Automatic background refetching
- Optimistic updates
- Easy mutation management with `invalidateQueries()`

---

#### **`src/pages/MemberDetail.js`** (2ND MOST CRITICAL)
Detailed member profile view.

**Architecture:**
- **State Management**: TanStack React Query
- **Data**: Member info, care events, financial aid schedules, family members
- **Actions**: Edit member, add event, delete member, upload photo

**Key Sections:**
1. **Member Info**: Name, contact, birthday, engagement status
2. **Care Event Timeline**: Chronological list of all interactions
3. **Upcoming Events**: Future scheduled events
4. **Family Members**: Other members in same family group
5. **Financial Aid**: Active and past aid schedules

**Data Flow:**
```
MemberDetail.js
  └─ useQuery(['member', member_id])
      └─ axios.get(`/api/members/${member_id}`)
  └─ useQuery(['careEvents', member_id])
      └─ axios.get(`/api/care-events?member_id=${member_id}`)
```

---

#### **`src/context/AuthContext.js`**
Global authentication state management.

**Provides:**
- `user` - Current user object
- `token` - JWT access token
- `login(email, password)` - Login function
- `logout()` - Logout function
- `isAuthenticated` - Boolean flag

**Storage:**
- JWT token stored in `localStorage`
- Token included in all axios requests via interceptor

**Usage:**
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

#### **`src/i18n.js`** (Internationalization)
Configures react-i18next for bilingual support.

**Languages:**
- English (en)
- Indonesian (id)

**Translation Files:**
- `/src/locales/en.json`
- `/src/locales/id.json`

**Usage in Components:**
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('dashboard.title')}</h1>;
}
```

**Translation Keys:**
```json
// en.json
{
  "dashboard": {
    "title": "Dashboard",
    "today": "Today",
    "overdue": "Overdue"
  }
}

// id.json
{
  "dashboard": {
    "title": "Dasbor",
    "today": "Hari Ini",
    "overdue": "Terlambat"
  }
}
```

---

#### **`src/components/ui/`** (Shadcn/UI Components)
Pre-built, styled UI components from Shadcn/UI.

**Available Components:**
- `button.jsx` - Button variants
- `card.jsx` - Card container
- `input.jsx` - Text input
- `select.jsx` - Dropdown select
- `dialog.jsx` - Modal dialog
- `tabs.jsx` - Tab navigation
- `badge.jsx` - Status badge
- `toast.jsx` - Toast notifications
- `avatar.jsx` - User avatar
- `calendar.jsx` - Date picker
- ... and many more

**Usage:**
```jsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
    </Card>
  );
}
```

---

#### **`src/components/Layout.js`**
Main layout wrapper for all pages.

**Structure:**
```jsx
<Layout>
  <DesktopSidebar />    {/* Left nav for desktop */}
  <main>
    <Outlet />          {/* Page content */}
  </main>
  <MobileBottomNav />   {/* Bottom nav for mobile */}
</Layout>
```

---

### Configuration Files

#### **`tailwind.config.js`**
Tailwind CSS configuration.

**Custom Theme:**
- Design tokens (colors, spacing, fonts)
- Dark mode support
- Custom color palette from design guidelines

#### **`jsconfig.json`**
Enables `@/` path alias for imports.

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

**Usage:**
```jsx
// Instead of: import Button from "../../components/ui/button"
import Button from "@/components/ui/button";
```

---

## Key Files & Their Purpose

### Most Important Files (Top 10)

| Rank | File | Lines | Purpose | Criticality |
|------|------|-------|---------|-------------|
| 1 | `backend/server.py` | 4400+ | Entire backend API | **Critical** |
| 2 | `frontend/src/pages/Dashboard.js` | 800+ | Main UI & task management | **Critical** |
| 3 | `frontend/src/pages/MemberDetail.js` | 600+ | Member profile & care history | **Critical** |
| 4 | `frontend/src/context/AuthContext.js` | 200+ | Authentication state | **High** |
| 5 | `frontend/src/App.js` | 150+ | React app entry point | **High** |
| 6 | `frontend/src/i18n.js` | 100+ | Bilingual support | **High** |
| 7 | `backend/scheduler.py` | 150+ | Background jobs | **Medium** |
| 8 | `frontend/src/locales/en.json` | 500+ | English translations | **Medium** |
| 9 | `frontend/src/locales/id.json` | 500+ | Indonesian translations | **Medium** |
| 10 | `frontend/src/components/Layout.js` | 200+ | App layout structure | **Medium** |

---

## Design Patterns

### Backend Patterns

#### **1. Monolithic API Server**
All endpoints in a single `server.py` file.

**Pros:**
- Simple deployment
- Easy to search and understand
- No import complexity

**Cons:**
- Large file size (4400+ lines)
- Can be intimidating for new developers

---

#### **2. Dependency Injection for Auth**
```python
def get_current_user(token: str = Depends(security)):
    # Decode JWT and return user
    pass

@api_router.get("/protected")
async def protected_route(user = Depends(get_current_user)):
    # user is automatically injected
    pass
```

---

#### **3. Pydantic Models for Validation**
```python
class Member(BaseModel):
    name: str = Field(..., min_length=1)
    phone: str = Field(..., regex=r"^\+?\d{10,15}$")
    email: Optional[EmailStr] = None
    dob: Optional[date] = None
```

---

#### **4. Church ID Auto-Scoping**
Every query automatically filters by `church_id`:
```python
members = await db.members.find({
    "church_id": user["church_id"]
}).to_list(None)
```

---

### Frontend Patterns

#### **1. TanStack React Query for Data Fetching**
Used in `Dashboard.js` and `MemberDetail.js` for robust state management.

```jsx
const { data, isLoading, error } = useQuery({
  queryKey: ['members'],
  queryFn: async () => {
    const res = await axios.get('/api/members');
    return res.data;
  }
});
```

**Benefits:**
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

---

#### **2. Context API for Global State**
Used for authentication (`AuthContext.js`).

```jsx
const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

#### **3. Component Composition**
Small, reusable components composed together.

```jsx
<Card>
  <CardHeader>
    <MemberAvatar src={member.photo_url} />
    <CardTitle>{member.name}</CardTitle>
    <EngagementBadge status={member.engagement_status} />
  </CardHeader>
  <CardContent>
    {/* ... */}
  </CardContent>
</Card>
```

---

#### **4. Internationalization with Hooks**
```jsx
const { t, i18n } = useTranslation();

<button onClick={() => i18n.changeLanguage('id')}>
  {t('settings.language')}
</button>
```

---

## State Management

### Backend State
- **Database**: MongoDB (persistent state)
- **In-Memory**: JWT tokens, user sessions
- **Scheduler**: APScheduler background jobs

### Frontend State
- **Global State**: `AuthContext` (user, token)
- **Server State**: TanStack React Query (API data)
- **Local State**: `useState` for UI-only state (modals, form inputs)
- **URL State**: React Router for page navigation

---

## Styling & UI

### Approach
- **Utility-First CSS**: Tailwind CSS
- **Component Library**: Shadcn/UI (pre-styled, customizable)
- **Icons**: Lucide React

### Design Tokens
Defined in `tailwind.config.js`:
- Colors: Primary, secondary, accent, semantic (success, error, warning)
- Spacing: Consistent spacing scale (4px, 8px, 16px, etc.)
- Typography: Font families, sizes, weights
- Shadows, borders, radii

### Mobile-First Design
All components are responsive, with mobile breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## Development Workflow

### Backend Development

1. **Make changes** to `server.py` or other backend files
2. **Backend auto-reloads** (Uvicorn with `--reload` flag)
3. **Test API** using `curl`, Postman, or `test_api.sh`
4. **Check logs**: `tail -f /var/log/supervisor/backend.err.log`

### Frontend Development

1. **Make changes** to React components
2. **Frontend hot-reloads** automatically (React Fast Refresh)
3. **Check browser console** for errors
4. **Test UI** in browser
5. **Check logs**: Browser DevTools console or `tail -f /var/log/supervisor/frontend.err.log`

### Adding a New Feature

**Example: Adding a "Prayer Request" Event Type**

1. **Backend**:
   - Add `PRAYER_REQUEST` to `EventType` enum in `server.py`
   - Add API endpoint: `@api_router.post("/prayer-requests")`
   - Update dashboard query to include prayer requests

2. **Frontend**:
   - Add translation keys to `en.json` and `id.json`
   - Update `Dashboard.js` to display prayer request tasks
   - Create `PrayerRequestBadge.js` component
   - Add form to create prayer requests

3. **Testing**:
   - Test API endpoint with `curl`
   - Test UI in browser
   - Call `testing_agent_v3` for comprehensive testing

---

## File Naming Conventions

### Backend
- Python files: `snake_case.py` (e.g., `server.py`, `scheduler.py`)
- Scripts: `verb_noun.py` (e.g., `import_data.py`, `create_indexes.py`)

### Frontend
- React components: `PascalCase.js` (e.g., `Dashboard.js`, `MemberDetail.js`)
- Utility files: `camelCase.js` or `kebab-case.js` (e.g., `utils.js`, `use-toast.js`)
- Shadcn components: `kebab-case.jsx` (e.g., `button.jsx`, `card.jsx`)

---

## Import Patterns

### Backend
```python
# Standard library
from datetime import datetime, timezone
import os

# Third-party
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Local (none in monolithic approach)
```

### Frontend
```jsx
// React & libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Local components (with @ alias)
import { Button } from '@/components/ui/button';
import MemberAvatar from '@/components/MemberAvatar';

// Context & hooks
import { useAuth } from '@/context/AuthContext';
```

---

## Database Schema (MongoDB)

### Collections

**1. `users`**
- `_id`: UUID
- `email`: String (unique)
- `password_hash`: String
- `name`: String
- `role`: Enum (full_admin, campus_admin, pastor)
- `church_id`: UUID (null for full_admin)

**2. `campuses`**
- `_id`: UUID
- `name`: String
- `location`: String
- `timezone`: String

**3. `members`**
- `_id`: UUID
- `church_id`: UUID (indexed)
- `name`: String
- `phone`: String
- `email`: String (optional)
- `dob`: Date (optional)
- `address`: String
- `family_group`: String
- `engagement_status`: Enum
- `last_contact`: DateTime
- `photo_url`: String

**4. `care_events`**
- `_id`: UUID
- `church_id`: UUID (indexed)
- `member_id`: UUID (indexed)
- `event_type`: Enum
- `event_date`: Date (indexed)
- `notes`: String
- `completed`: Boolean
- `completed_at`: DateTime
- `completed_by`: UUID
- `ignored`: Boolean

**5. `financial_aid_schedules`**
- `_id`: UUID
- `church_id`: UUID
- `member_id`: UUID
- `aid_type`: Enum
- `amount`: Float
- `frequency`: Enum
- `day_of_month`: Int (for monthly)
- `day_of_week`: String (for weekly)
- `start_date`: Date
- `is_active`: Boolean
- `ignored_dates`: Array[Date]

**6. `family_groups`**
- `_id`: UUID
- `church_id`: UUID
- `name`: String
- `address`: String
- `notes`: String

**7. `notification_logs`**
- `_id`: UUID
- `church_id`: UUID
- `channel`: Enum (whatsapp, email)
- `recipient`: String
- `message`: String
- `status`: Enum (sent, failed, pending)
- `sent_at`: DateTime
- `error`: String (optional)

---

## Future Improvements

### Backend
- **Split `server.py`** into modules (`models/`, `routes/`, `services/`)
- **Add API versioning** (`/api/v1/`, `/api/v2/`)
- **Implement rate limiting** (per user, per endpoint)
- **Add unit tests** (pytest)
- **Add database migrations** (Alembic or similar)

### Frontend
- **Migrate remaining pages to TanStack Query** (currently only Dashboard & MemberDetail)
- **Add end-to-end tests** (Playwright)
- **Implement offline support** (Service Workers)
- **Add real-time updates** (WebSockets for task notifications)
- **Optimize bundle size** (code splitting, lazy loading)

---

## Getting Started for Developers

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/faithtracker.git
cd faithtracker
```

### 2. Set Up Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env with your MongoDB connection, JWT secret, etc.
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### 3. Set Up Frontend
```bash
cd frontend
yarn install
cp ../.env.example .env
# Edit .env with REACT_APP_BACKEND_URL
yarn start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api
- API Docs: http://localhost:8001/docs (FastAPI auto-generated)

---

## Troubleshooting

**Backend not starting:**
- Check MongoDB connection in `.env`
- Check Python version (requires 3.9+)
- Check logs: `python server.py` (run directly to see errors)

**Frontend not starting:**
- Check Node version (requires 16+)
- Clear cache: `rm -rf node_modules && yarn install`
- Check `REACT_APP_BACKEND_URL` in `.env`

**API calls failing:**
- Check CORS settings in `server.py`
- Verify JWT token is included in request headers
- Check network tab in browser DevTools

---

**End of Structure Documentation**

For more information:
- [Features Guide](/docs/FEATURES.md)
- [API Reference](/docs/API.md)
- [Deployment Guide](/docs/DEPLOYMENT_DEBIAN.md)
