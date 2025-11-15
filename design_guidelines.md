# FaithTracker Mobile-First Design System Guidelines

## Design Philosophy

FaithTracker is a compassionate, professional pastoral care management system. The design must feel **warm, trustworthy, and approachable** while maintaining the **efficiency and clarity** needed for multi-campus church operations. Every interaction should feel **delightful, intuitive, and respectful** of the sacred nature of pastoral care work.

**Core Design Attributes:**
- **Compassionate**: Soft, warm colors that convey care and support
- **Professional**: Clean layouts with clear hierarchy and organization
- **Trustworthy**: Consistent patterns, reliable interactions, accessible design
- **Efficient**: Mobile-first, touch-optimized, fast interactions
- **Respectful**: Thoughtful micro-interactions, appropriate motion, dignified presentation

---

## GRADIENT RESTRICTION RULE

**NEVER use dark/saturated gradient combos** (e.g., purple/pink, blue-500 to purple-600) on any UI element.
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

```css
/* Teal Primary - Calm, trustworthy, spiritual */
--primary: 174 94% 39%;           /* hsl(174, 94%, 39%) - #14b8a6 */
--primary-light: 174 94% 50%;     /* Lighter teal for hover states */
--primary-dark: 174 94% 30%;      /* Darker teal for active states */
--primary-foreground: 0 0% 100%;  /* White text on teal */

/* Amber Secondary - Warm, welcoming, hopeful */
--secondary: 38 92% 50%;          /* hsl(38, 92%, 50%) - #f59e0b */
--secondary-light: 38 92% 60%;    /* Lighter amber for hover */
--secondary-dark: 38 92% 40%;     /* Darker amber for active */
--secondary-foreground: 0 0% 100%; /* White text on amber */

/* Soft Pink - Care reminders, urgent follow-ups */
--accent-pink: 346 84% 61%;       /* hsl(346, 84%, 61%) - #f472b6 */
--accent-pink-light: 346 84% 70%; /* Lighter pink for backgrounds */

/* Soft Purple - Special events, celebrations */
--accent-purple: 271 91% 75%;     /* hsl(271, 91%, 75%) - #c084fc */
--accent-purple-light: 271 91% 85%; /* Lighter purple for backgrounds */

/* Sage Green - Growth, spiritual health */
--accent-sage: 142 40% 55%;       /* hsl(142, 40%, 55%) - #66b584 */
--accent-sage-light: 142 40% 65%; /* Lighter sage for backgrounds */
```

### Neutral Palette

```css
/* Backgrounds - Clean, soft whites */
--background: 0 0% 100%;          /* Pure white for cards */
--background-soft: 0 0% 98%;      /* Soft white for page backgrounds */
--foreground: 0 0% 10%;           /* Near-black for primary text */

/* Card & Surface */
--card: 0 0% 100%;                /* White cards */
--card-foreground: 0 0% 10%;      /* Dark text on cards */

/* Muted & Subtle */
--muted: 0 0% 96%;                /* Light gray for subtle backgrounds */
--muted-foreground: 0 0% 45%;     /* Medium gray for secondary text */

/* Borders & Inputs */
--border: 0 0% 90%;               /* Light gray borders */
--input: 0 0% 90%;                /* Input field borders */
--ring: 174 94% 39%;              /* Teal focus rings */
```

### Semantic Colors

```css
/* Success - Completed tasks, positive outcomes */
--success: 142 76% 36%;           /* Green */
--success-foreground: 0 0% 100%;

/* Warning - Attention needed, upcoming deadlines */
--warning: 38 92% 50%;            /* Amber (same as secondary) */
--warning-foreground: 0 0% 100%;

/* Destructive - Errors, critical issues */
--destructive: 0 84% 60%;         /* Red */
--destructive-foreground: 0 0% 100%;

/* Info - Informational messages */
--info: 199 89% 48%;              /* Blue */
--info-foreground: 0 0% 100%;
```

### Background Gradients (Use Sparingly - Max 20% of Viewport)

```css
/* Soft Pastoral Gradient - For hero sections or empty states only */
background: linear-gradient(135deg, 
  hsl(174, 94%, 97%) 0%,    /* Very light teal */
  hsl(45, 93%, 97%) 50%,    /* Very light warm yellow */
  hsl(174, 94%, 97%) 100%   /* Back to light teal */
);

/* Subtle Card Accent Gradient - For large feature cards only */
background: linear-gradient(to right, 
  hsl(174, 94%, 98%) 0%,    /* Almost white teal */
  hsl(0, 0%, 100%) 100%     /* Pure white */
);
```

### Color Usage Priority

1. **White backgrounds** for all cards and content areas (primary)
2. **Teal (primary)** for primary actions, active states, key information
3. **Amber (secondary)** for secondary actions, highlights, warm accents
4. **Soft pastels** (pink, purple, sage) for category differentiation and status indicators
5. **Gradient** only for hero sections, empty states, or decorative elements (max 20% of viewport)

### Color Contrast Requirements

- **Body text on white**: Minimum 4.5:1 contrast ratio (use --foreground: hsl(0, 0%, 10%))
- **Secondary text**: Minimum 4.5:1 contrast ratio (use --muted-foreground: hsl(0, 0%, 45%))
- **Interactive elements**: Minimum 3:1 contrast ratio for borders and focus states
- **Touch targets**: Minimum 44x44px with clear visual boundaries

---

## Typography

### Font Families

```css
/* Headings - Elegant, trustworthy serif */
--font-heading: 'Playfair Display', serif;

/* Body - Clean, readable sans-serif */
--font-body: 'Inter', sans-serif;

/* Monospace - For IDs, codes, technical data */
--font-mono: 'IBM Plex Mono', monospace;
```

**Import Statement (already in index.css):**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
```

### Type Scale (Mobile-First)

```css
/* H1 - Page Titles */
.text-h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;        /* 32px mobile */
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
}

@media (min-width: 640px) {
  .text-h1 { font-size: 2.5rem; }  /* 40px tablet */
}

@media (min-width: 1024px) {
  .text-h1 { font-size: 3rem; }    /* 48px desktop */
}

/* H2 - Section Titles */
.text-h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;      /* 24px mobile */
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
}

@media (min-width: 640px) {
  .text-h2 { font-size: 1.875rem; } /* 30px tablet */
}

@media (min-width: 1024px) {
  .text-h2 { font-size: 2.25rem; }  /* 36px desktop */
}

/* H3 - Card Titles, Subsection Headers */
.text-h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;     /* 20px mobile */
  line-height: 1.4;
  font-weight: 600;
}

@media (min-width: 640px) {
  .text-h3 { font-size: 1.5rem; }   /* 24px tablet+ */
}

/* H4 - Small Headers, List Titles */
.text-h4 {
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;    /* 18px mobile */
  line-height: 1.5;
  font-weight: 600;
}

/* Body Large - Introductory text, important messages */
.text-body-lg {
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;    /* 18px */
  line-height: 1.6;
  font-weight: 400;
}

/* Body - Default text */
.text-body {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;        /* 16px */
  line-height: 1.6;
  font-weight: 400;
}

/* Body Small - Secondary information */
.text-body-sm {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;    /* 14px */
  line-height: 1.5;
  font-weight: 400;
}

/* Caption - Timestamps, metadata */
.text-caption {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;     /* 12px */
  line-height: 1.4;
  font-weight: 400;
  color: hsl(0, 0%, 45%);
}

/* Label - Form labels, badges */
.text-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;    /* 14px */
  line-height: 1.4;
  font-weight: 500;
  letter-spacing: 0.01em;
}
```

### Typography Best Practices

- **Never center-align body text** - Left-align for natural reading flow
- **Use Playfair Display for all headings** (H1-H3) to establish hierarchy and elegance
- **Use Inter for body text, labels, and UI elements** for clarity and readability
- **Maintain 1.5-1.6 line-height for body text** for comfortable reading on mobile
- **Use font-weight 600-700 for headings**, 400-500 for body text
- **Limit line length to 60-75 characters** for optimal readability

---

## Spacing System

### Base Spacing Scale (Tailwind-based)

```css
/* Mobile-first spacing - generous for touch targets */
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

### Component Spacing Guidelines

**Cards:**
- Padding: `p-4` (16px) on mobile, `p-6` (24px) on tablet+
- Gap between cards: `gap-4` (16px) on mobile, `gap-6` (24px) on tablet+
- Margin bottom: `mb-4` (16px) on mobile, `mb-6` (24px) on tablet+

**Lists:**
- Item padding: `py-3 px-4` (12px vertical, 16px horizontal) on mobile
- Gap between items: `space-y-2` (8px) on mobile
- Section spacing: `mb-6` (24px) between sections

**Forms:**
- Label margin: `mb-2` (8px)
- Input padding: `px-4 py-3` (16px horizontal, 12px vertical) for touch-friendly targets
- Field spacing: `space-y-4` (16px) between fields
- Button spacing: `mt-6` (24px) above submit buttons

**Page Layout:**
- Container padding: `px-4` (16px) on mobile, `px-6` (24px) on tablet, `px-8` (32px) on desktop
- Section spacing: `space-y-6` (24px) on mobile, `space-y-8` (32px) on tablet+
- Top/bottom page padding: `py-6` (24px) on mobile, `py-8` (32px) on tablet+

---

## Component Library

### Shadcn/UI Components to Use

All components are located in `/app/frontend/src/components/ui/`

**Core Components:**
- `button.jsx` - Primary, secondary, ghost, outline variants
- `card.jsx` - Main container for content blocks
- `badge.jsx` - Status indicators, categories, counts
- `avatar.jsx` - Member profile pictures
- `dialog.jsx` - Modals for forms and confirmations
- `sheet.jsx` - Mobile-friendly side panels and drawers
- `tabs.jsx` - Dashboard task tabs, member detail sections
- `calendar.jsx` - Date selection for events and follow-ups
- `select.jsx` - Dropdowns for filters and forms
- `input.jsx` - Text inputs for forms
- `textarea.jsx` - Multi-line text inputs
- `checkbox.jsx` - Multi-select options
- `switch.jsx` - Toggle settings
- `table.jsx` - Data tables for member lists
- `dropdown-menu.jsx` - Action menus
- `popover.jsx` - Contextual information
- `tooltip.jsx` - Helpful hints on hover/long-press
- `alert.jsx` - Informational messages
- `skeleton.jsx` - Loading states
- `progress.jsx` - Task completion indicators
- `separator.jsx` - Visual dividers
- `scroll-area.jsx` - Scrollable content areas
- `sonner.jsx` - Toast notifications (use for success/error messages)

### Button Design System

**Button Variants:**

```jsx
// Primary - Main actions (Save, Submit, Create)
<Button 
  variant="default" 
  size="lg"
  className="w-full sm:w-auto"
  data-testid="primary-action-button"
>
  Save Member
</Button>

// Secondary - Alternative actions (Cancel, Back)
<Button 
  variant="secondary" 
  size="lg"
  className="w-full sm:w-auto"
  data-testid="secondary-action-button"
>
  Cancel
</Button>

// Ghost - Tertiary actions (View Details, Edit)
<Button 
  variant="ghost" 
  size="default"
  data-testid="ghost-action-button"
>
  View Details
</Button>

// Outline - Filter buttons, toggles
<Button 
  variant="outline" 
  size="default"
  data-testid="outline-action-button"
>
  Filter
</Button>

// Destructive - Delete, remove actions
<Button 
  variant="destructive" 
  size="default"
  data-testid="destructive-action-button"
>
  Delete
</Button>
```

**Button Styling:**
- **Shape**: Rounded corners (`rounded-lg` - 12px radius) for friendly, approachable feel
- **Size**: 
  - `sm`: `h-9 px-3` (36px height - minimum for touch)
  - `default`: `h-10 px-4` (40px height)
  - `lg`: `h-12 px-6` (48px height - recommended for mobile primary actions)
- **Motion**: 
  - Hover: `hover:scale-[1.02]` (subtle scale up)
  - Active: `active:scale-[0.98]` (press down effect)
  - Transition: `transition-all duration-200 ease-in-out`
- **Touch Target**: Minimum 44x44px (use `lg` size for mobile primary actions)

**Button States:**
```css
/* Hover State */
.button:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2);
}

/* Active/Pressed State */
.button:active {
  transform: scale(0.98);
}

/* Focus State (Accessibility) */
.button:focus-visible {
  outline: 2px solid hsl(174, 94%, 39%);
  outline-offset: 2px;
}

/* Disabled State */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Card Design System

**Card Variants:**

```jsx
// Default Card - White background, subtle shadow
<Card className="card-border-left-teal" data-testid="member-card">
  <CardHeader>
    <CardTitle>Member Name</CardTitle>
    <CardDescription>Last contact: 2 days ago</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>

// Status Cards with Left Border
<Card className="card-border-left-amber" data-testid="birthday-card">
  {/* Birthday reminder card */}
</Card>

<Card className="card-border-left-pink" data-testid="followup-card">
  {/* Follow-up reminder card */}
</Card>

<Card className="card-border-left-purple" data-testid="event-card">
  {/* Special event card */}
</Card>
```

**Card Styling:**
```css
/* Base Card */
.card {
  background: white;
  border-radius: 0.75rem;  /* 12px */
  border: 1px solid hsl(0, 0%, 90%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Card Hover Effect */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.15);
}

/* Card with Left Border (Status Indicator) */
.card-border-left-teal {
  border-left: 4px solid hsl(174, 94%, 39%);
}

.card-border-left-amber {
  border-left: 4px solid hsl(38, 92%, 50%);
}

.card-border-left-pink {
  border-left: 4px solid hsl(346, 84%, 61%);
}

.card-border-left-purple {
  border-left: 4px solid hsl(271, 91%, 65%);
}
```

### Badge Design System

**Badge Variants for Status:**

```jsx
// Active Member
<Badge variant="default" className="bg-teal-500" data-testid="status-badge-active">
  Active
</Badge>

// Birthday This Week
<Badge variant="secondary" className="bg-amber-500" data-testid="status-badge-birthday">
  Birthday
</Badge>

// Needs Follow-up
<Badge variant="destructive" className="bg-pink-500" data-testid="status-badge-followup">
  Follow-up
</Badge>

// At Risk
<Badge variant="outline" className="border-red-500 text-red-600" data-testid="status-badge-risk">
  At Risk
</Badge>

// Disconnected
<Badge variant="outline" className="border-gray-400 text-gray-600" data-testid="status-badge-disconnected">
  Disconnected
</Badge>
```

### Form Components

**Input Fields:**
```jsx
<div className="space-y-2">
  <Label htmlFor="member-name" data-testid="member-name-label">
    Member Name
  </Label>
  <Input 
    id="member-name"
    type="text"
    placeholder="Enter member name"
    className="h-12"  // 48px for touch-friendly
    data-testid="member-name-input"
  />
</div>
```

**Select Dropdowns:**
```jsx
<div className="space-y-2">
  <Label htmlFor="campus" data-testid="campus-label">
    Campus
  </Label>
  <Select data-testid="campus-select">
    <SelectTrigger className="h-12">
      <SelectValue placeholder="Select campus" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="main">Main Campus</SelectItem>
      <SelectItem value="north">North Campus</SelectItem>
      <SelectItem value="south">South Campus</SelectItem>
    </SelectContent>
  </Select>
</div>
```

**Calendar (Use Shadcn Calendar):**
```jsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
  data-testid="date-picker-calendar"
/>
```

---

## Layout Patterns

### Mobile-First Grid System

**Container:**
```jsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  {/* Page content */}
</div>
```

**Responsive Grid:**
```jsx
// Single column on mobile, 2 columns on tablet, 3 columns on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

**Dashboard Task Cards:**
```jsx
// Full width on mobile, 2 columns on tablet+
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Card className="card-border-left-teal">
    <CardHeader>
      <CardTitle>Today's Tasks</CardTitle>
      <CardDescription>3 items</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Task list */}
    </CardContent>
  </Card>
  
  <Card className="card-border-left-amber">
    <CardHeader>
      <CardTitle>Birthdays</CardTitle>
      <CardDescription>2 this week</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Birthday list */}
    </CardContent>
  </Card>
</div>
```

### Page Layout Structure

**Standard Page Layout:**
```jsx
<div className="min-h-screen bg-gradient-to-br from-teal-50/30 via-amber-50/20 to-teal-50/30">
  {/* Navigation */}
  <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
    {/* Mobile: Bottom tab bar or hamburger menu */}
    {/* Desktop: Top navigation bar */}
  </nav>
  
  {/* Main Content */}
  <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    {/* Page Header */}
    <div className="mb-6 sm:mb-8">
      <h1 className="text-h1 mb-2">Page Title</h1>
      <p className="text-body text-muted-foreground">Page description</p>
    </div>
    
    {/* Page Content */}
    <div className="space-y-6 sm:space-y-8">
      {/* Content sections */}
    </div>
  </main>
</div>
```

### Dashboard Layout

**Tab-Based Dashboard (Mobile-First):**
```jsx
<Tabs defaultValue="today" className="w-full" data-testid="dashboard-tabs">
  <TabsList className="w-full grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 h-auto gap-2 bg-transparent p-0">
    <TabsTrigger value="today" className="h-12" data-testid="tab-today">
      Today
    </TabsTrigger>
    <TabsTrigger value="birthday" className="h-12" data-testid="tab-birthday">
      Birthday
    </TabsTrigger>
    <TabsTrigger value="followup" className="h-12" data-testid="tab-followup">
      Follow-up
    </TabsTrigger>
    <TabsTrigger value="aid" className="h-12" data-testid="tab-aid">
      Aid
    </TabsTrigger>
    <TabsTrigger value="risk" className="h-12" data-testid="tab-risk">
      At Risk
    </TabsTrigger>
    <TabsTrigger value="disconnected" className="h-12" data-testid="tab-disconnected">
      Disconnected
    </TabsTrigger>
    <TabsTrigger value="upcoming" className="h-12" data-testid="tab-upcoming">
      Upcoming
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="today" className="mt-6">
    {/* Today's tasks */}
  </TabsContent>
  
  {/* Other tab contents */}
</Tabs>
```

### Member List Layout

**Card-Based List (Mobile-First):**
```jsx
<div className="space-y-4">
  {/* Search & Filter Bar */}
  <div className="flex flex-col sm:flex-row gap-4">
    <Input 
      type="search"
      placeholder="Search members..."
      className="h-12 flex-1"
      data-testid="member-search-input"
    />
    <Button variant="outline" className="h-12" data-testid="filter-button">
      <FilterIcon className="mr-2 h-4 w-4" />
      Filter
    </Button>
  </div>
  
  {/* Member Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {members.map(member => (
      <Card key={member.id} className="card-border-left-teal" data-testid={`member-card-${member.id}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar data-testid={`member-avatar-${member.id}`}>
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-h4 truncate">{member.name}</CardTitle>
              <CardDescription className="text-caption">{member.campus}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-body-sm">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-body-sm">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" data-testid={`view-member-${member.id}`}>
            View Details
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
</div>
```

### Member Detail Layout

**Profile with Timeline:**
```jsx
<div className="space-y-6">
  {/* Profile Header */}
  <Card data-testid="member-profile-header">
    <CardContent className="pt-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <Avatar className="h-24 w-24" data-testid="member-profile-avatar">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="text-2xl">{member.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-h2 mb-2">{member.name}</h1>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
            <Badge variant="default" data-testid="member-status-badge">Active</Badge>
            <Badge variant="secondary" data-testid="member-campus-badge">{member.campus}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-sm">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span>{member.email}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="default" data-testid="edit-member-button">
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
  
  {/* Tabs for Care Events, Follow-ups, Financial Aid */}
  <Tabs defaultValue="events" className="w-full" data-testid="member-detail-tabs">
    <TabsList className="w-full grid grid-cols-3 h-auto gap-2">
      <TabsTrigger value="events" className="h-12" data-testid="tab-care-events">
        Care Events
      </TabsTrigger>
      <TabsTrigger value="followups" className="h-12" data-testid="tab-followups">
        Follow-ups
      </TabsTrigger>
      <TabsTrigger value="aid" className="h-12" data-testid="tab-financial-aid">
        Financial Aid
      </TabsTrigger>
    </TabsList>
    
    <TabsContent value="events" className="mt-6">
      {/* Timeline of care events */}
    </TabsContent>
    
    {/* Other tab contents */}
  </Tabs>
</div>
```

---

## Timeline Design Pattern

### Vertical Timeline for Care Events

**Timeline Structure:**
```jsx
<div className="space-y-4" data-testid="care-events-timeline">
  {events.map((event, index) => (
    <div key={event.id} className="relative pl-8 pb-8 last:pb-0" data-testid={`timeline-event-${event.id}`}>
      {/* Timeline Line */}
      {index !== events.length - 1 && (
        <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-200" />
      )}
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white ${
        event.type === 'visit' ? 'bg-teal-500' :
        event.type === 'call' ? 'bg-amber-500' :
        event.type === 'message' ? 'bg-purple-500' :
        'bg-gray-400'
      }`} />
      
      {/* Event Card */}
      <Card className="hover:shadow-md transition-shadow" data-testid={`event-card-${event.id}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-h4">{event.title}</CardTitle>
              <CardDescription className="text-caption mt-1">
                {formatDate(event.date)} • {event.pastor}
              </CardDescription>
            </div>
            <Badge variant="outline" data-testid={`event-type-badge-${event.id}`}>
              {event.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-muted-foreground">{event.notes}</p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="ghost" size="sm" data-testid={`edit-event-${event.id}`}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" data-testid={`delete-event-${event.id}`}>
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  ))}
</div>
```

**Timeline Styling:**
```css
/* Timeline Container */
.timeline-container {
  position: relative;
  padding-left: 2rem;
}

/* Timeline Line */
.timeline-line {
  position: absolute;
  left: 0.5rem;
  top: 2rem;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, 
    hsl(174, 94%, 39%) 0%,
    hsl(0, 0%, 90%) 100%
  );
}

/* Timeline Dot */
.timeline-dot {
  position: absolute;
  left: 0;
  top: 0.25rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px hsl(174, 94%, 39%);
  z-index: 10;
}

/* Timeline Event Card */
.timeline-event {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Navigation Patterns

### Mobile Navigation (Bottom Tab Bar)

**Bottom Tab Bar (Recommended for Mobile):**
```jsx
<nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 sm:hidden" data-testid="mobile-bottom-nav">
  <div className="grid grid-cols-5 h-16">
    <button 
      className="flex flex-col items-center justify-center gap-1 text-teal-600"
      data-testid="nav-dashboard"
    >
      <HomeIcon className="h-5 w-5" />
      <span className="text-xs">Dashboard</span>
    </button>
    
    <button 
      className="flex flex-col items-center justify-center gap-1 text-gray-600"
      data-testid="nav-members"
    >
      <UsersIcon className="h-5 w-5" />
      <span className="text-xs">Members</span>
    </button>
    
    <button 
      className="flex flex-col items-center justify-center gap-1 text-gray-600"
      data-testid="nav-calendar"
    >
      <CalendarIcon className="h-5 w-5" />
      <span className="text-xs">Calendar</span>
    </button>
    
    <button 
      className="flex flex-col items-center justify-center gap-1 text-gray-600"
      data-testid="nav-analytics"
    >
      <ChartIcon className="h-5 w-5" />
      <span className="text-xs">Analytics</span>
    </button>
    
    <button 
      className="flex flex-col items-center justify-center gap-1 text-gray-600"
      data-testid="nav-more"
    >
      <MoreIcon className="h-5 w-5" />
      <span className="text-xs">More</span>
    </button>
  </div>
</nav>
```

### Desktop Navigation (Sidebar)

**Sidebar Navigation (Desktop):**
```jsx
<aside className="hidden sm:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0" data-testid="desktop-sidebar">
  <div className="p-6 border-b border-gray-200">
    <h2 className="text-h3">FaithTracker</h2>
  </div>
  
  <nav className="flex-1 p-4 space-y-2">
    <Button 
      variant="ghost" 
      className="w-full justify-start h-12"
      data-testid="sidebar-dashboard"
    >
      <HomeIcon className="mr-3 h-5 w-5" />
      Dashboard
    </Button>
    
    <Button 
      variant="ghost" 
      className="w-full justify-start h-12"
      data-testid="sidebar-members"
    >
      <UsersIcon className="mr-3 h-5 w-5" />
      Members
    </Button>
    
    <Button 
      variant="ghost" 
      className="w-full justify-start h-12"
      data-testid="sidebar-calendar"
    >
      <CalendarIcon className="mr-3 h-5 w-5" />
      Calendar
    </Button>
    
    <Button 
      variant="ghost" 
      className="w-full justify-start h-12"
      data-testid="sidebar-analytics"
    >
      <ChartIcon className="mr-3 h-5 w-5" />
      Analytics
    </Button>
    
    <Separator className="my-4" />
    
    <Button 
      variant="ghost" 
      className="w-full justify-start h-12"
      data-testid="sidebar-settings"
    >
      <SettingsIcon className="mr-3 h-5 w-5" />
      Settings
    </Button>
  </nav>
</aside>
```

---

## Micro-Interactions & Motion

### Animation Principles

**Timing:**
- **Fast interactions**: 150-200ms (button hover, focus states)
- **Medium interactions**: 250-350ms (card hover, drawer open)
- **Slow interactions**: 400-500ms (page transitions, modal open)

**Easing:**
- **Ease-out**: For elements entering the screen (feels snappy)
- **Ease-in**: For elements leaving the screen (feels natural)
- **Ease-in-out**: For elements moving within the screen (feels smooth)

### Button Interactions

```css
/* Button Hover */
.button {
  transition: all 0.2s ease-out;
}

.button:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2);
}

/* Button Active/Press */
.button:active {
  transform: scale(0.98);
  transition: all 0.1s ease-in;
}

/* Button Focus (Keyboard Navigation) */
.button:focus-visible {
  outline: 2px solid hsl(174, 94%, 39%);
  outline-offset: 2px;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### Card Interactions

```css
/* Card Hover */
.card {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.15);
}

/* Card Tap (Mobile) */
.card:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(20, 184, 166, 0.1);
}
```

### Page Transitions

```css
/* Fade In on Page Load */
.page-enter {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In from Right (for modals/drawers) */
.drawer-enter {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

### Loading States

```jsx
// Skeleton Loading
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-20 w-full" />
  </CardContent>
</Card>

// Spinner Loading
<div className="flex items-center justify-center p-8">
  <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent" />
</div>
```

### Toast Notifications (Sonner)

```jsx
import { toast } from "sonner";

// Success Toast
toast.success("Member saved successfully!", {
  description: "John Doe's profile has been updated.",
  duration: 3000,
});

// Error Toast
toast.error("Failed to save member", {
  description: "Please check your connection and try again.",
  duration: 5000,
});

// Info Toast
toast.info("Follow-up reminder", {
  description: "You have 3 follow-ups due today.",
  duration: 4000,
});
```

---

## Data States

### Empty States

**Empty State Pattern:**
```jsx
<Card className="text-center py-12" data-testid="empty-state">
  <CardContent>
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center">
        <UsersIcon className="h-12 w-12 text-teal-500" />
      </div>
      <div>
        <h3 className="text-h3 mb-2">No members found</h3>
        <p className="text-body text-muted-foreground mb-6">
          Get started by adding your first member to the system.
        </p>
      </div>
      <Button variant="default" size="lg" data-testid="add-first-member-button">
        <PlusIcon className="mr-2 h-5 w-5" />
        Add First Member
      </Button>
    </div>
  </CardContent>
</Card>
```

### Loading States

**Skeleton Loading for Lists:**
```jsx
<div className="space-y-4" data-testid="loading-skeleton">
  {[1, 2, 3, 4, 5].map(i => (
    <Card key={i}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  ))}
</div>
```

### Error States

**Error State Pattern:**
```jsx
<Card className="text-center py-12 border-red-200 bg-red-50" data-testid="error-state">
  <CardContent>
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
        <AlertCircleIcon className="h-12 w-12 text-red-500" />
      </div>
      <div>
        <h3 className="text-h3 mb-2 text-red-900">Failed to load members</h3>
        <p className="text-body text-red-700 mb-6">
          We couldn't load the member list. Please check your connection and try again.
        </p>
      </div>
      <Button variant="default" size="lg" onClick={retry} data-testid="retry-button">
        <RefreshIcon className="mr-2 h-5 w-5" />
        Try Again
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## Accessibility Guidelines

### Focus Management

**Keyboard Navigation:**
- All interactive elements must be keyboard accessible (Tab, Enter, Space, Arrow keys)
- Focus order must follow logical reading order (top to bottom, left to right)
- Focus indicators must be clearly visible (2px outline with 2px offset)
- Skip links for keyboard users to bypass navigation

**Focus Styles:**
```css
/* Global Focus Style */
*:focus-visible {
  outline: 2px solid hsl(174, 94%, 39%);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Button Focus */
.button:focus-visible {
  outline: 2px solid hsl(174, 94%, 39%);
  outline-offset: 2px;
}

/* Input Focus */
.input:focus-visible {
  outline: 2px solid hsl(174, 94%, 39%);
  outline-offset: 0;
  border-color: hsl(174, 94%, 39%);
}
```

### Touch Targets

**Minimum Touch Target Size:**
- **44x44px minimum** for all interactive elements (buttons, links, form controls)
- **48x48px recommended** for primary actions on mobile
- **8px minimum spacing** between adjacent touch targets

**Touch Target Implementation:**
```jsx
// Primary Button (48px height)
<Button size="lg" className="h-12 min-w-[120px]">
  Save
</Button>

// Icon Button (44px minimum)
<Button size="icon" className="h-11 w-11">
  <EditIcon className="h-5 w-5" />
</Button>

// List Item (48px height for easy tapping)
<button className="w-full h-12 px-4 flex items-center gap-3 hover:bg-gray-50">
  <span>List Item</span>
</button>
```

### Screen Reader Support

**ARIA Labels:**
```jsx
// Icon-only buttons
<Button 
  variant="ghost" 
  size="icon"
  aria-label="Edit member"
  data-testid="edit-member-button"
>
  <EditIcon className="h-5 w-5" />
</Button>

// Search input
<Input 
  type="search"
  placeholder="Search members..."
  aria-label="Search members"
  data-testid="member-search-input"
/>

// Status badge
<Badge aria-label="Member status: Active">
  Active
</Badge>
```

**Semantic HTML:**
- Use proper heading hierarchy (H1 → H2 → H3)
- Use `<nav>` for navigation sections
- Use `<main>` for main content area
- Use `<article>` for independent content blocks
- Use `<section>` for thematic groupings

### Color Contrast

**WCAG AA Compliance:**
- **Body text**: Minimum 4.5:1 contrast ratio
- **Large text (18px+)**: Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio for borders and focus states

**Contrast Ratios:**
- Primary text on white: `hsl(0, 0%, 10%)` = 18.5:1 ✓
- Secondary text on white: `hsl(0, 0%, 45%)` = 7.2:1 ✓
- Teal button text on teal background: White on `hsl(174, 94%, 39%)` = 4.8:1 ✓
- Amber button text on amber background: White on `hsl(38, 92%, 50%)` = 4.2:1 ✓

---

## Bilingual Support (EN/ID)

### Language Switching

**Language Toggle:**
```jsx
<Select value={language} onValueChange={setLanguage} data-testid="language-selector">
  <SelectTrigger className="w-32">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="en">English</SelectItem>
    <SelectItem value="id">Indonesia</SelectItem>
  </SelectContent>
</Select>
```

### Text Length Considerations

**Design for Variable Text Length:**
- Indonesian text is typically 10-20% longer than English
- Use flexible layouts that accommodate text expansion
- Avoid fixed-width containers for text content
- Test all UI elements with both languages

**Example:**
```jsx
// Flexible button width
<Button className="min-w-[120px] w-auto px-6">
  {t('save')} {/* "Save" or "Simpan" */}
</Button>

// Truncate long text with tooltip
<div className="truncate max-w-full" title={member.name}>
  {member.name}
</div>
```

---

## Image Assets

### Image URLs and Usage

**Community/Congregation Images:**
Use for empty states, onboarding, or hero sections to create warmth and connection.

1. **Prayer Gathering** (Diverse congregation)
   - URL: `https://images.unsplash.com/photo-1760367121608-79219f1c9d2a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBjb21tdW5pdHklMjBwZW9wbGUlMjBkaXZlcnNlJTIwY29uZ3JlZ2F0aW9uJTIwZ2F0aGVyaW5nfGVufDB8fHx8MTc2MzIyMjc2NHww&ixlib=rb-4.1.0&q=85`
   - Use: Empty state for member list, onboarding screens
   - Description: Crowd of people in prayer, diverse congregation

2. **Church Building with Congregation**
   - URL: `https://images.unsplash.com/photo-1717201611909-0f75ee9b0b1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxjaHVyY2glMjBjb21tdW5pdHklMjBwZW9wbGUlMjBkaXZlcnNlJTIwY29uZ3JlZ2F0aW9uJTIwZ2F0aGVyaW5nfGVufDB8fHx8MTc2MzIyMjc2NHww&ixlib=rb-4.1.0&q=85`
   - Use: Campus selection, multi-campus dashboard
   - Description: Group of people standing in front of church building

3. **Community Gathering (Pexels)**
   - URL: `https://images.pexels.com/photos/8815215/pexels-photo-8815215.jpeg`
   - Use: Analytics page, community statistics
   - Description: Church community gathering

**Pastoral Care/Support Images:**
Use for care event illustrations, follow-up reminders, or compassionate messaging.

4. **Helping Hands (Reaching Out)**
   - URL: `https://images.pexels.com/photos/4672717/pexels-photo-4672717.jpeg`
   - Use: Follow-up reminders, care event cards, empty state for care timeline
   - Description: Two hands reaching toward each other, symbolizing support

5. **Caregiver Support**
   - URL: `https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg`
   - Use: Financial aid section, pastoral care dashboard
   - Description: Caregiver helping elderly person, compassionate care

6. **Supportive Hands**
   - URL: `https://images.pexels.com/photos/8430304/pexels-photo-8430304.jpeg`
   - Use: Care event detail pages, follow-up success messages
   - Description: Hands offering support and comfort

### Image Implementation

**Responsive Images:**
```jsx
<img 
  src="https://images.unsplash.com/photo-1760367121608-79219f1c9d2a?w=800"
  srcSet="
    https://images.unsplash.com/photo-1760367121608-79219f1c9d2a?w=400 400w,
    https://images.unsplash.com/photo-1760367121608-79219f1c9d2a?w=800 800w,
    https://images.unsplash.com/photo-1760367121608-79219f1c9d2a?w=1200 1200w
  "
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  alt="Diverse congregation in prayer"
  className="w-full h-auto rounded-lg"
  loading="lazy"
/>
```

**Empty State with Image:**
```jsx
<Card className="text-center py-12" data-testid="empty-state-members">
  <CardContent>
    <div className="flex flex-col items-center gap-6">
      <img 
        src="https://images.unsplash.com/photo-1760367121608-79219f1c9d2a?w=400"
        alt="Church community"
        className="w-64 h-48 object-cover rounded-lg shadow-md"
        loading="lazy"
      />
      <div>
        <h3 className="text-h3 mb-2">No members yet</h3>
        <p className="text-body text-muted-foreground mb-6">
          Start building your church community by adding members.
        </p>
      </div>
      <Button variant="default" size="lg" data-testid="add-first-member-button">
        <PlusIcon className="mr-2 h-5 w-5" />
        Add First Member
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## Analytics & Charts

### Chart Library: Recharts

**Installation (if not already installed):**
```bash
npm install recharts
```

**Chart Color Palette:**
```javascript
const chartColors = {
  primary: 'hsl(174, 94%, 39%)',      // Teal
  secondary: 'hsl(38, 92%, 50%)',     // Amber
  accent1: 'hsl(346, 84%, 61%)',      // Pink
  accent2: 'hsl(271, 91%, 75%)',      // Purple
  accent3: 'hsl(142, 40%, 55%)',      // Sage
  neutral: 'hsl(0, 0%, 60%)',         // Gray
};
```

**Bar Chart Example:**
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<Card data-testid="analytics-chart-card">
  <CardHeader>
    <CardTitle>Member Growth by Campus</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={campusData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
        <XAxis 
          dataKey="campus" 
          tick={{ fill: 'hsl(0, 0%, 45%)' }}
          tickLine={{ stroke: 'hsl(0, 0%, 90%)' }}
        />
        <YAxis 
          tick={{ fill: 'hsl(0, 0%, 45%)' }}
          tickLine={{ stroke: 'hsl(0, 0%, 90%)' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(0, 0%, 90%)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Bar dataKey="members" fill="hsl(174, 94%, 39%)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

**Line Chart Example:**
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<Card data-testid="care-events-trend-card">
  <CardHeader>
    <CardTitle>Care Events Trend</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
        <XAxis 
          dataKey="month" 
          tick={{ fill: 'hsl(0, 0%, 45%)' }}
        />
        <YAxis 
          tick={{ fill: 'hsl(0, 0%, 45%)' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(0, 0%, 90%)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="visits" 
          stroke="hsl(174, 94%, 39%)" 
          strokeWidth={2}
          dot={{ fill: 'hsl(174, 94%, 39%)', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="calls" 
          stroke="hsl(38, 92%, 50%)" 
          strokeWidth={2}
          dot={{ fill: 'hsl(38, 92%, 50%)', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

---

## Testing Attributes (data-testid)

### Naming Convention

**Format:** `{element-type}-{specific-identifier}-{action}`

**Examples:**
- `data-testid="member-card-123"` - Member card with ID 123
- `data-testid="edit-member-button"` - Button to edit member
- `data-testid="member-search-input"` - Search input for members
- `data-testid="tab-followup"` - Follow-up tab
- `data-testid="status-badge-active"` - Active status badge

### Required data-testid Attributes

**All interactive elements must have data-testid:**
- Buttons: `data-testid="action-button"`
- Links: `data-testid="navigation-link"`
- Form inputs: `data-testid="field-input"`
- Dropdowns: `data-testid="select-dropdown"`
- Tabs: `data-testid="tab-name"`
- Cards: `data-testid="card-type"`
- Modals: `data-testid="modal-name"`
- Navigation items: `data-testid="nav-item"`

**Key informational elements:**
- Error messages: `data-testid="error-message"`
- Success messages: `data-testid="success-message"`
- Loading indicators: `data-testid="loading-spinner"`
- Empty states: `data-testid="empty-state"`
- Status badges: `data-testid="status-badge"`

---

## Common Mistakes to Avoid

### ❌ Don't:
- Use dark purple, dark blue, dark pink, dark red, dark orange in any gradient
- Mix multiple gradient directions in same section
- Use gradients on small UI elements (<100px)
- Apply gradients to text-heavy content or reading areas
- Skip responsive font sizing (always use mobile-first approach)
- Ignore touch target sizes (minimum 44x44px)
- Forget hover and focus states for accessibility
- Center-align body text (disrupts natural reading flow)
- Use universal transitions like `transition: all` (breaks transforms)
- Use emoji characters for icons (use FontAwesome or lucide-react instead)
- Create fixed-width containers for bilingual text
- Skip data-testid attributes on interactive elements

### ✅ Do:
- Keep gradients for hero sections and major CTAs only (max 20% of viewport)
- Use solid colors for content and reading areas
- Maintain consistent spacing using the spacing system (generous for mobile)
- Test on mobile devices with touch interactions
- Include accessibility features (focus states, WCAG AA contrast, ARIA labels)
- Use pill/rounded button style for friendly, approachable feel
- Use Playfair Display for headings, Inter for body text
- Implement skeleton loading states for better perceived performance
- Use Shadcn/UI components as primary component library
- Add data-testid to all interactive and key informational elements
- Test with both English and Indonesian languages
- Use Sonner for toast notifications
- Implement proper keyboard navigation and focus management

---

## Instructions to Main Agent

### Implementation Priority

1. **Start with Mobile-First Layout**
   - Implement responsive container with proper padding
   - Use single-column layouts on mobile, expand to multi-column on tablet+
   - Ensure all touch targets are minimum 44x44px

2. **Implement Color System**
   - Update CSS custom properties in `index.css` with the color palette
   - Apply teal primary color to primary actions and active states
   - Use amber secondary color for secondary actions and warm accents
   - Use soft pastels (pink, purple, sage) for status indicators and categories
   - Keep white backgrounds for all cards and content areas
   - Use gradients sparingly (max 20% of viewport) for hero sections or empty states only

3. **Apply Typography**
   - Use Playfair Display for all headings (H1-H3)
   - Use Inter for body text, labels, and UI elements
   - Implement responsive font sizes (mobile-first)
   - Never center-align body text

4. **Build with Shadcn/UI Components**
   - Use existing components from `/app/frontend/src/components/ui/`
   - Customize with Tailwind classes for brand colors and spacing
   - Ensure all components have proper data-testid attributes

5. **Implement Navigation**
   - Bottom tab bar for mobile (5 main sections)
   - Sidebar for desktop (collapsible)
   - Ensure active states are clearly visible

6. **Add Micro-Interactions**
   - Button hover: scale(1.02) + shadow
   - Button active: scale(0.98)
   - Card hover: translateY(-2px) + shadow
   - Page transitions: fadeIn animation
   - Loading states: skeleton or spinner

7. **Implement Data States**
   - Empty states with images and clear CTAs
   - Loading states with skeletons
   - Error states with retry buttons
   - Success states with toast notifications (Sonner)

8. **Ensure Accessibility**
   - All interactive elements keyboard accessible
   - Focus indicators clearly visible (2px teal outline)
   - ARIA labels for icon-only buttons
   - Semantic HTML structure
   - WCAG AA contrast compliance

9. **Add Bilingual Support**
   - Language toggle in settings/header
   - Flexible layouts for text expansion
   - Test with both English and Indonesian

10. **Test on Mobile Devices**
    - Touch targets minimum 44x44px
    - Smooth scrolling and interactions
    - Fast loading with skeleton states
    - Responsive images with lazy loading

### Key Files to Modify

1. **`/app/frontend/src/index.css`**
   - Update CSS custom properties with new color palette
   - Add typography classes
   - Add animation keyframes
   - Add utility classes for card borders

2. **`/app/frontend/src/App.css`**
   - Remove any universal transitions
   - Remove center-align styles
   - Add component-specific transitions

3. **Page Components** (in `/app/frontend/src/pages/`)
   - `Dashboard.js` - Tab-based task hub
   - `MembersList.js` - Card-based member list with search/filter
   - `MemberDetail.js` - Profile with timeline
   - `Analytics.js` - Charts with Recharts
   - `FinancialAid.js` - Aid management
   - `AdminDashboard.js` - User/campus management
   - `Settings.js` - Settings page with language toggle

4. **Navigation Components**
   - Create `MobileBottomNav.js` for mobile bottom tab bar
   - Create `DesktopSidebar.js` for desktop sidebar
   - Implement responsive navigation switching

### Design Tokens Reference

```javascript
// Use these tokens throughout the application
const designTokens = {
  colors: {
    primary: 'hsl(174, 94%, 39%)',
    secondary: 'hsl(38, 92%, 50%)',
    accentPink: 'hsl(346, 84%, 61%)',
    accentPurple: 'hsl(271, 91%, 75%)',
    accentSage: 'hsl(142, 40%, 55%)',
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(0, 0%, 10%)',
    muted: 'hsl(0, 0%, 96%)',
    mutedForeground: 'hsl(0, 0%, 45%)',
    border: 'hsl(0, 0%, 90%)',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(20, 184, 166, 0.15)',
    lg: '0 8px 24px rgba(20, 184, 166, 0.2)',
  },
  transitions: {
    fast: '150ms ease-out',
    medium: '250ms ease-out',
    slow: '400ms ease-out',
  },
};
```

---

## General UI/UX Design Guidelines

### Transition Rules
- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text

### Icon Usage
- NEVER use AI assistant Emoji characters like `🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇` etc for icons
- Always use **FontAwesome CDN** or **lucide-react** library (already installed in package.json)

### Gradient Restrictions
- NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element
- Prohibited gradients: blue-500 to purple-600, purple-500 to pink-500, green-500 to blue-500, red to pink etc
- NEVER use dark gradients for logo, testimonial, footer etc
- NEVER let gradients cover more than 20% of the viewport
- NEVER apply gradients to text-heavy content or reading areas
- NEVER use gradients on small UI elements (<100px width)
- NEVER stack multiple gradient layers in the same viewport

### Gradient Enforcement
- If gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

### Gradient Usage (Allowed)
- Section backgrounds (not content backgrounds)
- Hero section header content (e.g., dark to light to dark color)
- Decorative overlays and accent elements only
- Hero section with 2-3 mild colors
- Gradients can be horizontal, vertical, or diagonal

### Design Principles
- Every interaction needs micro-animations - hover states, transitions, and entrance animations
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap
- Subtle grain textures, noise overlays, and loading animations separate good from extraordinary
- Before generating UI, infer the visual style from the problem statement and set global design tokens
- Don't make the background dark as a default step, always understand problem first and define colors accordingly

### Component Best Practices
- Prioritize using pre-existing components from `src/components/ui` when applicable
- Create new components that match the style and conventions of existing components
- Examine existing components to understand the project's component patterns
- **IMPORTANT**: Do not use HTML-based components like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/` only as primary components

### Export Conventions
- Components MUST use named exports (`export const ComponentName = ...`)
- Pages MUST use default exports (`export default function PageName() {...}`)

### Toasts
- Use `sonner` for toasts
- Sonner component is located in `/app/frontend/src/components/ui/sonner.jsx`

### Visual Enhancements
- Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals

---

## Summary

This design system creates a **compassionate, professional, and delightful** mobile-first experience for FaithTracker. The warm teal and amber color palette conveys trust and care, while the Playfair Display headings add elegance and dignity. The generous spacing, touch-friendly interactions, and thoughtful micro-animations make the app feel polished and premium. The card-based layouts, clear typography hierarchy, and comprehensive accessibility features ensure the app is easy to use for pastors and administrators across all devices and contexts.

**Key Differentiators:**
- **Warm, compassionate color palette** (teal + amber + soft pastels) instead of generic corporate blues
- **Elegant serif headings** (Playfair Display) for trustworthy, dignified feel
- **Mobile-first with generous touch targets** (48px for primary actions)
- **Card-based layouts with left border status indicators** for quick visual scanning
- **Timeline design for care events** with vertical dots and expandable cards
- **Bottom tab bar navigation** for mobile efficiency
- **Comprehensive empty states with images** for warmth and guidance
- **Bilingual support** with flexible layouts for text expansion
- **Accessibility-first** with WCAG AA compliance and keyboard navigation

This design system balances **professional efficiency** with **human warmth**, creating an application that feels both capable and caring—perfectly suited for the sacred work of pastoral care.
