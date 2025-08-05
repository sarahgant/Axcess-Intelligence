# Deployment Guide

This guide covers deployment strategies, configuration, and best practices for CCH Axcess Intelligence Vibed.

## 🚀 Deployment Overview

The application supports multiple deployment strategies:

- **Development**: Local development with hot reloading
- **Staging**: Pre-production testing environment  
- **Production**: Production deployment with optimizations
- **Docker**: Containerized deployment
- **Cloud**: AWS, Azure, GCP deployment

## 📋 Prerequisites

### System Requirements

**Minimum Requirements:**
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Node.js**: 18+
- **npm**: 9+

**Recommended for Production:**
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Load Balancer**: nginx/Apache
- **SSL Certificate**: Let's Encrypt or commercial

### Environment Setup

1. **Server Preparation**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx (optional)
sudo apt install nginx

# Setup firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

2. **SSL Certificate**
```bash
# Using Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔧 Configuration

### Environment Files

Create environment-specific configuration:

#### Production (.env.production)
```bash
# Production Environment
NODE_ENV=production
PORT=5173

# API Configuration
VITE_API_URL=https://api.your-domain.com
FRONTEND_URL=https://your-domain.com

# AI Provider Keys (use production keys)
ANTHROPIC_API_KEY=your_production_anthropic_key
OPENAI_API_KEY=your_production_openai_key

# Security (generate secure values)
ENCRYPTION_KEY=your_32_character_production_key
JWT_SECRET=your_production_jwt_secret

# Feature Flags
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_STREAMING=true
VITE_ENABLE_DOCUMENT_ANALYSIS=true

# Production Limits
VITE_MAX_DOCUMENTS_PER_SESSION=10
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
VITE_LOG_LEVEL=warn

# Security Headers
FORCE_HTTPS=true
ENABLE_CSP_REPORTS=true

# Monitoring (optional)
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id
```

#### Staging (.env.staging)
```bash
# Staging Environment
NODE_ENV=staging
PORT=5173

# Use staging endpoints
VITE_API_URL=https://staging-api.your-domain.com
FRONTEND_URL=https://staging.your-domain.com

# Use test/staging API keys
ANTHROPIC_API_KEY=your_staging_anthropic_key
OPENAI_API_KEY=your_staging_openai_key

# Relaxed settings for testing
VITE_ENABLE_DEBUG_MODE=true
RATE_LIMIT_MAX=1000
LOG_LEVEL=debug
```

### Build Configuration

#### Production Build
```bash
# Build for production
npm run build:prod

# Verify build
npm run preview

# Test production build
npm run test:build
```

#### Build Optimization
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false, // Disable in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          features: ['src/features'],
          shared: ['src/shared']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log
        drop_debugger: true
      }
    }
  },
  define: {
    __DEV__: false
  }
});
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build:prod

# Production stage
FROM nginx:alpine AS production

# Install Node.js for server
RUN apk add --no-cache nodejs npm

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy server files
COPY --from=builder /app/server /app/server
COPY --from=builder /app/node_modules /app/node_modules

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 80 443 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start services
CMD ["/start.sh"]
```

### Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cch-intelligence
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    volumes:
      - ./logs:/app/logs
      - /etc/letsencrypt:/etc/letsencrypt:ro
    restart: unless-stopped
    depends_on:
      - redis
      - postgres

  redis:
    image: redis:7-alpine
    container_name: cch-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  postgres:
    image: postgres:15-alpine
    container_name: cch-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: cch_intelligence
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  redis_data:
  postgres_data:
```

### Docker Commands
```bash
# Build image
docker build -t cch-intelligence:latest .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f app

# Update deployment
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --force-recreate

# Backup data
docker-compose exec postgres pg_dump -U ${DB_USER} cch_intelligence > backup.sql
```

## ☁️ Cloud Deployment

### AWS Deployment

#### EC2 Instance
```bash
# Launch EC2 instance (t3.medium recommended)
# Configure security groups:
# - Port 22 (SSH)
# - Port 80 (HTTP) 
# - Port 443 (HTTPS)

# Connect and setup
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# Clone and deploy
git clone https://github.com/your-org/cch-axcess-intelligence.git
cd cch-axcess-intelligence
npm install
npm run build:prod

# Setup PM2
sudo npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

#### ECS Deployment
```yaml
# ecs-task-definition.json
{
  "family": "cch-intelligence",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "cch-intelligence",
      "image": "your-account.dkr.ecr.region.amazonaws.com/cch-intelligence:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "ANTHROPIC_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:anthropic-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cch-intelligence",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Azure Deployment

#### App Service
```bash
# Create resource group
az group create --name cch-intelligence-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name cch-intelligence-plan \
  --resource-group cch-intelligence-rg \
  --sku P1V2 \
  --is-linux

# Create web app
az webapp create \
  --resource-group cch-intelligence-rg \
  --plan cch-intelligence-plan \
  --name cch-intelligence \
  --runtime "NODE|18-lts"

# Configure app settings
az webapp config appsettings set \
  --resource-group cch-intelligence-rg \
  --name cch-intelligence \
  --settings NODE_ENV=production \
             WEBSITE_NODE_DEFAULT_VERSION=18

# Deploy from GitHub
az webapp deployment source config \
  --resource-group cch-intelligence-rg \
  --name cch-intelligence \
  --repo-url https://github.com/your-org/cch-axcess-intelligence \
  --branch main \
  --manual-integration
```

### Google Cloud Platform

#### Cloud Run
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/cch-intelligence:$COMMIT_SHA', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/cch-intelligence:$COMMIT_SHA']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'cch-intelligence'
      - '--image'
      - 'gcr.io/$PROJECT_ID/cch-intelligence:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

## 🔄 Process Management

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'cch-intelligence-server',
      script: 'server/server.js',
      cwd: '/path/to/app',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'cch-intelligence-frontend',
      script: 'serve',
      args: '-s dist -p 5173',
      cwd: '/path/to/app',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### PM2 Commands
```bash
# Start application
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# View logs
pm2 logs cch-intelligence-server

# Restart
pm2 restart all

# Stop
pm2 stop all

# Reload (zero-downtime)
pm2 reload all

# Auto-startup
pm2 startup
pm2 save
```

## 🌐 Web Server Configuration

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/cch-intelligence
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend (Static Files)
    location / {
        root /path/to/app/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health Check
    location /health {
        proxy_pass http://localhost:3001;
        access_log off;
    }
    
    # WebSocket Support
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Apache Configuration
```apache
# /etc/apache2/sites-available/cch-intelligence.conf
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /path/to/app/dist
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem
    
    # Security Headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    
    # Compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Frontend
    <Directory "/path/to/app/dist">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA fallback
        FallbackResource /index.html
    </Directory>
    
    # Backend API
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass /api/ http://localhost:3001/api/
    ProxyPassReverse /api/ http://localhost:3001/api/
</VirtualHost>
```

## 📊 Monitoring & Observability

### Health Checks
```bash
# Create health check script
#!/bin/bash
# health-check.sh

# Check frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
if [ $FRONTEND_STATUS -ne 200 ]; then
    echo "Frontend unhealthy: $FRONTEND_STATUS"
    exit 1
fi

# Check backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
if [ $BACKEND_STATUS -ne 200 ]; then
    echo "Backend unhealthy: $BACKEND_STATUS"
    exit 1
fi

echo "All services healthy"
exit 0
```

### Log Management
```bash
# Setup log rotation
sudo tee /etc/logrotate.d/cch-intelligence << EOF
/path/to/app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    copytruncate
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

### Monitoring with Prometheus
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'cch-intelligence'
    static_configs:
      - targets: ['localhost:3001']
    metrics_path: '/metrics'
    scrape_interval: 30s
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run security:audit

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build:prod
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull origin main
            npm ci --only=production
            npm run build:prod
            pm2 reload ecosystem.config.js --env production
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations run
- [ ] Security scan completed
- [ ] Performance testing passed
- [ ] Backup strategy in place

### Deployment
- [ ] Build application
- [ ] Run health checks
- [ ] Deploy to staging first
- [ ] Smoke tests pass
- [ ] Deploy to production
- [ ] Verify deployment

### Post-deployment
- [ ] Monitor logs for errors
- [ ] Check application metrics
- [ ] Verify all features working
- [ ] Update documentation
- [ ] Notify stakeholders

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build:prod
```

#### Port Conflicts
```bash
# Find process using port
sudo lsof -i :3001
sudo kill -9 <PID>

# Or use our utility
npm run clean
```

#### SSL Issues
```bash
# Renew Let's Encrypt certificate
sudo certbot renew --dry-run
sudo certbot renew
sudo systemctl reload nginx
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:prod

# Monitor memory usage
pm2 monit
```

#### Database Connection
```bash
# Check database status
sudo systemctl status postgresql
sudo systemctl restart postgresql

# Test connection
psql -h localhost -U username -d database_name
```

### Rollback Procedures
```bash
# Quick rollback with PM2
pm2 restart all --env production

# Git-based rollback
git revert HEAD
npm run build:prod
pm2 reload all

# Docker rollback
docker-compose down
docker-compose up -d
```

---

For deployment support, contact DevOps team at devops@yourcompany.com