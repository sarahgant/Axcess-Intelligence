# CCH Axcess Intelligence - Production Dockerfile
# Multi-stage build for optimal production deployment

# Stage 1: Frontend Build
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build frontend
RUN npm run client:build

# Stage 2: Backend Build
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY server/package*.json ./server/
WORKDIR /app/server

# Install backend dependencies
RUN npm ci --only=production

# Stage 3: Production Runtime
FROM node:18-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    sqlite \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Create necessary directories
RUN mkdir -p data logs backups ssl && \
    chown -R nodejs:nodejs /app

# Copy backend files
COPY --from=backend-builder --chown=nodejs:nodejs /app/server ./server/

# Copy built frontend
COPY --from=frontend-builder --chown=nodejs:nodejs /app/dist ./dist/

# Copy additional server files
COPY --chown=nodejs:nodejs server/config ./server/config/
COPY --chown=nodejs:nodejs server/database ./server/database/
COPY --chown=nodejs:nodejs server/routes ./server/routes/
COPY --chown=nodejs:nodejs server/services ./server/services/
COPY --chown=nodejs:nodejs server/utils ./server/utils/
COPY --chown=nodejs:nodejs server/server.js ./server/

# Set up production environment
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1) \
    }).on('error', () => process.exit(1))"

# Switch to non-root user
USER nodejs

# Start the application
CMD ["node", "server/server.js"]