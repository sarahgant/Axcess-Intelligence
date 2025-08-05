# CCH Axcess Intelligence - Production Deployment Guide

## 🎯 Overview

This guide covers deploying CCH Axcess Intelligence in a production environment with security, scalability, and monitoring best practices.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │     Nginx       │    │   Application   │
│   (Optional)    │───▶│   Reverse Proxy │───▶│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Static Files  │    │   AI Providers  │
                       │   (Frontend)    │    │ Anthropic/OpenAI│
                       └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

### Required Software
- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Git**
- **Node.js** (18+ for local development)

### Required API Keys
- **Anthropic API Key** from [console.anthropic.com](https://console.anthropic.com/)
- **OpenAI API Key** from [platform.openai.com](https://platform.openai.com/api-keys)

### Server Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB+ recommended
- **Storage**: 10GB+ for application and logs
- **Network**: HTTPS-capable domain (for production)

## 🔧 Setup Instructions

### 1. Clone and Prepare

```bash
git clone <your-repository>
cd cch-axcess-intelligence-vibed
```

### 2. Configure Environment

Create production environment file:

```bash
cp server/env.example server/.env.production
```

Edit `server/.env.production`:

```env
# Server Configuration
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# Frontend URL (update for your domain)
FRONTEND_URL=https://your-domain.com

# AI Provider API Keys (SECURE - server-side only)
ANTHROPIC_API_KEY=your_anthropic_key_here
ANTHROPIC_DEFAULT_MODEL=claude-3-sonnet-20240229
OPENAI_API_KEY=your_openai_key_here
OPENAI_DEFAULT_MODEL=gpt-4

# Security
ENCRYPTION_KEY=your_secure_32_char_encryption_key

# Feature Flags
ENABLE_STREAMING=true
ENABLE_DOCUMENT_ANALYSIS=true
ENABLE_RAG_SEARCH=true
ENABLE_CHAT_HISTORY=true
ENABLE_DEBUG_MODE=false

# Rate Limiting
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. SSL Configuration (Production)

For HTTPS, place your SSL certificates in:
```
ssl/
├── cert.pem    # Your SSL certificate
└── key.pem     # Your private key
```

### 4. Deploy

#### Option A: Quick Deploy (Windows)
```powershell
.\deploy.ps1 production
```

#### Option B: Manual Docker Deploy
```bash
# Build the application
docker build -t cch-intelligence:latest .

# Start with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
```

#### Option C: Development Mode
```bash
npm run dev  # Runs both frontend and backend
```

## 🔍 Verification

### Health Checks
```bash
# Basic health
curl http://localhost:3001/health

# Detailed health with service checks
curl http://localhost:3001/health/detailed?checkServices=true

# API providers
curl http://localhost:3001/api/chat/providers
```

### Expected Responses
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "services": {
    "anthropic": { "configured": true, "status": "healthy" },
    "openai": { "configured": true, "status": "healthy" }
  }
}
```

## 🌐 Domain Configuration

### DNS Setup
Point your domain to your server:
```
A     @           YOUR.SERVER.IP
A     www         YOUR.SERVER.IP
```

### Nginx Configuration
Update `nginx.conf`:
```nginx
server_name your-domain.com www.your-domain.com;
```

## 📊 Monitoring

### Logs
```bash
# Application logs
docker-compose logs -f app

# Nginx logs  
docker-compose logs -f nginx

# Specific service logs
docker-compose exec app tail -f logs/combined.log
```

### Key Metrics to Monitor
- **Response Time**: API endpoint latency
- **Error Rate**: 4xx/5xx responses
- **AI Provider Health**: Connection status
- **Resource Usage**: CPU, memory, disk
- **Rate Limiting**: Blocked requests

## 🔒 Security Checklist

### Environment Security
- [ ] API keys are in server-side environment only
- [ ] No VITE_ prefixed sensitive variables
- [ ] ENCRYPTION_KEY is 32+ characters
- [ ] NODE_ENV=production
- [ ] Debug mode disabled

### Network Security
- [ ] HTTPS enabled with valid certificates
- [ ] CORS configured for your domain only
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Firewall rules applied

### Application Security
- [ ] Dependencies updated
- [ ] Docker image scanned for vulnerabilities
- [ ] Non-root user in container
- [ ] Logs don't contain sensitive data

## 🚀 Scaling

### Horizontal Scaling
```yaml
# docker-compose.yml
services:
  app:
    deploy:
      replicas: 3
    # Load balancer configuration
```

### Performance Tuning
- **Memory**: Increase container memory for high traffic
- **CPU**: Add more cores for concurrent requests
- **Caching**: Implement Redis for session storage
- **CDN**: Use CloudFlare or AWS CloudFront

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
netstat -tulpn | grep :3001

# Kill process
sudo kill -9 <PID>
```

#### API Keys Not Working
- Verify keys are correctly set in `server/.env.production`
- Check provider service status at their dashboards
- Review application logs for authentication errors

#### Frontend Not Connecting to Backend
- Verify CORS configuration in `server/server.js`
- Check `VITE_API_URL` in frontend environment
- Ensure backend is running on correct port

#### Memory Issues
```bash
# Check container resource usage
docker stats

# Increase memory limit
docker-compose up -d --scale app=1 --memory=2g
```

## 📝 Maintenance

### Regular Tasks
- **Daily**: Review logs for errors
- **Weekly**: Check disk space and clean old logs
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and rotate API keys

### Backup Strategy
- **Code**: Git repository with tags
- **Configuration**: Environment files (secure storage)
- **Logs**: Regular rotation and archival
- **Conversations**: Database backup (if implemented)

### Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and deploy
docker-compose build --no-cache
docker-compose up -d

# Verify deployment
curl http://localhost:3001/health
```

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment configuration
3. Test individual components
4. Review security settings
5. Contact system administrator

---

**Production deployment complete!** 🎉

Your CCH Axcess Intelligence platform is now running securely with:
- ✅ API keys protected server-side
- ✅ Rate limiting and CORS protection  
- ✅ HTTPS encryption
- ✅ Comprehensive logging
- ✅ Health monitoring
- ✅ Scalable architecture