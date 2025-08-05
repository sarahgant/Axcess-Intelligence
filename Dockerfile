# CCH Axcess Intelligence - Production Dockerfile
# Multi-stage build for security and efficiency

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY index.html ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY src/ ./src/
COPY public/ ./public/

# Build frontend for production
RUN npm run client:build

# Stage 2: Build backend
FROM node:18-alpine AS backend-build
WORKDIR /app

# Copy backend package files
COPY server/package*.json ./
RUN npm ci --only=production

# Stage 3: Production runtime
FROM node:18-alpine AS production
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy backend application
COPY --from=backend-build /app/node_modules ./node_modules
COPY server/ ./

# Copy built frontend (will be served by Express in production)
COPY --from=frontend-build /app/dist ./public/dist

# Create logs directory
RUN mkdir logs && chown nextjs:nodejs logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]