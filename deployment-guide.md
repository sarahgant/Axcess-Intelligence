# CCH Axcess Intelligence - Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- SSL certificates (for HTTPS)
- Domain name configured
- Environment variables set

### 1. Environment Setup

1. **Copy environment template:**
   ```bash
   cp server/.env.example server/.env
   ```

2. **Configure required variables:**
   ```bash
   # Required for production
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ADMIN_KEY=your-secure-admin-key
   FRONTEND_URL=https://your-domain.com
   
   # Optional but recommended
   OPENAI_API_KEY=your-openai-api-key
   SESSION_SECRET=your-session-secret
   ```

### 2. SSL Certificate Setup

1. **Place SSL certificates:**
   ```bash
   mkdir -p ssl/
   cp your-certificate.crt ssl/certificate.crt
   cp your-private-key.key ssl/private.key
   ```

2. **Or use Let's Encrypt:**
   ```bash
   # Install certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Generate certificate
   sudo certbot certonly --standalone -d your-domain.com
   
   # Copy to ssl directory
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/certificate.crt
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/private.key
   ```

### 3. Deploy Application

**Basic deployment:**
```bash
docker-compose up -d
```

**With Nginx reverse proxy:**
```bash
docker-compose --profile with-nginx up -d
```

**Full monitoring stack:**
```bash
docker-compose --profile with-nginx --profile with-monitoring --profile with-logging up -d
```

## 📋 Configuration Options

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | production | Environment mode |
| `PORT` | No | 3001 | Server port |
| `FRONTEND_URL` | Yes | - | Frontend domain |
| `ANTHROPIC_API_KEY` | Yes | - | Anthropic API key |
| `ADMIN_KEY` | Yes | - | Admin dashboard access |
| `OPENAI_API_KEY` | No | - | OpenAI API key |
| `DATABASE_PATH` | No | ./data/intelligence.db | Database file path |
| `LOG_LEVEL` | No | info | Logging level |
| `RATE_LIMIT_MAX_REQUESTS` | No | 100 | Rate limit per window |

### Docker Compose Profiles

- **Default**: Basic app + backup service
- **with-nginx**: Adds Nginx reverse proxy
- **with-monitoring**: Adds Prometheus + Grafana
- **with-logging**: Adds log rotation

## 🔧 Production Optimizations

### 1. Database Configuration
- WAL mode enabled for better concurrency
- Memory-mapped I/O for performance
- Automatic backups every 24 hours
- 30-day backup retention

### 2. Security Features
- Rate limiting (100 requests/15 minutes)
- Security headers (CSP, HSTS, etc.)
- Input validation and sanitization
- Admin endpoints IP whitelisting
- SSL/TLS termination

### 3. Performance Features
- Gzip compression
- Static asset caching (1 year)
- Connection pooling
- HTTP/2 support
- CDN-ready headers

### 4. Monitoring & Logging
- Application health checks
- Structured JSON logging
- Log rotation and retention
- Prometheus metrics (optional)
- Grafana dashboards (optional)

## 📊 Monitoring

### Health Checks
- **Application**: `https://your-domain.com/api/health`
- **Database**: `https://your-domain.com/api/conversations/health`
- **Docker**: Built-in healthcheck every 30s

### Admin Dashboard
- Access via `Ctrl+Alt+A` on frontend
- Requires `ADMIN_KEY` authentication
- Shows usage analytics and feedback

### Logs
```bash
# View application logs
docker-compose logs -f app

# View nginx logs
docker-compose logs -f nginx

# View all logs
docker-compose logs -f
```

## 🛠 Maintenance

### Database Backups
```bash
# Manual backup
docker exec cch-intelligence-backup /backup.sh

# View backups
docker exec -it cch-intelligence-app ls -la /app/backups/

# Restore from backup
docker exec -it cch-intelligence-app sqlite3 /app/data/intelligence.db '.restore /app/backups/backup_file.db'
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d

# View logs for issues
docker-compose logs -f app
```

### Scaling
```bash
# Scale app instances
docker-compose up -d --scale app=3

# Add load balancer
# Update nginx.conf upstream block with multiple servers
```

## 🚨 Troubleshooting

### Common Issues

1. **Database locked errors**
   - Check if backup process is running
   - Verify WAL mode is enabled
   - Increase busy_timeout

2. **High memory usage**
   - Adjust SQLite cache_size
   - Enable log rotation
   - Monitor for memory leaks

3. **SSL certificate errors**
   - Verify certificate files exist
   - Check certificate expiration
   - Validate certificate chain

4. **Rate limiting issues**
   - Adjust RATE_LIMIT_MAX_REQUESTS
   - Check IP whitelist for admin
   - Monitor nginx access logs

### Debug Commands
```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs app

# Shell into container
docker exec -it cch-intelligence-app sh

# Test database connection
docker exec -it cch-intelligence-app sqlite3 /app/data/intelligence.db '.tables'

# Check nginx config
docker exec -it cch-intelligence-nginx nginx -t
```

## 📈 Performance Tuning

### Database Optimization
```sql
-- Run these in SQLite CLI for performance tuning
PRAGMA optimize;
PRAGMA wal_checkpoint(TRUNCATE);
ANALYZE;
```

### Nginx Optimization
- Enable HTTP/2
- Tune worker processes
- Adjust buffer sizes
- Configure caching

### Application Optimization
- Monitor memory usage
- Profile slow endpoints
- Optimize database queries
- Enable compression

## 🔐 Security Checklist

- [ ] SSL certificates installed and valid
- [ ] Strong admin key configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Admin endpoints IP-restricted
- [ ] Database backups encrypted
- [ ] Log files secured
- [ ] Container running as non-root
- [ ] Sensitive data not in logs
- [ ] Regular security updates

## 📞 Support

For issues or questions:
1. Check the logs first
2. Review this guide
3. Check Docker/container status
4. Verify environment configuration
5. Test database connectivity

Remember to never commit sensitive data like API keys or passwords to version control!
