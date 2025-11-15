# FaithTracker Mobile-First UI/UX Redesign Plan

## 1) Objectives
- Deliver a compassionate, professional, mobile-first UI using the binding design guidelines (teal/amber palette, Playfair Display headings, generous spacing).
- Unify layouts with Shadcn/UI components, touch-friendly targets (≥44x44px), explicit loading/empty/error states, and accessible focus/contrast.
- Optimize navigation for mobile (bottom tab bar), keep desktop efficient (sidebar), maintain bilingual support (EN/ID).
- Minimize regressions by incremental page-by-page rollout with testing at the end of every phase.
- POC: Not needed (UI/UX redesign of existing, working app). Proceed directly to Phase 1 implementation.

## 2) Implementation Steps (Phases)

### Phase 1: Foundation & Navigation (Status: In Progress)
Scope
- Apply design tokens (colors, typography, spacing, motion) in `src/index.css` per design_guidelines.md
- Global layout wrapper (container paddings, background), remove any center-aligned app-level styles
- Add Sonner Toaster; enforce data-testid on interactive elements across base components
- Implement Mobile Bottom Tab Bar (Dashboard, Members, Calendar, Analytics, More); Desktop Sidebar
- Add global Skeleton/Empty/Error primitives; confirm font imports (Playfair Display, Inter)
- Quick compile check: `esbuild src/ --loader:.js=jsx --bundle --outfile=/dev/null`
Testing
- Call testing agent (frontend only): verify navigation, tokens, fonts, base states render without console errors
User Stories (min 5)
1. As a mobile user, I can switch tabs via a bottom bar with large touch targets.
2. As a keyboard user, I can see clear focus states on all buttons/links.
3. As a user, I see graceful skeletons while content loads.
4. As a user, I get friendly empty/error states with clear CTAs.
5. As a bilingual user, the header and nav fit both EN and ID labels without truncation.

### Phase 2: Dashboard & Members (Status: Not Started)
Scope
- Redesign Dashboard.js using Shadcn Tabs (Today, Birthday, Follow-up, Aid, At Risk, Disconnected, Upcoming)
- Convert dashboard task items to status-card pattern with left-border accents; add skeleton/empty/error
- MembersList.js: card-based list, mobile search/filter bar, truncate long text, ensure no horizontal scroll
- Add toasts for actions (mark complete/ignore) and local state updates
Testing
- Call testing agent (both): load `/api/dashboard/reminders`, verify tabs, interactions, state updates
User Stories (min 5)
1. As a user, I can scan Today tasks in a single column on mobile without sideways scrolling.
2. As a user, I can filter/search members with a large input and see instant results.
3. As a user, I can quickly mark a task complete and get a confirmation toast.
4. As a user, I can switch dashboard tabs and see skeletons before data appears.
5. As a user, I can distinguish task types via subtle colored left borders.

### Phase 3: Member Detail & Timeline (Status: Not Started)
Scope
- MemberDetail.js: responsive header (avatar, name, status badges), contact rows, edit button
- Vertical timeline for care events with colored dots, card hover/tap micro-interactions
- Tabs for Care Events, Follow-ups, Financial Aid; confirm mobile spacing and touch targets
- Ensure overdue/ignored/completed visibility with badges; leverage local state + reload when needed
Testing
- Call testing agent (both): open a member, validate header responsiveness, timeline rendering, actions
User Stories (min 5)
1. As a user, I can read member name and status without the layout overflowing on small screens.
2. As a user, I can scroll a vertical care timeline with clear chronological markers.
3. As a user, I can edit a care event in a modal and see a success toast.
4. As a user, I can switch between Events/Follow-ups/Aid tabs on mobile with large triggers.
5. As a user, I can visually recognize overdue follow-ups with clear badges.

### Phase 4: Analytics, Financial Aid, Settings, Admin (Status: Not Started)
Scope
- Analytics.js: apply teal/amber chart palette, responsive containers, readable axes/legends
- FinancialAid.js: mobile-friendly forms (label spacing, 48px inputs), clear schedules/recurrence chips
- Settings.js: add language toggle using Select; ensure sections readable on mobile
- AdminDashboard.js: mobile table patterns (stacked rows/cards) with essential columns visible
Testing
- Call testing agent (both): validate chart rendering, form submission, language toggling, admin actions
User Stories (min 5)
1. As a user, I can view charts that fit my mobile screen without clipped labels.
2. As a user, I can create a one-time or recurring aid on mobile without zooming.
3. As a user, I can change the app language and see labels update immediately.
4. As an admin, I can manage users/campuses from a mobile-optimized list.
5. As a user, I can understand disabled/readonly states via clear visual cues.

### Phase 5: Polish & Performance (Status: Not Started)
Scope
- Bundle analysis with webpack-bundle-analyzer; code-split heavy routes; tree-shake icons/utilities
- Optimize images (responsive srcset, lazy loading), reduce motion for prefers-reduced-motion
- A11y audit: contrast, semantics, focus order; ensure all interactive elements have unique data-testid
- Verify EN/ID coverage, truncation with tooltips where needed
Testing
- Call testing agent (frontend only): performance sanity runs, accessibility checks, regression sweep
User Stories (min 5)
1. As a user, I experience faster initial load and smooth tab switches.
2. As a user with motion sensitivity, animations reduce automatically.
3. As a user, I never encounter horizontal scrolling on core pages.
4. As a tester, I can target any action by stable data-testid values.
5. As a bilingual user, long Indonesian labels do not break layouts.

## 3) Next Actions (Immediate)
- Implement Phase 1 tokens/typography in `src/index.css` and verify fonts.
- Build `MobileBottomNav` and `DesktopSidebar`; integrate into `Layout`/`App`.
- Add global `Toaster` and shared Skeleton/Empty/Error components.
- Run compile check (`esbuild`) and open preview: https://member-pulse-3.preview.emergentagent.com
- Call testing agent for Phase 1 (frontend only) and fix any issues found.

## 4) Success Criteria
- Visual: Teal/amber palette and Playfair headings applied consistently; no horizontal scroll on mobile.
- Usability: All primary actions ≥44x44px; clear hover/focus/active/disabled states; bottom nav on mobile.
- Reliability: Each phase passes testing agent runs; zero console errors on core pages.
- Accessibility: WCAG AA contrast; keyboard focus visible; ARIA for icon-only buttons.
- Internationalization: EN/ID layouts render without truncation; language switch stable.
- Performance: Bundle size reduced where feasible; responsive images and lazy loading implemented.
