#!/bin/bash

#################################################################################
# FaithTracker Update Script
# Run this from your git repository to update the deployed app
#################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  FaithTracker Update Script${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Detect git repository location (where you pulled)
GIT_DIR=$(pwd)
APP_DIR="/opt/faithtracker"

echo -e "${BLUE}[1/7]${NC} Detecting directories..."
echo "  Git repository: $GIT_DIR"
echo "  Application: $APP_DIR"

# Check if git directory has the code
if [ ! -f "$GIT_DIR/backend/server.py" ]; then
    echo -e "${RED}Error: Not in FaithTracker git repository${NC}"
    exit 1
fi

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}Error: Application directory $APP_DIR not found${NC}"
    echo "Run install.sh first"
    exit 1
fi

# Copy updated files to app directory
echo -e "${BLUE}[2/7]${NC} Copying updated files from git to app directory..."
rsync -a --exclude='.git' --exclude='node_modules' --exclude='venv' --exclude='__pycache__' --exclude='build' "$GIT_DIR/" "$APP_DIR/"
echo -e "${GREEN}✓ Files copied${NC}"

# Update backend
echo -e "${BLUE}[3/7]${NC} Updating backend..."
cd "$APP_DIR/backend"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt --quiet
deactivate

# Update frontend
echo -e "${BLUE}[4/7]${NC} Updating frontend..."
cd "$APP_DIR/frontend"
yarn install --silent
yarn build --silent

# Restart backend service
echo -e "${BLUE}[4/6]${NC} Restarting backend service..."
sudo systemctl restart faithtracker-backend

# Restart nginx
echo -e "${BLUE}[5/6]${NC} Restarting nginx..."
sudo systemctl restart nginx

# Verify services
echo -e "${BLUE}[6/6]${NC} Verifying services..."
sleep 2

BACKEND_STATUS=$(sudo systemctl is-active faithtracker-backend)
NGINX_STATUS=$(sudo systemctl is-active nginx)

if [ "$BACKEND_STATUS" = "active" ]; then
    echo -e "${GREEN}✓ Backend: Running${NC}"
else
    echo -e "${RED}✗ Backend: Not running${NC}"
fi

if [ "$NGINX_STATUS" = "active" ]; then
    echo -e "${GREEN}✓ Nginx: Running${NC}"
else
    echo -e "${RED}✗ Nginx: Not running${NC}"
fi

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  Update Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit your website"
echo "2. Hard refresh browser (Ctrl+Shift+R)"
echo "3. Test main features"
echo ""
echo -e "${BLUE}View backend logs:${NC} sudo journalctl -u faithtracker-backend -f"
echo -e "${BLUE}View nginx logs:${NC} sudo tail -f /var/log/nginx/error.log"
echo ""
