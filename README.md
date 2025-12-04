# FaithTracker Pastoral Care System

**FaithTracker** is a next-generation pastoral care management system built with cutting-edge web technologies. Designed for churches of all sizes, it helps pastors and staff track birthdays, hospital visits, grief support, financial aid, and more - all from one powerful, real-time dashboard.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Platform](https://img.shields.io/badge/platform-Web%20%2B%20Mobile-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19-61dafb)
![HTTP/3](https://img.shields.io/badge/HTTP%2F3-QUIC-orange)

---

## Breakthrough Features

FaithTracker implements several industry-leading technologies that provide an exceptional user experience:

### Real-Time Team Activity (Server-Sent Events)

See what your team is doing **live**. When a colleague completes a task or creates an event, it instantly appears in your dashboard.

- **Live activity feed** with user avatars and action icons
- **Instant notifications** without page refresh
- **Auto-reconnect** with exponential backoff
- **No polling** - true server-push technology

### View Transitions API

Smooth, native-like page transitions that make the app feel like a high-end mobile application.

- **Fade and slide animations** between pages
- **Respects user preferences** (reduced motion)
- **Automatic fallback** on older browsers
- **Zero configuration** - works out of the box

### Smart Link Prefetching

Navigation feels instant because data is already loaded before you click.

- **Hover-to-prefetch** - Data loads while you hover over links
- **TanStack Query integration** - Intelligent cache management
- **Route-aware prefetching** - Knows what data each page needs
- **Bandwidth efficient** - Cancels prefetch if you move away

### Offline-First Sync Queue

Work without internet. Operations queue locally and sync automatically when you're back online.

- **IndexedDB persistence** - Survives page refresh and browser restart
- **Automatic sync** when connection restored
- **Conflict resolution** with retry logic
- **Visual indicator** showing pending operations

### Progressive Image Loading

Member photos load fast with optimized sizes for every context.

- **3 sizes generated** - Thumbnail (100px), medium (300px), large (600px)
- **Progressive JPEG** - Images appear immediately, sharpen as they load
- **Lazy loading** - Only loads images in viewport
- **85% quality** - Crisp images at minimal file size

---

## What Can FaithTracker Do?

### Pastoral Care Features

| Feature | Description |
|---------|-------------|
| **Birthday Tracking** | Automatic reminders with age calculation |
| **Grief Support** | 6-stage follow-up system (7 days → 1 year) |
| **Hospital Visits** | Track hospital stays with 3-stage follow-ups |
| **Financial Aid** | One-time and recurring aid with scheduling |
| **Accident/Illness** | Auto-generated 3-stage follow-up timeline |
| **Childbirth** | New baby celebration tracking |
| **New House** | Housewarming visit scheduling |
| **Regular Contact** | Scheduled check-ins for relationship building |

### Dashboard & Analytics

| Feature | Description |
|---------|-------------|
| **Smart Dashboard** | Today's tasks, overdue items, and real-time stats |
| **Live Activity Feed** | Real-time updates from team members (SSE) |
| **Member Engagement** | Visual tracking: Active → At-Risk → Disconnected |
| **Bulk Operations** | Multi-select checkboxes for batch actions |
| **Advanced Search** | Find anyone instantly by name or phone |
| **Activity Audit Log** | Complete history of who did what, when |

### Multi-Campus Support

| Feature | Description |
|---------|-------------|
| **Data Isolation** | Each campus only sees their own data |
| **Role-Based Access** | Admin, Campus Admin, and Pastor roles |
| **Campus Switching** | Full admins can view any campus |
| **Shared Analytics** | Organization-wide statistics for admins |

---

## Quick Start

### Option 1: Docker Installation (Recommended)

Best for: Most users. Works on any Linux server with Docker.

**Prerequisites:**
- Linux server (Ubuntu, Debian, or any Linux with Docker)
- Domain name pointing to your server
- Ports 80 and 443 available

**Installation:**

```bash
# 1. Install Docker (skip if already installed)
curl -fsSL https://get.docker.com | bash

# 2. Clone the repository
git clone https://github.com/tesarfrr/FaithTracker_Church-Pastoral-Care-System.git
cd FaithTracker_Church-Pastoral-Care-System

# 3. Run the installer
sudo bash docker-install.sh
```

**The installer will ask:**

| Question | Example |
|----------|---------|
| Domain | `faithtracker.mychurch.org` |
| Email (SSL certificates) | `pastor@mychurch.org` |
| Admin email | `admin@mychurch.org` |
| Admin password | `SecurePassword123` |
| Church name | `My Church` |

**Done!** Your app is live at:
- Web app: `https://yourdomain.com`
- API docs: `https://api.yourdomain.com/docs`

---

### Option 2: Traditional Installation (Without Docker)

Best for: Servers without Docker, or environments requiring manual control.

**Prerequisites:**
- Ubuntu 20.04+ or Debian 11+
- Domain name pointing to your server

**One-Command Installation:**

```bash
wget https://raw.githubusercontent.com/tesarfrr/FaithTracker_Church-Pastoral-Care-System/main/install.sh -O install.sh && chmod +x install.sh && sudo ./install.sh
```

**What the installer does:**
1. Checks system resources
2. Installs dependencies (Python, Node.js, MongoDB, Nginx)
3. Configures SSL/HTTPS with Let's Encrypt
4. Creates systemd services
5. Starts everything automatically

---

## DNS Configuration

Before installing, point your domain to your server:

### Step 1: Get Your Server's IP
```bash
curl -4 ifconfig.me
```

### Step 2: Add DNS Records

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_SERVER_IP |
| A | api | YOUR_SERVER_IP |
| A | traefik | YOUR_SERVER_IP (optional) |

### Step 3: Verify DNS
```bash
dig yourdomain.com +short
dig api.yourdomain.com +short
```

Both should show your server's IP. DNS propagation takes 5-30 minutes.

---

## Mobile App (iOS & Android)

FaithTracker includes a native mobile app built with React Native and Expo.

### Features
- Dashboard with today's tasks
- Member search and profiles
- Create and complete care events
- Offline support with automatic sync
- Push notifications (coming soon)

### Development Setup
```bash
cd mobile
yarn install
yarn start
```

Scan the QR code with Expo Go on your device.

---

## Tech Stack

FaithTracker uses enterprise-grade technologies optimized for performance and developer experience.

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python 3.11 async web framework |
| **MongoDB 7.0** | Document database with Motor async driver |
| **Granian** | Rust-based ASGI server (10-15% faster than Uvicorn) |
| **msgspec** | Fast JSON serialization (30-50% less memory than orjson) |
| **APScheduler** | Background job scheduling |
| **Fernet** | Encryption for API credentials |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | Latest React with automatic memoization |
| **React Compiler** | No manual useMemo/useCallback needed |
| **Vite** | Lightning-fast build tool |
| **TanStack Query** | Server state management with caching |
| **Shadcn/UI** | Beautiful, accessible components |
| **Tailwind CSS** | Utility-first styling |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Container orchestration |
| **Traefik v3.6** | Reverse proxy with automatic SSL |
| **HTTP/3 (QUIC)** | Lower latency, especially on mobile |
| **Brotli** | 15-25% smaller than gzip compression |
| **PWA** | Offline-capable web app |

---

## Performance Optimizations

FaithTracker is highly optimized for speed and efficiency:

| Optimization | Benefit |
|--------------|---------|
| **Server-Sent Events** | Real-time updates without polling overhead |
| **View Transitions API** | Native-like page transitions |
| **Smart Prefetching** | Data loads before you navigate |
| **Offline Queue** | Works without internet, syncs later |
| **React Compiler** | Automatic memoization, zero manual optimization |
| **HTTP/3 + QUIC** | 20-30% faster on mobile networks |
| **Brotli Compression** | 15-25% smaller payloads |
| **Progressive JPEG** | Images appear instantly |
| **MongoDB Aggregation** | Single queries replace N+1 patterns |
| **In-Memory Cache** | Static data cached with TTL |
| **Connection Pooling** | 50 concurrent database connections |

---

## Security Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Secure, stateless tokens |
| **Bcrypt Passwords** | Industry-standard hashing |
| **HTTPS Everywhere** | Free Let's Encrypt certificates |
| **HTTP/3** | Encrypted by default (QUIC) |
| **Rate Limiting** | Prevents brute-force attacks |
| **Data Isolation** | Multi-tenant architecture |
| **Audit Trail** | All actions logged with timestamps |
| **Fernet Encryption** | API credentials encrypted at rest |

---

## Care Event Types

### Grief Support (Automatic 6-Stage Timeline)

When you create a grief/loss event, the system automatically generates follow-ups:

| Stage | Timing |
|-------|--------|
| Mourning Service | Immediate |
| 3-Day Check-in | 3 days |
| 7-Day Check-in | 1 week |
| 40-Day Check-in | 40 days |
| 100-Day Check-in | ~3 months |
| 1-Year Memorial | 1 year |

### Accident/Illness (Automatic 3-Stage Timeline)

| Stage | Timing |
|-------|--------|
| Initial Visit | Immediate |
| 3-Day Follow-up | 3 days |
| 7-Day Follow-up | 1 week |
| 14-Day Follow-up | 2 weeks |

### Financial Aid

- **One-time** - Single distribution
- **Weekly** - Every week
- **Monthly** - Every month
- **Annually** - Every year

---

## Updating FaithTracker

### Docker Update

```bash
cd /path/to/FaithTracker
git pull origin main
docker compose build --no-cache
docker compose up -d
```

### Traditional Update

```bash
cd /path/to/FaithTracker
git pull origin main
sudo bash update.sh
```

### Rollback (If Something Goes Wrong)

```bash
sudo bash update.sh --rollback
```

This restores the previous version automatically.

---

## Management Commands

### Docker

```bash
docker compose ps              # See running containers
docker compose logs -f         # Watch all logs
docker compose logs -f backend # Watch backend only
docker compose restart         # Restart all services
docker compose down            # Stop everything
docker compose up -d --build   # Rebuild and start
```

### Traditional (systemd)

```bash
sudo systemctl status faithtracker-backend   # Check status
sudo systemctl restart faithtracker-backend  # Restart backend
sudo systemctl status nginx                  # Check web server
tail -f /var/log/faithtracker/backend.out.log  # Watch logs
```

---

## Project Structure

```
FaithTracker/
├── backend/
│   ├── server.py              # Main API (~6500 lines, monolithic)
│   ├── scheduler.py           # Background job scheduler
│   ├── requirements.txt       # Python dependencies
│   └── uploads/               # User-uploaded photos
├── frontend/
│   ├── src/
│   │   ├── pages/             # Dashboard, MemberDetail, etc.
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Shadcn/UI components
│   │   │   └── dashboard/     # Dashboard-specific components
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useActivityStream.js   # SSE real-time feed
│   │   │   ├── useViewTransition.js   # Page transitions
│   │   │   ├── useOfflineSync.js      # Offline queue
│   │   │   └── usePrefetch.js         # Data prefetching
│   │   ├── lib/               # Utilities
│   │   │   └── offlineQueue.js        # IndexedDB sync queue
│   │   ├── context/           # React context providers
│   │   └── locales/           # i18n translations (en, id)
│   └── package.json
├── mobile/
│   ├── app/                   # Expo Router screens
│   ├── components/            # Mobile UI components
│   └── package.json
├── docker-compose.yml         # Docker orchestration
├── install.sh                 # Traditional installer
├── update.sh                  # Update script
├── docker-install.sh          # Docker installer
└── CLAUDE.md                  # AI assistant instructions
```

---

## API Documentation

Interactive documentation available after installation:

- **Swagger UI**: `https://api.yourdomain.com/docs`
- **ReDoc**: `https://api.yourdomain.com/redoc`

### Quick Example

```bash
# Login
curl -X POST https://api.yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@church.org", "password": "yourpassword"}'

# Get members (with token)
curl https://api.yourdomain.com/members \
  -H "Authorization: Bearer YOUR_TOKEN"
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference.

---

## Real-Time Activity Stream (SSE)

FaithTracker uses Server-Sent Events for real-time team collaboration:

### How It Works

1. **Connection**: Frontend establishes SSE connection with JWT token
2. **Broadcasting**: Backend broadcasts activity when any user performs an action
3. **Display**: Activity appears instantly in all connected dashboards

### Activity Types

| Action | Description |
|--------|-------------|
| `complete` | Task marked as done |
| `ignore` | Task skipped |
| `create_event` | New care event created |
| `update_event` | Care event modified |
| `delete_event` | Care event removed |
| `create_member` | New member added |
| `update_member` | Member profile updated |
| `complete_stage` | Grief/accident stage completed |
| `send_reminder` | WhatsApp reminder sent |
| `distribute_aid` | Financial aid distributed |

### API Endpoint

```
GET /stream/activity?token=JWT_TOKEN
Content-Type: text/event-stream
```

---

## Language Support

Fully translated in:
- **English** - Complete
- **Bahasa Indonesia** - Complete

Translation files: `frontend/src/locales/`

---

## Troubleshooting

### SSL Certificate Errors

Wait 1-2 minutes. Let's Encrypt needs time to issue certificates.

### Can't Access Website

1. Check firewall: `sudo ufw allow 80,443/tcp`
2. Verify DNS points to your server: `dig yourdomain.com +short`
3. Check services:
   - Docker: `docker compose ps`
   - Traditional: `sudo systemctl status faithtracker-backend nginx`

### View Logs

```bash
# Docker
docker compose logs -f backend

# Traditional
tail -f /var/log/faithtracker/backend.err.log
```

### SSE Not Connecting

1. Check Traefik SSE router is configured (no compression)
2. Verify JWT token is being passed: Check browser DevTools → Network → SSE request
3. Check backend logs for connection attempts

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Commit changes: `git commit -m 'feat: add feature'`
4. Push: `git push origin my-feature`
5. Open a Pull Request

---

## License

MIT License - Use freely for your church!

---

**Built with love for churches worldwide**
