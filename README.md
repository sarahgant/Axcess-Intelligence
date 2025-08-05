# CCH Intelligence

🧠 **Advanced AI-Powered Tax Research & Document Analysis Platform**

CCH Intelligence is a production-ready, enterprise-grade platform that combines the power of multiple AI providers (Anthropic Claude & OpenAI GPT) with sophisticated document analysis capabilities, designed specifically for tax research and professional accounting workflows.

---

## 🌟 Features

### 🤖 **Multi-AI Provider Support**
- **Anthropic Claude** integration with streaming responses
- **OpenAI GPT** support with fallback capabilities  
- **Provider switching** - Choose the best AI for each task
- **Health monitoring** - Automatic provider status checking

### 📄 **Document Intelligence**
- **Document upload** with multiple format support
- **Context-aware analysis** - AI responses consider uploaded documents
- **Document retention** with configurable expiration
- **CCH Search integration** for professional tax research

### 🔒 **Enterprise Security**
- **API keys secured server-side** - Never exposed to browser
- **Rate limiting** - 100 requests per 15 minutes per IP
- **CORS protection** - Domain-specific access control
- **HTTPS ready** with SSL/TLS configuration
- **Security headers** - XSS, CSRF, content policy protection

### ⚡ **Performance & Scalability**
- **Real-time streaming** responses
- **Concurrent request handling**
- **Docker containerization** 
- **Load balancer ready**
- **Health monitoring** with automated recovery

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Secure API    │    │  AI Providers   │
│   (React/Vite)  │───▶│   (Express.js)  │───▶│ Claude/OpenAI   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Rate Limiting │
                       │   CORS/Security │
                       │   Logging       │
                       └─────────────────┘
```

### **Security Architecture**
- **Frontend**: No API keys, secure communication with backend
- **Backend**: API key storage, request validation, response filtering
- **AI Providers**: Secure server-to-server communication only

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Docker** & **Docker Compose** (for production)
- **API Keys**: [Anthropic](https://console.anthropic.com/) & [OpenAI](https://platform.openai.com/api-keys)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/cch-intelligence.git
cd cch-intelligence
npm install
```

### 2. Configure Environment
```bash
# Create backend environment file
cp server/env.example server/.env

# Edit server/.env with your API keys:
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
ENCRYPTION_KEY=your_secure_32_char_encryption_key
```

### 3. Start Development
```bash
npm run dev
```

**Frontend**: http://localhost:5173  
**Backend API**: http://localhost:3001

---

## 🛠️ Development

### **Available Scripts**
```bash
# Development (runs both frontend & backend)
npm run dev

# Frontend only
npm run client:dev

# Backend only  
npm run server:dev

# Production build
npm run build

# Clean install
npm run fresh
```

### **Project Structure**
```
cch-intelligence/
├── src/                    # Frontend React application
│   ├── screens/           # Main application screens
│   ├── components/        # Reusable UI components
│   ├── services/          # API client & utilities
│   └── styles/           # Styling & assets
├── server/                # Backend Express.js API
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic & AI providers
│   └── utils/            # Utilities & logging
├── docs/                  # Documentation
├── tests/                 # Test suites
└── scripts/              # Build & deployment scripts
```

---

## 🚀 Production Deployment

### **Docker Deployment (Recommended)**
```bash
# Quick deploy
./deploy.ps1 production

# Or manual Docker
docker-compose up -d
```

### **Environment Setup**
1. **Create production environment**:
   ```bash
   cp server/env.example server/.env.production
   ```

2. **Configure for your domain**:
   ```env
   NODE_ENV=production
   FRONTEND_URL=https://your-domain.com
   # ... API keys and other settings
   ```

3. **SSL Certificates** (for HTTPS):
   ```
   ssl/
   ├── cert.pem
   └── key.pem
   ```

### **Deployment Options**
- **🐳 Docker Compose**: Full stack with Nginx reverse proxy
- **☁️ Cloud Platforms**: AWS, Google Cloud, Azure ready
- **🔧 Manual Setup**: Traditional server deployment

---

## 📊 Monitoring & Maintenance

### **Health Checks**
```bash
# Basic health
curl http://localhost:3001/health

# Detailed service status
curl http://localhost:3001/health/detailed?checkServices=true
```

### **Logs**
```bash
# Application logs
docker-compose logs -f app

# Real-time monitoring
tail -f server/logs/combined.log
```

### **Key Metrics**
- Response time & error rates
- AI provider availability
- Rate limiting effectiveness
- Resource utilization

---

## 🔒 Security

### **API Key Management**
- ✅ **Server-side only** - API keys never exposed to browser
- ✅ **Environment isolation** - Separate configs for dev/staging/prod
- ✅ **Rotation ready** - Easy key updates without code changes

### **Request Security**
- ✅ **Rate limiting** - Prevents abuse and API exhaustion
- ✅ **CORS protection** - Domain whitelist enforcement
- ✅ **Input validation** - Request sanitization and validation
- ✅ **Security headers** - XSS, CSRF, content policy protection

### **Infrastructure Security**
- ✅ **HTTPS enforcement** - TLS encryption for all communications
- ✅ **Container security** - Non-root user, minimal attack surface
- ✅ **Dependency scanning** - Automated vulnerability detection

---

## 🧪 Testing

### **Test Suites**
```bash
# Run all tests
npm test

# Unit tests
npm run test:unit

# Integration tests  
npm run test:integration

# End-to-end tests
npm run test:e2e
```

### **Test Coverage**
- Unit tests for AI provider integrations
- Integration tests for API endpoints
- E2E tests for complete user workflows

---

## 📈 Performance

### **Optimization Features**
- **Streaming responses** - Real-time AI output
- **Request caching** - Reduced redundant API calls
- **Connection pooling** - Efficient resource utilization
- **Gzip compression** - Reduced bandwidth usage

### **Scalability**
- **Horizontal scaling** - Multi-instance deployment
- **Load balancing** - Request distribution
- **Database ready** - Persistent storage integration
- **CDN compatible** - Static asset optimization

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`  
5. **Open a Pull Request**

### **Development Guidelines**
- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure security best practices

---

## 📋 API Documentation

### **Chat Endpoints**
```http
POST /api/chat/message
POST /api/chat/stream
GET  /api/chat/providers
GET  /api/chat/conversations/:id
```

### **Health & Monitoring**
```http
GET /health
GET /health/detailed
```

**Full API documentation**: See [docs/api.md](docs/api.md)

---

## 🆘 Support

### **Common Issues**
- **Port conflicts**: Use `npm run clean` to free ports
- **API key errors**: Verify environment file configuration
- **Connection issues**: Check CORS settings and network connectivity

### **Getting Help**
- 📖 **Documentation**: Check `/docs` folder
- 🐛 **Issues**: Submit GitHub issues with detailed information
- 💬 **Discussions**: Use GitHub Discussions for questions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Acknowledgments

- **Anthropic** for Claude AI capabilities
- **OpenAI** for GPT integration  
- **CCH** for tax research domain expertise
- **Open source community** for foundational technologies

---

<div align="center">

**Built with ❤️ for professional tax research and document analysis**

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)
[![Security](https://img.shields.io/badge/Security-Enterprise-red.svg)](#security)

</div>