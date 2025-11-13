# Church Pastoral Care Tracking System - Design Guidelines

## Design Philosophy

Create a warm, compassionate, and professional interface that reflects the caring nature of pastoral ministry. The design should feel welcoming and trustworthy while maintaining clarity for efficient care tracking. Avoid clinical or corporate aesthetics—this is about human connection and spiritual care.

**Core Attributes:**
- Compassionate & Warm
- Professional & Trustworthy
- Clear & Organized
- Calming & Peaceful
- Approachable & Human-Centered

---

## GRADIENT RESTRICTION RULE

**NEVER use dark/saturated gradient combos (e.g., purple/pink, blue-500 to purple-600) on any UI element.**

**NEVER let gradients cover more than 20% of the viewport.**

**NEVER apply gradients to text-heavy content or reading areas.**

**NEVER use gradients on small UI elements (<100px width).**

**NEVER stack multiple gradient layers in the same viewport.**

### ENFORCEMENT RULE
IF gradient area exceeds 20% of viewport OR impacts readability
THEN fallback to solid colors or simple, two-color gradients.

### ALLOWED GRADIENT USAGE
- Hero/landing sections (background only, ensure text readability)
- Section backgrounds (not content blocks)
- Large CTA buttons / major interactive elements (light/simple gradients only)
- Decorative overlays and accent visuals

---

## Color System

### Primary Palette

**Primary (Sage Green - Healing & Growth):**
- `--primary-50: hsl(140, 25%, 97%)`  // Lightest sage
- `--primary-100: hsl(140, 25%, 92%)` // Very light sage
- `--primary-200: hsl(140, 25%, 82%)` // Light sage
- `--primary-300: hsl(140, 25%, 68%)` // Soft sage
- `--primary-400: hsl(140, 28%, 55%)` // Medium sage
- `--primary-500: hsl(140, 32%, 45%)` // Main sage (primary action color)
- `--primary-600: hsl(140, 35%, 38%)` // Deep sage
- `--primary-700: hsl(140, 38%, 30%)` // Darker sage
- `--primary-800: hsl(140, 40%, 22%)` // Very dark sage
- `--primary-900: hsl(140, 42%, 15%)` // Darkest sage

**Secondary (Warm Peach - Compassion & Warmth):**
- `--secondary-50: hsl(25, 85%, 97%)`  // Lightest peach
- `--secondary-100: hsl(25, 85%, 92%)` // Very light peach
- `--secondary-200: hsl(25, 85%, 85%)` // Light peach
- `--secondary-300: hsl(25, 85%, 75%)` // Soft peach
- `--secondary-400: hsl(25, 85%, 68%)` // Medium peach
- `--secondary-500: hsl(25, 88%, 62%)` // Main peach (Pantone Peach Fuzz inspired)
- `--secondary-600: hsl(25, 85%, 55%)` // Deep peach
- `--secondary-700: hsl(25, 82%, 48%)` // Darker peach
- `--secondary-800: hsl(25, 78%, 40%)` // Very dark peach
- `--secondary-900: hsl(25, 75%, 32%)` // Darkest peach

**Accent (Soft Teal - Trust & Calm):**
- `--accent-50: hsl(180, 35%, 97%)`
- `--accent-100: hsl(180, 35%, 92%)`
- `--accent-200: hsl(180, 35%, 82%)`
- `--accent-300: hsl(180, 35%, 68%)`
- `--accent-400: hsl(180, 38%, 55%)`
- `--accent-500: hsl(180, 42%, 45%)` // Main teal
- `--accent-600: hsl(180, 45%, 38%)`
- `--accent-700: hsl(180, 48%, 30%)`
- `--accent-800: hsl(180, 50%, 22%)`
- `--accent-900: hsl(180, 52%, 15%)`

### Neutral Palette (Warm Grays)

**Light Mode:**
- `--background: hsl(30, 15%, 98%)`     // Warm off-white
- `--foreground: hsl(30, 8%, 15%)`      // Warm dark gray
- `--card: hsl(0, 0%, 100%)`            // Pure white for cards
- `--card-foreground: hsl(30, 8%, 15%)` // Warm dark gray
- `--muted: hsl(30, 12%, 95%)`          // Soft warm gray
- `--muted-foreground: hsl(30, 6%, 45%)` // Medium warm gray
- `--border: hsl(30, 10%, 88%)`         // Light warm border
- `--input: hsl(30, 10%, 88%)`          // Light warm input border
- `--ring: hsl(140, 32%, 45%)`          // Primary sage for focus rings

**Dark Mode:**
- `--background: hsl(30, 8%, 8%)`       // Warm very dark gray
- `--foreground: hsl(30, 10%, 95%)`     // Warm off-white
- `--card: hsl(30, 8%, 12%)`            // Warm dark card
- `--card-foreground: hsl(30, 10%, 95%)` // Warm off-white
- `--muted: hsl(30, 8%, 18%)`           // Warm dark muted
- `--muted-foreground: hsl(30, 6%, 60%)` // Medium warm gray
- `--border: hsl(30, 8%, 22%)`          // Dark warm border
- `--input: hsl(30, 8%, 22%)`           // Dark warm input border
- `--ring: hsl(140, 28%, 55%)`          // Lighter sage for dark mode focus

### Semantic Colors

**Success (Growth & Positive Events):**
- `--success: hsl(140, 55%, 48%)`
- `--success-foreground: hsl(0, 0%, 100%)`

**Warning (Upcoming/Overdue Reminders):**
- `--warning: hsl(38, 92%, 50%)`
- `--warning-foreground: hsl(30, 8%, 15%)`

**Error (Critical Issues):**
- `--error: hsl(0, 72%, 51%)`
- `--error-foreground: hsl(0, 0%, 100%)`

**Info (General Notifications):**
- `--info: hsl(200, 85%, 55%)`
- `--info-foreground: hsl(0, 0%, 100%)`

### Event Type Colors (For Care Event Categories)

**Birthday:**
- `--event-birthday: hsl(45, 90%, 65%)` // Warm golden yellow
- `--event-birthday-bg: hsl(45, 90%, 95%)`

**Childbirth:**
- `--event-childbirth: hsl(330, 75%, 70%)` // Soft pink
- `--event-childbirth-bg: hsl(330, 75%, 97%)`

**Grief/Loss:**
- `--event-grief: hsl(240, 15%, 45%)` // Muted blue-gray
- `--event-grief-bg: hsl(240, 15%, 95%)`

**New House:**
- `--event-newhouse: hsl(25, 85%, 62%)` // Warm peach (secondary)
- `--event-newhouse-bg: hsl(25, 85%, 97%)`

**Accident/Illness:**
- `--event-accident: hsl(15, 70%, 58%)` // Warm coral
- `--event-accident-bg: hsl(15, 70%, 96%)`

**Regular Contact:**
- `--event-contact: hsl(180, 42%, 45%)` // Soft teal (accent)
- `--event-contact-bg: hsl(180, 35%, 97%)`

**Prayer Request:**
- `--event-prayer: hsl(260, 40%, 60%)` // Soft lavender
- `--event-prayer-bg: hsl(260, 40%, 97%)`

### Gradient Definitions (Use Sparingly - Max 20% Viewport)

**Hero Section Gradient (Horizontal, Light):**
```css
background: linear-gradient(135deg, 
  hsl(25, 85%, 92%) 0%,      /* Light peach */
  hsl(30, 15%, 98%) 50%,     /* Warm off-white */
  hsl(140, 25%, 92%) 100%    /* Light sage */
);
```

**Primary CTA Button Gradient (Subtle):**
```css
background: linear-gradient(180deg,
  hsl(140, 32%, 48%) 0%,     /* Slightly lighter sage */
  hsl(140, 32%, 45%) 100%    /* Main sage */
);
```

**Card Hover Accent (Very Subtle):**
```css
background: linear-gradient(135deg,
  hsl(0, 0%, 100%) 0%,
  hsl(140, 25%, 97%) 100%    /* Lightest sage tint */
);
```

---

## Typography

### Font Families

**Primary Font (Headings & UI):** Manrope
- Professional, warm, and highly readable
- Use for: H1, H2, H3, buttons, navigation, labels
- Import: `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`

**Secondary Font (Body Text):** Inter
- Clean, accessible, excellent for data-heavy interfaces
- Use for: Body text, descriptions, table content, form inputs
- Import: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');`

**Accent Font (Special Headings/Hero):** Cormorant Garamond
- Elegant, traditional, adds warmth and sophistication
- Use sparingly for: Hero headings, welcome messages, special announcements
- Import: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');`

### Font Size Scale

```css
/* Mobile-first approach */
--text-xs: 0.75rem;      /* 12px - Small labels, captions */
--text-sm: 0.875rem;     /* 14px - Secondary text, table data */
--text-base: 1rem;       /* 16px - Body text, form inputs */
--text-lg: 1.125rem;     /* 18px - Subheadings, card titles */
--text-xl: 1.25rem;      /* 20px - Section headings */
--text-2xl: 1.5rem;      /* 24px - Page titles (mobile) */
--text-3xl: 1.875rem;    /* 30px - Page titles (tablet) */
--text-4xl: 2.25rem;     /* 36px - Hero headings (mobile) */
--text-5xl: 3rem;        /* 48px - Hero headings (tablet) */
--text-6xl: 3.75rem;     /* 60px - Hero headings (desktop) */
```

### Typography Hierarchy

**H1 (Main Page Headings):**
- Font: Manrope, weight: 700
- Size: `text-4xl sm:text-5xl lg:text-6xl`
- Color: `text-foreground`
- Line height: 1.1
- Letter spacing: -0.02em

**H2 (Section Headings):**
- Font: Manrope, weight: 600
- Size: `text-2xl sm:text-3xl lg:text-4xl`
- Color: `text-foreground`
- Line height: 1.2
- Letter spacing: -0.01em

**H3 (Subsection Headings):**
- Font: Manrope, weight: 600
- Size: `text-xl sm:text-2xl`
- Color: `text-foreground`
- Line height: 1.3

**H4 (Card Titles, Widget Headers):**
- Font: Manrope, weight: 600
- Size: `text-lg sm:text-xl`
- Color: `text-foreground`
- Line height: 1.4

**Body Text:**
- Font: Inter, weight: 400
- Size: `text-sm sm:text-base`
- Color: `text-foreground`
- Line height: 1.6

**Small Text (Labels, Captions):**
- Font: Inter, weight: 400
- Size: `text-xs sm:text-sm`
- Color: `text-muted-foreground`
- Line height: 1.5

**Hero/Welcome Text:**
- Font: Cormorant Garamond, weight: 600
- Size: `text-3xl sm:text-4xl lg:text-5xl`
- Color: `text-foreground`
- Line height: 1.2
- Use sparingly for emotional impact

---

## Component Patterns

### Shadcn/UI Components to Use

**Core Components (from `/app/frontend/src/components/ui/`):**

1. **Button** (`button.jsx`)
   - Primary actions: Use sage green (`bg-primary-500`)
   - Secondary actions: Use warm peach (`bg-secondary-500`)
   - Ghost/Outline: For tertiary actions
   - Destructive: For delete/remove actions

2. **Card** (`card.jsx`)
   - Main container for member profiles, care events, dashboard widgets
   - Always use white background (`bg-card`)
   - Add subtle shadow: `shadow-sm hover:shadow-md transition-shadow`

3. **Calendar** (`calendar.jsx`)
   - For scheduling follow-ups, viewing birthdays, event planning
   - Customize with event type colors
   - Highlight upcoming care events

4. **Badge** (`badge.jsx`)
   - Member status indicators
   - Event type labels (use event type colors)
   - Priority indicators (overdue, upcoming)

5. **Table** (`table.jsx`)
   - Member directory listing
   - Care event history
   - Use zebra striping for better readability

6. **Dialog** (`dialog.jsx`)
   - Add/edit member information
   - Create care events
   - Confirmation modals

7. **Form Components** (`form.jsx`, `input.jsx`, `label.jsx`, `select.jsx`, `textarea.jsx`)
   - All form inputs for member data, care notes
   - Use consistent spacing and validation states

8. **Tabs** (`tabs.jsx`)
   - Switch between member info, care history, family connections
   - Dashboard views (upcoming, overdue, completed)

9. **Alert** (`alert.jsx`)
   - Reminder notifications
   - System messages
   - Success/error feedback

10. **Avatar** (`avatar.jsx`)
    - Member profile pictures
    - Pastoral staff avatars
    - Use initials fallback

11. **Dropdown Menu** (`dropdown-menu.jsx`)
    - Action menus for member cards
    - Quick actions on care events

12. **Popover** (`popover.jsx`)
    - Quick view member details
    - Event preview on hover

13. **Sonner** (`sonner.jsx`)
    - Toast notifications for actions
    - Success messages, error alerts

14. **Switch** (`switch.jsx`)
    - Dark mode toggle
    - Notification preferences

15. **Separator** (`separator.jsx`)
    - Visual dividers in forms and cards

16. **Scroll Area** (`scroll-area.jsx`)
    - Long lists of members or events

17. **Skeleton** (`skeleton.jsx`)
    - Loading states for data fetching

### Custom Component Patterns

**Dashboard Widget Card:**
```jsx
<Card className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200" data-testid="dashboard-widget-card">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg font-manrope font-semibold text-foreground flex items-center gap-2">
      <Icon className="w-5 h-5 text-primary-500" />
      Widget Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Widget content */}
  </CardContent>
</Card>
```

**Member Card:**
```jsx
<Card className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary-300" data-testid="member-card">
  <CardContent className="p-4">
    <div className="flex items-start gap-4">
      <Avatar className="w-12 h-12" data-testid="member-avatar">
        <AvatarImage src={member.photo} alt={member.name} />
        <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold">
          {member.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-manrope font-semibold text-base text-foreground">{member.name}</h4>
        <p className="text-sm text-muted-foreground">{member.role}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">{member.status}</Badge>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

**Care Event Timeline Item:**
```jsx
<div className="flex gap-4 pb-6 border-l-2 border-primary-200 pl-6 ml-3 relative" data-testid="care-event-timeline-item">
  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-500 border-2 border-background"></div>
  <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
      <Badge className="text-xs" style={{backgroundColor: eventTypeColor}}>{eventType}</Badge>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
    <h5 className="font-manrope font-semibold text-sm text-foreground mb-1">{eventTitle}</h5>
    <p className="text-sm text-muted-foreground">{eventDescription}</p>
  </div>
</div>
```

**Stat Card (Dashboard Metrics):**
```jsx
<Card className="bg-card border border-border rounded-lg shadow-sm" data-testid="stat-card">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-inter text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-manrope font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Button Design System

### Button Variants & Styles

**Primary Button (Main Actions - Sage Green):**
```jsx
<Button 
  className="bg-primary-500 hover:bg-primary-600 text-white font-manrope font-semibold rounded-lg px-6 py-2.5 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
  data-testid="primary-action-button"
>
  Action Text
</Button>
```

**Secondary Button (Alternative Actions - Warm Peach):**
```jsx
<Button 
  variant="secondary"
  className="bg-secondary-500 hover:bg-secondary-600 text-white font-manrope font-semibold rounded-lg px-6 py-2.5 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
  data-testid="secondary-action-button"
>
  Action Text
</Button>
```

**Outline Button (Tertiary Actions):**
```jsx
<Button 
  variant="outline"
  className="border-2 border-primary-500 text-primary-700 hover:bg-primary-50 font-manrope font-semibold rounded-lg px-6 py-2.5 transition-all duration-200 active:scale-[0.98]"
  data-testid="outline-action-button"
>
  Action Text
</Button>
```

**Ghost Button (Subtle Actions):**
```jsx
<Button 
  variant="ghost"
  className="text-primary-700 hover:bg-primary-50 font-manrope font-medium rounded-lg px-4 py-2 transition-colors duration-200"
  data-testid="ghost-action-button"
>
  Action Text
</Button>
```

**Destructive Button (Delete/Remove):**
```jsx
<Button 
  variant="destructive"
  className="bg-error hover:bg-red-600 text-white font-manrope font-semibold rounded-lg px-6 py-2.5 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
  data-testid="destructive-action-button"
>
  Delete
</Button>
```

### Button Sizes

```css
/* Small */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
}

/* Medium (Default) */
.btn-md {
  padding: 0.625rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
}

/* Large */
.btn-lg {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
  border-radius: 0.5rem;
}
```

### Button Shape Philosophy
- **Rounded corners (8px):** Professional yet approachable
- **Subtle elevation on hover:** Provides tactile feedback
- **Scale animation on click:** Confirms interaction
- **Smooth transitions:** All state changes should be smooth (200ms)

---

## Layout & Spacing

### Grid System

**Dashboard Layout (Desktop):**
- 12-column grid with 24px gutters
- Main content area: 8-9 columns
- Sidebar (if needed): 3-4 columns
- Use CSS Grid for complex layouts

**Card Grid (Member Directory, Event Cards):**
- Mobile: 1 column
- Tablet (768px+): 2 columns
- Desktop (1024px+): 3 columns
- Large Desktop (1280px+): 4 columns
- Gap: 24px (1.5rem)

### Spacing Scale

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
--spacing-4xl: 6rem;     /* 96px */
```

### Spacing Guidelines

**Component Internal Spacing:**
- Card padding: `p-6` (24px)
- Button padding: `px-6 py-2.5` (24px horizontal, 10px vertical)
- Form field spacing: `space-y-4` (16px between fields)
- Section spacing: `space-y-8` (32px between sections)

**Layout Spacing:**
- Page margins: `px-4 sm:px-6 lg:px-8`
- Section padding: `py-12 sm:py-16 lg:py-20`
- Container max-width: `max-w-7xl mx-auto`

**Whitespace Philosophy:**
- Use 2-3x more spacing than feels initially comfortable
- Generous whitespace creates calm, reduces cognitive load
- Important for pastoral care context—avoid overwhelming users

---

## Micro-Interactions & Motion

### Animation Principles

**Timing:**
- Fast interactions: 150-200ms (hover, focus)
- Medium interactions: 250-350ms (modals, dropdowns)
- Slow interactions: 400-600ms (page transitions, complex animations)

**Easing:**
- Default: `ease-in-out` or `cubic-bezier(0.4, 0, 0.2, 1)`
- Entrances: `ease-out` or `cubic-bezier(0, 0, 0.2, 1)`
- Exits: `ease-in` or `cubic-bezier(0.4, 0, 1, 1)`

### Specific Interactions

**Button Hover:**
```css
.button {
  transition: background-color 200ms ease-in-out, box-shadow 200ms ease-in-out, transform 200ms ease-in-out;
}
.button:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.button:active {
  transform: scale(0.98);
}
```

**Card Hover:**
```css
.card {
  transition: box-shadow 200ms ease-in-out, border-color 200ms ease-in-out;
}
.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: hsl(140, 25%, 82%);
}
```

**Input Focus:**
```css
.input {
  transition: border-color 200ms ease-in-out, box-shadow 200ms ease-in-out;
}
.input:focus {
  border-color: hsl(140, 32%, 45%);
  box-shadow: 0 0 0 3px hsla(140, 32%, 45%, 0.1);
  outline: none;
}
```

**Page Transitions (Use Framer Motion):**
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
>
  {/* Page content */}
</motion.div>
```

**Toast Notifications (Sonner):**
- Slide in from top-right
- Duration: 4000ms for success, 6000ms for errors
- Smooth fade out

**Loading States:**
- Use Skeleton components for content loading
- Spinner for button loading states
- Smooth fade-in when content loads

---

## Accessibility

### Focus States

**All interactive elements MUST have visible focus indicators:**
```css
.interactive-element:focus-visible {
  outline: 2px solid hsl(140, 32%, 45%);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Color Contrast

**WCAG AA Compliance (Minimum 4.5:1 for normal text, 3:1 for large text):**
- Primary sage on white: ✓ Pass
- Secondary peach on white: ✓ Pass (use darker shades for small text)
- All text must meet contrast requirements
- Test with tools like WebAIM Contrast Checker

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order (top to bottom, left to right)
- Escape key closes modals/dialogs
- Enter/Space activates buttons
- Arrow keys navigate lists and menus

### Screen Reader Support

- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- All images must have descriptive `alt` text
- Form inputs must have associated `<label>` elements
- Use ARIA labels where necessary (`aria-label`, `aria-describedby`)
- Announce dynamic content changes with ARIA live regions

### Data-TestID Attributes

**All interactive and key informational elements MUST include `data-testid` attributes:**

**Examples:**
- Buttons: `data-testid="add-member-button"`, `data-testid="save-care-event-button"`
- Forms: `data-testid="member-form"`, `data-testid="care-event-form"`
- Inputs: `data-testid="member-name-input"`, `data-testid="event-date-input"`
- Cards: `data-testid="member-card"`, `data-testid="care-event-card"`
- Navigation: `data-testid="main-nav"`, `data-testid="sidebar-nav"`
- Modals: `data-testid="confirm-delete-modal"`
- Lists: `data-testid="member-list"`, `data-testid="event-list"`

**Naming Convention:**
- Use kebab-case
- Format: `{element-role}-{specific-identifier}-{element-type}`
- Be descriptive but concise
- Examples: `login-form-submit-button`, `member-profile-edit-button`, `dashboard-stats-card`

---

## Image Assets

### Image URLs by Category

**Hero Section / Welcome Banner:**
- Church community gathering: `https://images.unsplash.com/photo-1717201611955-f7e723802d15`
  - Description: Group of people standing in front of a church
  - Usage: Hero section, welcome page, about section

**Member/Community Images:**
- Community fellowship: `https://images.unsplash.com/photo-1751977979157-133aa5d65420`
  - Description: Older women gathering for coffee/tea
  - Usage: Community events, fellowship activities, member testimonials

- Church interior: `https://images.unsplash.com/photo-1680032149110-f7ef3c7c0a57`
  - Description: Black and white photo of people in church
  - Usage: Background images, pastoral care context, spiritual atmosphere

- Pastoral care: `https://images.pexels.com/photos/8674803/pexels-photo-8674803.jpeg`
  - Description: Pastoral care scene
  - Usage: Care event illustrations, pastoral team section

**Decorative/Background Images:**
- Soft gradient background 1: `https://images.unsplash.com/photo-1612293025896-7200cc87e540`
  - Description: Pink and white soft gradient
  - Usage: Section backgrounds, card backgrounds (subtle overlay)

- Soft gradient background 2: `https://images.unsplash.com/photo-1739885507537-ecad018aecb2`
  - Description: Pink and yellow abstract gradient
  - Usage: Hero section background, decorative elements

- Warm gradient background: `https://images.pexels.com/photos/33562122/pexels-photo-33562122.jpeg`
  - Description: Soft peach gradient
  - Usage: Login page background, welcome screens

**Icons/Symbols:**
- Church symbol: `https://images.unsplash.com/photo-1638866413606-e070e7defe21`
  - Description: Wooden block with "CHURCH" text and flowers
  - Usage: Logo area, decorative elements, empty states

### Image Usage Guidelines

**Hero Section:**
- Use gradient backgrounds with subtle overlay
- Overlay opacity: 0.85-0.95 to ensure text readability
- Text should always be readable (WCAG AA contrast)

**Member Avatars:**
- Use Avatar component with initials fallback
- Circular shape, 40px-48px for lists, 80px-120px for profiles
- Fallback background: `bg-primary-100`, text: `text-primary-700`

**Empty States:**
- Use church symbol image or custom illustrations
- Warm, inviting tone
- Include helpful text and call-to-action

**Background Images:**
- Always use as decorative, not content
- Apply subtle opacity (0.05-0.15) for backgrounds behind content
- Ensure text contrast is maintained

---

## Dashboard Specific Guidelines

### Dashboard Layout Structure

**Main Dashboard Components:**

1. **Top Navigation Bar:**
   - Logo/Church name (left)
   - Search bar (center)
   - Notifications, user profile, dark mode toggle (right)
   - Height: 64px
   - Background: `bg-card`, border-bottom: `border-border`

2. **Sidebar Navigation (Optional for larger screens):**
   - Width: 240px (collapsed: 64px)
   - Background: `bg-card`
   - Icons + labels
   - Active state: `bg-primary-50`, `text-primary-700`, left border accent

3. **Main Content Area:**
   - Padding: `p-6 lg:p-8`
   - Max-width: `max-w-7xl mx-auto`
   - Background: `bg-background`

4. **Dashboard Widgets Grid:**
   - Use CSS Grid or Flexbox
   - Gap: `gap-6`
   - Responsive: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)

### Widget Types

**Stat Cards (Metrics):**
- Member count, upcoming birthdays, overdue follow-ups
- Large number display with icon
- Trend indicator (optional)
- Click to view details

**Upcoming Events List:**
- Scrollable list of next 5-7 events
- Event type badge, date, member name
- Quick action buttons (mark complete, reschedule)

**Calendar Widget:**
- Month view with event dots
- Color-coded by event type
- Click date to see details

**Recent Activity Feed:**
- Timeline of recent care events
- Avatar, event type, timestamp
- Scrollable, max 10 items

**Overdue Follow-ups Alert:**
- Prominent warning styling
- Count of overdue items
- Quick link to filtered view

### Dashboard Interactions

**Widget Customization:**
- Drag-and-drop to reorder (use `@dnd-kit/core`)
- Show/hide widgets via settings
- Resize widgets (optional, advanced)

**Real-time Updates:**
- Use polling or WebSocket for live data
- Smooth transitions when data updates
- Toast notification for important changes

**Quick Actions:**
- Floating action button (FAB) for "Add Care Event"
- Position: bottom-right, `bg-primary-500`, circular
- Hover: scale up slightly, show tooltip

---

## Form Design Guidelines

### Form Layout

**Vertical Form (Default):**
- Labels above inputs
- Full-width inputs on mobile
- Max-width: 600px for single-column forms
- Spacing: `space-y-4` between fields

**Horizontal Form (Compact):**
- Labels left, inputs right (desktop only)
- Use for settings, filters
- Label width: 30%, input width: 70%

### Form Components

**Text Input:**
```jsx
<div className="space-y-2">
  <Label htmlFor="member-name" className="text-sm font-medium text-foreground">
    Member Name
  </Label>
  <Input
    id="member-name"
    type="text"
    placeholder="Enter member name"
    className="w-full"
    data-testid="member-name-input"
  />
</div>
```

**Select Dropdown:**
```jsx
<div className="space-y-2">
  <Label htmlFor="event-type" className="text-sm font-medium text-foreground">
    Event Type
  </Label>
  <Select data-testid="event-type-select">
    <SelectTrigger id="event-type" className="w-full">
      <SelectValue placeholder="Select event type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="birthday">Birthday</SelectItem>
      <SelectItem value="childbirth">Childbirth</SelectItem>
      <SelectItem value="grief">Grief/Loss</SelectItem>
      {/* More options */}
    </SelectContent>
  </Select>
</div>
```

**Textarea (Care Notes):**
```jsx
<div className="space-y-2">
  <Label htmlFor="care-notes" className="text-sm font-medium text-foreground">
    Care Notes
  </Label>
  <Textarea
    id="care-notes"
    placeholder="Enter care notes..."
    rows={4}
    className="w-full resize-none"
    data-testid="care-notes-textarea"
  />
</div>
```

**Date Picker (Use Calendar component):**
```jsx
<div className="space-y-2">
  <Label className="text-sm font-medium text-foreground">
    Event Date
  </Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal"
        data-testid="event-date-picker-trigger"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        initialFocus
        data-testid="event-date-calendar"
      />
    </PopoverContent>
  </Popover>
</div>
```

### Form Validation

**Validation States:**
- Error: Red border, error message below input
- Success: Green border (optional, use sparingly)
- Warning: Yellow border, warning message

**Error Message:**
```jsx
{error && (
  <p className="text-sm text-error mt-1 flex items-center gap-1" data-testid="form-error-message">
    <AlertCircle className="w-4 h-4" />
    {error}
  </p>
)}
```

**Form Submission:**
- Disable button during submission
- Show loading spinner in button
- Success: Toast notification + redirect or reset form
- Error: Toast notification + highlight error fields

---

## Table Design

### Member Directory Table

**Table Structure:**
```jsx
<Table data-testid="member-directory-table">
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Last Contact</TableHead>
      <TableHead>Upcoming Events</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {members.map((member) => (
      <TableRow key={member.id} className="hover:bg-muted/50 transition-colors" data-testid={`member-row-${member.id}`}>
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={member.photo} alt={member.name} />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <span>{member.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="secondary">{member.status}</Badge>
        </TableCell>
        <TableCell className="text-muted-foreground">{member.lastContact}</TableCell>
        <TableCell>{member.upcomingEvents}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" data-testid={`member-actions-${member.id}`}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Add Care Event</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Table Styling:**
- Zebra striping: Optional, use `even:bg-muted/30` on TableRow
- Hover state: `hover:bg-muted/50`
- Sticky header: `sticky top-0 bg-card z-10` on TableHeader
- Responsive: Horizontal scroll on mobile, use ScrollArea component

---

## Dark Mode Implementation

### Dark Mode Toggle

**Toggle Component:**
```jsx
import { Moon, Sun } from 'lucide-react';
import { Switch } from './components/ui/switch';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex items-center gap-2" data-testid="dark-mode-toggle">
      <Sun className="w-4 h-4 text-muted-foreground" />
      <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
      <Moon className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}
```

### Dark Mode Color Adjustments

**Ensure proper contrast in dark mode:**
- Test all text colors against dark backgrounds
- Reduce shadow intensity (use lighter shadows)
- Adjust border colors to be more visible
- Event type colors may need slight adjustments for dark mode

**Dark Mode Specific Overrides:**
```css
.dark .card-hover {
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.05);
}

.dark .gradient-hero {
  background: linear-gradient(135deg, 
    hsl(30, 8%, 12%) 0%,
    hsl(30, 8%, 8%) 50%,
    hsl(140, 15%, 10%) 100%
  );
}
```

---

## Notification System

### Notification Types

**Toast Notifications (Sonner):**
- Success: Green icon, "Success!" title
- Error: Red icon, "Error" title
- Warning: Yellow icon, "Warning" title
- Info: Blue icon, "Info" title

**Usage:**
```jsx
import { toast } from 'sonner';

// Success
toast.success('Care event added successfully!');

// Error
toast.error('Failed to save member information.');

// Warning
toast.warning('This member has an overdue follow-up.');

// Info
toast.info('Reminder: 3 birthdays this week.');
```

**In-App Notifications (Bell Icon):**
- Badge count on bell icon
- Dropdown list of recent notifications
- Mark as read functionality
- Link to notification source

**Reminder Notifications:**
- Prominent alert banner for overdue follow-ups
- Dismissible but persistent until action taken
- Use Alert component with warning variant

---

## Additional Libraries & Integrations

### Recommended Libraries

**Framer Motion (Animations):**
- Already mentioned for page transitions
- Use for complex animations, gesture interactions
- Installation: `npm install framer-motion`

**Recharts (Data Visualization):**
- For dashboard charts (member growth, event trends)
- Installation: `npm install recharts`
- Use warm color palette for charts

**React Hook Form (Form Management):**
- Simplifies form validation and state management
- Installation: `npm install react-hook-form`
- Integrate with Zod for schema validation

**Date-fns (Date Formatting):**
- Format dates consistently
- Installation: `npm install date-fns`
- Use for calendar, event dates, timestamps

**Lucide React (Icons):**
- Already available (used by shadcn)
- Consistent icon set throughout app
- Examples: Calendar, Users, Heart, Bell, Settings, etc.

### Chart Design (Recharts)

**Example: Member Growth Line Chart**
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={memberGrowthData}>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 88%)" />
    <XAxis dataKey="month" stroke="hsl(30, 6%, 45%)" />
    <YAxis stroke="hsl(30, 6%, 45%)" />
    <Tooltip 
      contentStyle={{ 
        backgroundColor: 'hsl(0, 0%, 100%)', 
        border: '1px solid hsl(30, 10%, 88%)',
        borderRadius: '8px'
      }} 
    />
    <Line 
      type="monotone" 
      dataKey="members" 
      stroke="hsl(140, 32%, 45%)" 
      strokeWidth={2}
      dot={{ fill: 'hsl(140, 32%, 45%)', r: 4 }}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ResponsiveContainer>
```

**Chart Color Palette:**
- Primary line/bar: `hsl(140, 32%, 45%)` (sage green)
- Secondary line/bar: `hsl(25, 88%, 62%)` (warm peach)
- Tertiary line/bar: `hsl(180, 42%, 45%)` (soft teal)
- Grid lines: `hsl(30, 10%, 88%)` (light warm gray)

---

## Responsive Design Breakpoints

### Breakpoints

```css
/* Mobile (default) */
/* 0px - 639px */

/* Small (sm) */
@media (min-width: 640px) { }

/* Medium (md) */
@media (min-width: 768px) { }

/* Large (lg) */
@media (min-width: 1024px) { }

/* Extra Large (xl) */
@media (min-width: 1280px) { }

/* 2X Large (2xl) */
@media (min-width: 1536px) { }
```

### Responsive Patterns

**Navigation:**
- Mobile: Hamburger menu (Sheet component)
- Tablet+: Horizontal navigation or sidebar

**Dashboard Widgets:**
- Mobile: 1 column, stacked
- Tablet: 2 columns
- Desktop: 3-4 columns

**Forms:**
- Mobile: Full-width, single column
- Desktop: Max-width 600px, centered or left-aligned

**Tables:**
- Mobile: Horizontal scroll (ScrollArea) or card view
- Desktop: Full table view

**Typography:**
- Scale down heading sizes on mobile
- Maintain readability (minimum 16px body text)

---

## Performance Considerations

### Image Optimization

- Use WebP format where possible
- Lazy load images below the fold
- Use appropriate image sizes (don't load 4K images for thumbnails)
- Implement skeleton loaders while images load

### Code Splitting

- Lazy load routes with React.lazy()
- Split large components into separate chunks
- Load heavy libraries (charts, animations) only when needed

### Data Fetching

- Implement pagination for large lists (members, events)
- Use infinite scroll or "Load More" button
- Cache frequently accessed data
- Debounce search inputs (300ms delay)

---

## Common Mistakes to Avoid

### ❌ Don't:
- Use dark purple, dark blue, dark pink, dark red, dark orange in any gradient
- Mix multiple gradient directions in same section
- Use gradients on small UI elements
- Skip responsive font sizing
- Forget hover and focus states
- Center-align all text (disrupts natural reading flow)
- Apply universal transitions (e.g., `transition: all`)
- Use emoji icons (🤖💡🎯) - use FontAwesome or Lucide React instead
- Make backgrounds too dark by default - understand context first

### ✅ Do:
- Keep gradients for hero sections and major CTAs only (max 20% viewport)
- Use solid colors for content and reading areas
- Maintain consistent spacing using the spacing system
- Test on mobile devices with touch interactions
- Include accessibility features (focus states, contrast, ARIA labels)
- Use pill/rounded button style for primary actions
- Add `data-testid` attributes to all interactive elements
- Use warm, compassionate colors appropriate for church context
- Provide generous whitespace for calm, uncluttered interface

---

## Color Usage Priority

1. **White backgrounds** for all cards and content areas
2. **Sage green (primary)** for main actions, active states, focus rings
3. **Warm peach (secondary)** for secondary actions, accents, highlights
4. **Soft teal (accent)** for informational elements, links
5. **Event type colors** for badges, timeline markers, calendar events
6. **Gradient** only for hero sections (max 20% of viewport)
7. **Warm neutrals** for text, borders, backgrounds

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Set up color system (CSS custom properties in index.css)
- [ ] Import Google Fonts (Manrope, Inter, Cormorant Garamond)
- [ ] Configure Tailwind with custom colors and spacing
- [ ] Set up dark mode toggle functionality
- [ ] Implement base layout structure (nav, main, footer)

### Phase 2: Core Components
- [ ] Customize shadcn Button component with brand colors
- [ ] Style Card component with proper shadows and hover states
- [ ] Configure Calendar component with event type colors
- [ ] Set up Badge component variants for different statuses
- [ ] Implement Avatar component with fallback initials
- [ ] Configure Form components (Input, Select, Textarea, Label)

### Phase 3: Dashboard
- [ ] Build dashboard layout (grid, widgets)
- [ ] Create stat cards with icons and metrics
- [ ] Implement upcoming events widget
- [ ] Add calendar widget with color-coded events
- [ ] Build recent activity feed
- [ ] Create overdue follow-ups alert

### Phase 4: Member Management
- [ ] Build member directory table
- [ ] Create member card component
- [ ] Implement member profile page
- [ ] Add member form (add/edit)
- [ ] Build family connections view

### Phase 5: Care Events
- [ ] Create care event form
- [ ] Build care event timeline component
- [ ] Implement event type badges with colors
- [ ] Add event filtering and search
- [ ] Create event detail view

### Phase 6: Polish
- [ ] Add micro-interactions (hover, focus, transitions)
- [ ] Implement toast notifications (Sonner)
- [ ] Add loading states (Skeleton components)
- [ ] Test dark mode across all pages
- [ ] Verify accessibility (keyboard nav, screen readers, contrast)
- [ ] Add `data-testid` attributes to all interactive elements
- [ ] Test responsive design on multiple devices
- [ ] Optimize images and performance

---

## Final Notes for Implementation Agent

### Key Principles to Remember:

1. **Warmth & Compassion First:** Every design decision should reflect the caring nature of pastoral ministry. Use warm colors, generous spacing, and gentle interactions.

2. **Clarity Over Complexity:** Pastoral staff need to quickly access information and take action. Prioritize clear information hierarchy and intuitive navigation.

3. **Accessibility is Non-Negotiable:** Church communities are diverse. Ensure the system is usable by people of all ages and abilities.

4. **Consistency Builds Trust:** Use the design system consistently across all pages and components. Consistency creates familiarity and trust.

5. **Performance Matters:** Pastoral staff are often busy. Fast load times and smooth interactions respect their time.

6. **Test with Real Users:** If possible, get feedback from pastoral staff during development. Their insights are invaluable.

### Component Priority Order:

1. Authentication (Login page)
2. Dashboard (main overview)
3. Member directory (list and detail views)
4. Care event tracking (add, view, edit)
5. Calendar view
6. Notifications and reminders
7. Settings and preferences

### Design System Files to Create:

1. `/app/frontend/src/styles/design-tokens.css` - CSS custom properties for colors, spacing, typography
2. `/app/frontend/src/styles/global.css` - Global styles, resets, utility classes
3. `/app/frontend/src/components/ui/` - Already exists, customize as needed
4. `/app/frontend/src/components/layout/` - Layout components (Header, Sidebar, Footer)
5. `/app/frontend/src/components/dashboard/` - Dashboard-specific components (widgets, charts)

### Testing Checklist:

- [ ] All interactive elements have `data-testid` attributes
- [ ] Keyboard navigation works throughout the app
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA standards
- [ ] Dark mode works without visual issues
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Forms validate correctly and show helpful error messages
- [ ] Loading states display during data fetching
- [ ] Toast notifications appear for user actions
- [ ] Hover and focus states are visible and smooth

---

## General UI/UX Design Guidelines (MUST FOLLOW)

### Critical Rules:

1. **Transitions:**
   - **NEVER** apply universal transitions (e.g., `transition: all`)
   - This breaks transforms and causes performance issues
   - Always add transitions for specific properties: `transition: background-color 200ms, box-shadow 200ms, border-color 200ms`
   - Exclude transforms from transition properties

2. **Text Alignment:**
   - **NEVER** center-align the app container (e.g., `.App { text-align: center; }`)
   - This disrupts natural reading flow
   - Use left-aligned text for body content
   - Center alignment only for specific elements (headings, hero text, CTAs)

3. **Icons:**
   - **NEVER** use emoji characters for icons (🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇)
   - Always use **Lucide React** (already installed) or **FontAwesome CDN**
   - Examples: `<Calendar />`, `<Users />`, `<Heart />`, `<Bell />`

4. **Gradient Restrictions (CRITICAL):**
   - **NEVER** use dark/saturated gradient combos (purple/pink, blue-500 to purple-600, purple-500 to pink-500, green-500 to blue-500, red to pink)
   - **NEVER** use dark gradients for logo, testimonial, footer
   - **NEVER** let gradients cover more than 20% of viewport
   - **NEVER** apply gradients to text-heavy content or reading areas
   - **NEVER** use gradients on small UI elements (<100px width)
   - **NEVER** stack multiple gradient layers in same viewport
   - **ENFORCEMENT:** If gradient area exceeds 20% of viewport OR affects readability, use solid colors

5. **Gradient Usage (Where Allowed):**
   - Section backgrounds (not content backgrounds)
   - Hero section header content (dark to light to dark color)
   - Decorative overlays and accent elements only
   - Hero section with 2-3 mild colors
   - Gradients can be horizontal, vertical, or diagonal

6. **Color Considerations:**
   - For AI chat, voice applications: **DO NOT** use purple color
   - Use colors like light green, ocean blue, peach orange instead
   - For this pastoral care system: Use warm sage green, peach, and teal

7. **Micro-Animations:**
   - Every interaction needs micro-animations
   - Hover states, transitions, entrance animations
   - Static designs feel dead - add life with motion
   - Use Framer Motion for complex animations

8. **Spacing:**
   - Use 2-3x more spacing than feels comfortable
   - Cramped designs look cheap and unprofessional
   - Generous whitespace creates calm and clarity

9. **Texture & Details:**
   - Subtle grain textures, noise overlays
   - Custom cursors (optional)
   - Selection states
   - Loading animations
   - These details separate good from extraordinary

10. **Design Tokens:**
    - Before generating UI, infer visual style from problem statement
    - Set global design tokens immediately (primary, secondary, background, foreground, ring, state colors)
    - Don't rely on library defaults
    - Don't make background dark by default - understand context first
    - For this project: Warm, compassionate, light-first design

11. **Component Reuse:**
    - Prioritize using pre-existing components from `src/components/ui/`
    - Create new components that match existing style and conventions
    - Examine existing components before creating new ones
    - **IMPORTANT:** Do not use HTML-based components (dropdown, calendar, toast)
    - **MUST** always use `/app/frontend/src/components/ui/` as primary components

12. **Export Conventions:**
    - Components MUST use named exports: `export const ComponentName = ...`
    - Pages MUST use default exports: `export default function PageName() {...}`

13. **Toasts:**
    - Use `sonner` for toasts
    - Sonner component located in `/app/frontend/src/components/ui/sonner.jsx`

14. **Visual Richness:**
    - Use 2-4 color gradients (where allowed)
    - Subtle textures/noise overlays
    - CSS-based noise to avoid flat visuals
    - Balance is key - not too much, not too little

15. **Human-Made Feel:**
    - Result should feel human-made, not AI-generated
    - Visually appealing and converting
    - Easy for AI agents to implement
    - Good contrast, balanced font sizes, proper gradients
    - Sufficient whitespace, thoughtful motion and hierarchy
    - Avoid overuse of elements

16. **Mobile-First Responsive:**
    - Design must be mobile-first responsive
    - Test on multiple screen sizes
    - Use Tailwind responsive prefixes (sm:, md:, lg:, xl:)

17. **Color Theory:**
    - Dark colors look good independently without gradients
    - Light colors (pastel ocean green, light pastel pink, blue, gray) with gradients work well
    - Muted colors with gradients are effective
    - Don't make generic centered layouts, simplistic gradients, uniform styling

18. **Calendar Requirement:**
    - If calendar is required, always use shadcn calendar component
    - Customize with event type colors
    - Ensure accessibility and keyboard navigation

---

## Summary

This design system creates a warm, compassionate, and professional interface for the Church Pastoral Care Tracking System. The color palette (sage green, warm peach, soft teal) reflects healing, compassion, and trust. Typography (Manrope, Inter, Cormorant Garamond) balances professionalism with warmth. Generous spacing and gentle micro-interactions create a calm, uncluttered experience. All components are built on shadcn/ui primitives, ensuring consistency and accessibility. Dark mode support provides flexibility for different user preferences. The system prioritizes clarity, ease of use, and emotional resonance—essential for pastoral care work.

**Remember:** This is not just a tracking system—it's a tool to support meaningful human connections and spiritual care. Every design decision should honor that purpose.

---

**Design Guidelines Document Path:** `/app/design_guidelines.md`

**Ready for Implementation Agent to Begin Building the Application.**
