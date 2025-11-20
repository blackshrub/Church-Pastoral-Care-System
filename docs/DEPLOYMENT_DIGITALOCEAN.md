# DigitalOcean Deployment Guide

Complete guide to deploy FaithTracker Pastoral Care System on DigitalOcean.

---

## Prerequisites

- DigitalOcean account
- Domain name (optional but recommended)
- GitHub repository with FaithTracker code
- 30-60 minutes

---

## Step 1: Create a Droplet

### 1.1 Choose Specifications

**Recommended Droplet:**
- **Distribution:** Ubuntu 22.04 LTS or Debian 12
- **Plan:** Basic
- **CPU Options:** Regular (2 GB RAM minimum)
- **Price:** $12/month (2 GB) or $18/month (4 GB recommended)

**For Production:**
- 4 GB RAM: ~800 members
- 8 GB RAM: ~2000 members

### 1.2 Configuration

1. Log into DigitalOcean
2. Click "Create" → "Droplets"
3. Choose region closest to your location
4. Select Ubuntu 22.04 LTS
5. Choose Droplet Type: Basic Shared CPU
6. Select CPU option: Regular (4 GB/$18/mo recommended)
7. Add SSH key or choose Password authentication
8. Add tags: `faithtracker`, `production`
9. Click "Create Droplet"

### 1.3 Wait for Provisioning

- Takes 30-60 seconds
- Note the public IP address (e.g., 143.198.123.45)

---

## Step 2: Domain Configuration (Optional)

### 2.1 Point Domain to Droplet

**In your domain registrar (Namecheap, GoDaddy, etc.):**

Add A records:
```
Type: A
Name: @
Value: [Your Droplet IP]
TTL: 300

Type: A  
Name: www
Value: [Your Droplet IP]
TTL: 300
```

**Or use DigitalOcean DNS:**
1. Networking → Domains
2. Add your domain
3. Create A records pointing to droplet

### 2.2 Wait for DNS Propagation

- Usually 5-30 minutes
- Test: `ping yourdomain.com`

---

## Step 3: Access Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
# Or if using SSH key:
ssh -i ~/.ssh/id_rsa root@YOUR_DROPLET_IP
```

**First Time:**
- May ask to verify fingerprint (type `yes`)
- If using password, enter the one emailed by DigitalOcean

---

## Step 4: Run One-Command Installation

### 4.1 Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/faithtracker.git
cd faithtracker
```

### 4.2 Run Installer

```bash
sudo bash install.sh
```

**The installer will:**
1. ✅ Check system requirements
2. ✅ Install dependencies (Python, Node.js, MongoDB, Nginx)
3. ✅ Prompt for configuration:
   - MongoDB connection (local or Atlas)
   - JWT secret (auto-generated)
   - Domain name
   - Church name
   - Admin email & password
4. ✅ Set up systemd services
5. ✅ Configure Nginx
6. ✅ Run smoke tests

**Installation time:** 10-15 minutes

---

## Step 5: SSL Certificate (HTTPS)

### 5.1 During Installation

When prompted: "Install SSL certificate now? (y/n)"
- Type `y` if DNS is already pointing to droplet
- Type `n` if you'll do it later

### 5.2 Manual SSL Installation

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Follow prompts:**
- Enter email address
- Agree to Terms of Service
- Redirect HTTP to HTTPS? → Yes

**Auto-renewal:**
- Certbot automatically renews before expiration
- Test: `sudo certbot renew --dry-run`

---

## Step 6: Configure Firewall

```bash
# Enable firewall
sudo ufw enable

# Allow SSH (important!)
sudo ufw allow ssh

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

**Should show:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## Step 7: Verify Installation

### 7.1 Check Services

```bash
sudo systemctl status faithtracker-backend
sudo systemctl status nginx
sudo systemctl status mongod
```

All should show: `active (running)`

### 7.2 Test Website

Visit: `https://yourdomain.com`

**Should see:**
- FaithTracker login page
- No security warnings (SSL working)
- Fast load time

### 7.3 Test Login

Use credentials you created during installation:
- Email: [admin email]
- Password: [admin password]

---

## Step 8: Post-Deployment Configuration

### 8.1 Configure API Sync (If using FaithFlow Enterprise)

1. Log in as admin
2. Go to Settings → API Sync
3. Enter core API credentials
4. Test connection
5. Enable sync

### 8.2 Add First Users

1. Settings → Admin Dashboard
2. Add campus admin or pastor accounts
3. Set passwords
4. Assign to campus

### 8.3 Import Members (If not using sync)

1. Go to Import/Export
2. Upload CSV
3. Map fields
4. Import

---

## Step 9: Monitoring & Maintenance

### 9.1 Check Logs

**Backend logs:**
```bash
sudo journalctl -u faithtracker-backend -f
```

**Nginx logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

### 9.2 Restart Services (If Needed)

```bash
sudo systemctl restart faithtracker-backend
sudo systemctl restart nginx
```

### 9.3 Updates

When you push code to GitHub:

```bash
cd /opt/faithtracker
git pull origin main

# Backend updates
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart faithtracker-backend

# Frontend updates
cd ../frontend
yarn install
yarn build
sudo systemctl restart nginx
```

---

## Step 10: Backups

### 10.1 DigitalOcean Snapshots

**Enable Automated Backups:**
1. Droplet → Backups tab
2. Enable weekly backups ($2.40/month for 4GB droplet)
3. Keeps 4 most recent backups

### 10.2 MongoDB Backups

**Create backup script:**
```bash
sudo nano /opt/faithtracker/backup.sh
```

**Paste:**
```bash
#!/bin/bash
BACKUP_DIR="/opt/faithtracker/backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y-%m-%d_%H-%M-%S)
mongodump --db=pastoral_care_db --archive=$BACKUP_DIR/backup_$DATE.gz --gzip
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
echo "Backup completed: $BACKUP_DIR/backup_$DATE.gz"
```

**Make executable:**
```bash
sudo chmod +x /opt/faithtracker/backup.sh
```

**Schedule daily backups (3 AM):**
```bash
sudo crontab -e
# Add this line:
0 3 * * * /opt/faithtracker/backup.sh
```

### 10.3 Offsite Backups to DigitalOcean Spaces

1. Create a Space (Object Storage)
2. Install s3cmd: `sudo apt install s3cmd`
3. Configure: `s3cmd --configure`
4. Upload backups: `s3cmd put /opt/faithtracker/backups/* s3://your-space/`

---

## Troubleshooting

### "502 Bad Gateway"

**Backend not running:**
```bash
sudo systemctl start faithtracker-backend
sudo journalctl -u faithtracker-backend -n 50
```

### "Connection Refused"

**Firewall blocking:**
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Slow Performance

**Add more RAM:**
1. Droplet → Resize
2. Choose larger plan
3. Power off → Resize → Power on

**Or add Swap:**
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Cost Breakdown

**Minimum Production Setup:**
- Droplet (4 GB): $18/month
- Backups: $3.60/month
- Domain: $10-15/year (~$1/month)
- **Total: ~$23/month**

**With DigitalOcean Spaces (offsite backups):**
- Add $5/month (250 GB)
- **Total: ~$28/month**

**Enterprise (8 GB + Backups + Spaces):**
- Droplet: $48/month
- Backups: $9.60/month  
- Spaces: $5/month
- **Total: ~$63/month**

---

## Quick Start Checklist

- [ ] Create 4 GB droplet (Ubuntu 22.04)
- [ ] Point domain to droplet IP
- [ ] SSH into droplet
- [ ] Clone repository
- [ ] Run `sudo bash install.sh`
- [ ] Configure during installation
- [ ] Install SSL certificate
- [ ] Enable firewall
- [ ] Test login
- [ ] Set up backups
- [ ] Add users
- [ ] Import/sync members
- [ ] ✅ Production ready!

---

## Support

**DigitalOcean Community:** https://www.digitalocean.com/community
**FaithTracker Docs:** `/opt/faithtracker/docs/`
**Issues:** GitHub Issues

---

**Deployment time:** 30-45 minutes
**Difficulty:** Intermediate (installer makes it easy!)

**Note:** The existing `install.sh` script works perfectly on DigitalOcean droplets. Just follow Steps 1-4 above and you're done! 🚀
