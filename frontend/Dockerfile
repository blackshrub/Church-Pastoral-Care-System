# FaithTracker Frontend Dockerfile
# Multi-stage build: Node for building, Nginx for serving

# ===================
# Stage 1: Build
# ===================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Build argument for API URL (can be overridden at build time)
ARG REACT_APP_BACKEND_URL=https://api.localhost
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Increase Node.js memory limit for faster builds
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Disable telemetry and CI mode for faster installs
ENV YARN_ENABLE_TELEMETRY=0
ENV CI=true

# Copy package files first (better layer caching)
COPY package.json yarn.lock ./

# Install dependencies with optimizations
RUN yarn install --frozen-lockfile --network-timeout 600000 --prefer-offline

# Copy only necessary source files (exclude test files, docs, etc.)
COPY public ./public
COPY src ./src
COPY craco.config.js tailwind.config.js postcss.config.js jsconfig.json ./

# Build the application with optimizations
ENV GENERATE_SOURCEMAP=false
ENV INLINE_RUNTIME_CHUNK=false
RUN yarn build

# ===================
# Stage 2: Serve
# ===================
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
