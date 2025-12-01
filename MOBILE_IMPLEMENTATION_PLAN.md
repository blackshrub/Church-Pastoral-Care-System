# FaithTracker Mobile App Implementation Plan

## Overview

Build a world-class React Native mobile app for FaithTracker pastoral care system, reusing the design system, motion patterns, and component architecture from the reference app in `mobile-reference/`.

**Target Platforms:** iOS & Android
**Tech Stack:** React Native 0.81+ / Expo SDK 54 / TypeScript

---

## Phase 1: Project Setup & Foundation

### 1.1 Initialize Expo Project
```bash
npx create-expo-app@latest mobile --template expo-template-blank-typescript
cd mobile
```

### 1.2 Install Core Dependencies

**Navigation & Routing:**
- `expo-router` - File-based routing
- `react-native-screens` - Native screen optimization
- `react-native-safe-area-context` - Safe area handling

**UI Framework:**
- `@gluestack-ui/themed` - Component library (86 components)
- `nativewind` + `tailwindcss` - Tailwind CSS for React Native
- `lucide-react-native` - Icon library

**State & Data:**
- `zustand` - Lightweight state management
- `@tanstack/react-query` - Server state & caching
- `axios` - HTTP client

**Animation & Motion:**
- `react-native-reanimated` - High-performance animations
- `moti` - Spring animations
- `expo-linear-gradient` - Gradient backgrounds

**Storage & Security:**
- `expo-secure-store` - Secure token storage
- `@react-native-async-storage/async-storage` - General storage
- `expo-sqlite` - Offline data queue

**Other:**
- `react-native-gesture-handler` - Gesture handling
- `expo-haptics` - Haptic feedback
- `react-i18next` + `i18next` - Bilingual (EN/ID)
- `react-native-toast-message` - Toast notifications
- `expo-notifications` - Push notifications
- `date-fns` - Date utilities

### 1.3 Copy Design System from Reference

From `mobile-reference/` copy:
```
constants/
├── spacing.ts          → Spacing & radius tokens
├── theme.ts            → Colors, typography, shadows
├── interaction.ts      → Haptics, press feedback, animations

components/motion/
├── premium-motion.ts   → PMotion, PMotionV10 presets
└── index.ts            → Motion exports

hoc/
├── withPremiumMotionV10.tsx → Screen transition HOC
└── index.ts

components/overlay/
├── UnifiedOverlayHost.tsx → Centralized modal/sheet host
├── BaseBottomSheet.tsx    → Bottom sheet wrapper
├── SharedAxisModal.tsx    → Center modal wrapper
└── index.ts

stores/
└── overlayStore.ts     → Overlay state management

theme/
└── overlayTheme.ts     → Modal/sheet design tokens
```

### 1.4 Adapt Color Palette for FaithTracker

Create `constants/faithtracker-theme.ts`:
```typescript
export const FaithTrackerColors = {
  // Primary - Teal (Trust, Care, Faith)
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main brand
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Secondary/Accent - Amber (Warmth, Care)
  secondary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Accent
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Semantic colors (keep from reference)
  success: { ... }, // Green
  warning: { ... }, // Amber
  error: { ... },   // Red
  info: { ... },    // Blue
  gray: { ... },    // Neutrals
};
```

---

## Phase 2: Authentication & Core Structure

### 2.1 File Structure
```
mobile/
├── app/
│   ├── _layout.tsx              # Root layout (providers, UnifiedOverlayHost)
│   ├── (auth)/
│   │   ├── _layout.tsx          # Auth stack layout
│   │   └── login.tsx            # Email/password login
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar layout
│   │   ├── index.tsx            # Today/Dashboard
│   │   ├── members.tsx          # Members list
│   │   ├── tasks.tsx            # All tasks view
│   │   └── profile.tsx          # User profile
│   └── member/
│       └── [id].tsx             # Member detail + timeline
├── components/
│   ├── ui/                      # Gluestack UI components
│   ├── overlay/                 # Modal/sheet system
│   ├── motion/                  # Animation presets
│   ├── navigation/              # Tab bar
│   ├── dashboard/               # Dashboard components
│   ├── members/                 # Member list components
│   ├── tasks/                   # Task components
│   └── care-events/             # Care event sheets
├── stores/
│   ├── auth.ts                  # Auth state (token, user)
│   ├── overlayStore.ts          # Overlay management
│   └── offlineQueue.ts          # Offline action queue
├── hooks/
│   ├── useAuth.ts               # Auth hook
│   ├── useMembers.ts            # Members query
│   ├── useDashboard.ts          # Dashboard data
│   ├── useCareEvents.ts         # Care events query
│   └── useOfflineSync.ts        # Offline sync
├── services/
│   ├── api.ts                   # Axios instance
│   └── notifications.ts         # Push notifications
├── constants/
│   ├── faithtracker-theme.ts    # FaithTracker colors
│   ├── spacing.ts               # Spacing tokens
│   ├── interaction.ts           # Haptics/animations
│   └── api.ts                   # API endpoints
├── lib/
│   └── queryClient.ts           # React Query client
├── locales/
│   ├── en.json                  # English
│   └── id.json                  # Indonesian
└── types/
    └── index.ts                 # TypeScript types
```

### 2.2 Auth Store (`stores/auth.ts`)

Adapt from reference with FaithTracker user model:
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'full_admin' | 'campus_admin' | 'pastor';
  campus_id: string;
  campus_name: string;
  phone?: string;
  photo_url?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}
```

### 2.3 API Service (`services/api.ts`)

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2.4 Root Layout (`app/_layout.tsx`)

```typescript
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider mode={colorScheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

          <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="member/[id]" />
          </Stack>

          {/* Unified Overlay System */}
          <UnifiedOverlayHost />
          <Toast />
        </GluestackUIProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

---

## Phase 3: Dashboard (Today Tab)

### 3.1 Dashboard Data Hook (`hooks/useDashboard.ts`)

```typescript
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'reminders'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/reminders');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 3.2 Dashboard Screen (`app/(tabs)/index.tsx`)

Features:
- Time-based greeting (Good Morning/Afternoon/Evening)
- Quick stats: Today's tasks, Overdue, Total members
- Today's Tasks section (birthdays, grief stages, followups)
- Overdue Tasks section (highlighted)
- Quick actions: View Members, View All Tasks

Components:
- `DashboardHeader` - Greeting + stats
- `TaskSection` - Grouped task cards
- `TaskCard` - Individual task with member info + action buttons

### 3.3 Task Types

Display all task types from `/dashboard/reminders`:
- **Birthdays Today** - Complete = log contact
- **Grief Stages Due** - Complete/Ignore
- **Accident Followups Due** - Complete/Ignore
- **Financial Aid Due** - Mark distributed

Each task card shows:
- Member photo (avatar)
- Member name
- Task type badge (color-coded)
- Due date/status
- Quick actions (Complete, View Member, Call/WhatsApp)

---

## Phase 4: Members Tab

### 4.1 Members List (`app/(tabs)/members.tsx`)

Features:
- Search bar with 2-second debounce
- Filter by engagement status (All, Active, At-Risk, Disconnected)
- Pull-to-refresh
- FlashList for performance (100+ members)
- FAB for quick member add (if needed)

### 4.2 Member Card Component

Display:
- Photo (thumbnail)
- Name
- Phone number
- Engagement status badge (color-coded)
- Days since last contact
- Tap to navigate to detail

### 4.3 Members Hook (`hooks/useMembers.ts`)

```typescript
export function useMembers(filters: MemberFilters) {
  return useInfiniteQuery({
    queryKey: ['members', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data, headers } = await api.get('/members', {
        params: { page: pageParam, limit: 50, ...filters }
      });
      return { members: data, total: headers['x-total-count'] };
    },
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.flatMap(p => p.members).length;
      return loaded < lastPage.total ? pages.length + 1 : undefined;
    },
  });
}
```

---

## Phase 5: Member Detail + Care Events

### 5.1 Member Detail Screen (`app/member/[id].tsx`)

Layout:
1. **Header** - Photo, name, contact buttons (Call, WhatsApp)
2. **Profile Section** - Phone, email, address, birth date, etc.
3. **Engagement Badge** - Status with days since contact
4. **Timeline Section** - Care events chronologically
5. **FAB** - Add new care event (opens bottom sheet)

### 5.2 Timeline Event Card

Display:
- Event type icon + color
- Title
- Date
- Status (Completed, Pending, Ignored)
- Completed by (if applicable)
- Tap to view/edit

### 5.3 Care Event Bottom Sheets

Using `UnifiedOverlayHost` + `overlayStore`:

**CreateCareEventSheet:**
```typescript
const { showBottomSheet } = useOverlayStore();

// Open sheet
showBottomSheet(CreateCareEventSheet, { memberId, memberName });
```

Sheet content:
- Event type selector (Birthday, Grief, Accident, Financial Aid, etc.)
- Date picker
- Description field
- Type-specific fields:
  - Grief: Relationship selector
  - Accident: Hospital name
  - Financial Aid: Amount, aid type

**ViewCareEventSheet:**
- Event details
- Status
- Complete/Ignore buttons
- Delete option
- Visitation log (for hospital events)

### 5.4 Care Events Hook (`hooks/useCareEvents.ts`)

```typescript
export function useMemberCareEvents(memberId: string) {
  return useQuery({
    queryKey: ['careEvents', memberId],
    queryFn: async () => {
      const { data } = await api.get('/care-events', {
        params: { member_id: memberId }
      });
      return data;
    },
  });
}

export function useCreateCareEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: CreateCareEventInput) => {
      const { data } = await api.post('/care-events', event);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['careEvents', variables.member_id]);
      queryClient.invalidateQueries(['dashboard']);
    },
  });
}

export function useCompleteCareEvent() {
  return useMutation({
    mutationFn: async (eventId: string) => {
      await api.post(`/care-events/${eventId}/complete`);
    },
    // Optimistic update + invalidation
  });
}
```

---

## Phase 6: Tasks Tab

### 6.1 All Tasks View (`app/(tabs)/tasks.tsx`)

Features:
- Tab filter: Today | Upcoming | Overdue | Completed
- Group by date or type
- Same task cards as dashboard
- Pull-to-refresh
- Search/filter by member name

### 6.2 Task Data Aggregation

Combine data from:
- `/dashboard/reminders` - Birthdays, grief, accidents, financial aid
- `/care-events?completed=false` - Pending care events
- `/grief-support?completed=false` - Grief stages
- `/accident-followup` - Accident followups

---

## Phase 7: Profile Tab

### 7.1 Profile Screen (`app/(tabs)/profile.tsx`)

Features:
- User photo + name
- Role badge
- Campus name
- Language switcher (EN/ID)
- Dark mode toggle
- Notification settings
- Logout button
- App version

---

## Phase 8: Offline Support

### 8.1 Offline Queue Store (`stores/offlineQueue.ts`)

```typescript
interface QueuedAction {
  id: string;
  type: 'CREATE_CARE_EVENT' | 'COMPLETE_EVENT' | 'UPDATE_MEMBER';
  payload: any;
  createdAt: number;
  retryCount: number;
}

interface OfflineQueueState {
  queue: QueuedAction[];
  isOnline: boolean;

  addToQueue: (action: Omit<QueuedAction, 'id' | 'createdAt' | 'retryCount'>) => void;
  processQueue: () => Promise<void>;
  setOnline: (online: boolean) => void;
}
```

### 8.2 Network Detection

```typescript
import NetInfo from '@react-native-community/netinfo';

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    offlineQueueStore.setOnline(state.isConnected);

    if (state.isConnected) {
      offlineQueueStore.processQueue();
    }
  });

  return unsubscribe;
}, []);
```

### 8.3 Offline-First Pattern

```typescript
export function useCreateCareEvent() {
  const { isOnline, addToQueue } = useOfflineQueueStore();

  return useMutation({
    mutationFn: async (event: CreateCareEventInput) => {
      if (!isOnline) {
        // Queue for later
        addToQueue({ type: 'CREATE_CARE_EVENT', payload: event });
        // Optimistic local update
        return { id: `temp-${Date.now()}`, ...event };
      }

      const { data } = await api.post('/care-events', event);
      return data;
    },
  });
}
```

### 8.4 SQLite for Offline Data

Store cached data locally:
- Members list (for search)
- Recent care events
- User preferences

---

## Phase 9: Push Notifications

### 9.1 Setup Expo Notifications

```typescript
import * as Notifications from 'expo-notifications';

async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = await Notifications.getExpoPushTokenAsync();
  // Send token to backend
  await api.post('/users/push-token', { token: token.data });
}
```

### 9.2 Notification Types

Backend sends notifications for:
- Birthday reminders (morning of)
- Overdue task alerts (daily digest)
- Grief stage due dates
- Financial aid due dates

### 9.3 Handle Notification Tap

```typescript
Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;

  if (data.type === 'birthday' || data.type === 'grief_stage') {
    router.push(`/member/${data.member_id}`);
  }
});
```

---

## Phase 10: Testing & Polish

### 10.1 Unit Tests

- Auth store tests
- Offline queue tests
- Hook tests (mocked API)

### 10.2 E2E Tests (Detox/Maestro)

- Login flow
- View dashboard
- Create care event
- Complete task
- Offline mode

### 10.3 Performance Optimization

- FlashList for long lists
- Image caching
- Memoization with `useMemo`/`useCallback`
- Tab freezing (`freezeOnBlur: true`)

### 10.4 Accessibility

- Minimum 44x44 touch targets
- Screen reader labels
- High contrast mode support
- Dynamic font scaling

---

## Implementation Order

| Phase | Description | Priority |
|-------|-------------|----------|
| 1 | Project setup, dependencies, design system | P0 |
| 2 | Auth flow, API service, root layout | P0 |
| 3 | Dashboard with tasks | P0 |
| 4 | Members list with search | P0 |
| 5 | Member detail + care event sheets | P0 |
| 6 | All tasks view | P1 |
| 7 | Profile tab | P1 |
| 8 | Offline support | P1 |
| 9 | Push notifications | P2 |
| 10 | Testing & polish | P2 |

---

## Key Patterns to Reuse

### Screen Wrapper (Premium Motion)
```typescript
export default withPremiumMotionV10(MemberDetailScreen);
```

### Bottom Sheet Pattern
```typescript
const { showBottomSheet, close } = useOverlayStore();

// Open
showBottomSheet(CreateCareEventSheet, { memberId });

// In sheet component
export function CreateCareEventSheet({ payload, onClose }) {
  const { memberId } = payload;
  // ... form
  <Button onPress={onClose}>Cancel</Button>
}
```

### Staggered List Animation
```typescript
{items.map((item, index) => (
  <Animated.View
    key={item.id}
    entering={PMotionV10.cardStagger(index)}
  >
    <ItemCard item={item} />
  </Animated.View>
))}
```

### Haptic Feedback
```typescript
import { haptics } from '@/constants/interaction';

<Pressable onPress={() => {
  haptics.tap();
  handleComplete();
}}>
```

---

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Login |
| `/auth/me` | GET | Current user |
| `/dashboard/reminders` | GET | Today's tasks |
| `/members` | GET | Members list |
| `/members/{id}` | GET | Member detail |
| `/care-events` | GET/POST | Care events |
| `/care-events/{id}` | GET/PUT/DELETE | Single event |
| `/care-events/{id}/complete` | POST | Complete event |
| `/care-events/{id}/ignore` | POST | Ignore event |
| `/grief-support` | GET | Grief stages |
| `/grief-support/{id}/complete` | POST | Complete stage |
| `/accident-followup` | GET | Accident followups |
| `/financial-aid-schedules/due-today` | GET | Financial aid due |

---

## Next Steps

1. User confirms renaming `mobile` → `mobile-reference`
2. Create fresh `mobile/` directory
3. Initialize Expo project
4. Install dependencies
5. Copy design system files
6. Begin Phase 1-2 implementation

Ready to proceed when user approves this plan.
