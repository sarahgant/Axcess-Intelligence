# 🚨 CRITICAL ARCHITECTURE CONSTRAINTS - NEVER VIOLATE

## 📁 ENVIRONMENT FILES - THEY ALREADY EXIST

### ⚠️ CRITICAL RULE: NEVER CREATE OR MODIFY .ENV FILES
- **NEVER** create new .env files
- **NEVER** suggest creating .env files
- **NEVER** ask users to create .env files
- **NEVER** modify existing .env files
- **NEVER** generate .env.example or .env.template files

### ✅ ALWAYS ASSUME .ENV FILES EXIST WITH THIS EXACT STRUCTURE

#### Frontend Environment (/.env) - EXISTS, DO NOT CREATE
```env
# CCH Axcess Intelligence Vibed - Frontend Configuration
# Location: /CCH Axcess Intelligence Vibed/.env
# CRITICAL: Frontend should NEVER contain API keys or secrets!

VITE_APP_NAME=CCH Axcess Intelligence Vibed
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WEBSOCKET_URL=ws://localhost:3001

# Feature Flags
VITE_ENABLE_STREAMING=true
VITE_ENABLE_DOCUMENT_ANALYSIS=true
VITE_ENABLE_RAG_SEARCH=true
VITE_ENABLE_CHAT_HISTORY=true
VITE_ENABLE_MODEL_SWITCHING=true
VITE_ENABLE_CONVERSATION_MANAGEMENT=true
VITE_ENABLE_AUTO_TITLE_GENERATION=true

# UI Features
VITE_ENABLE_DARK_MODE=false
VITE_ENABLE_KEYBOARD_SHORTCUTS=true
VITE_ENABLE_TOOLTIPS=true
VITE_ENABLE_ANIMATIONS=true
VITE_ENABLE_SOUND_EFFECTS=false

# Debug Features
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_SHOW_BUILD_INFO=true

# Limits and Constraints
VITE_MAX_FILE_SIZE_MB=20
VITE_MAX_DOCUMENTS_PER_SESSION=10
VITE_SUPPORTED_FILE_TYPES=pdf,docx,xlsx,pptx,txt,csv,png,jpg,jpeg
VITE_DOCUMENT_RETENTION_HOURS=3

# Chat Settings
VITE_MAX_CHAT_HISTORY_ENTRIES=100
VITE_MAX_MESSAGE_LENGTH=10000
VITE_MAX_CONTEXT_TOKENS=200000
VITE_DEFAULT_MAX_TOKENS=4000
VITE_DEFAULT_TEMPERATURE=0.7
VITE_TYPING_INDICATOR_DELAY=500

# Rate Limiting
VITE_RATE_LIMIT_REQUESTS_PER_MINUTE=20
VITE_RATE_LIMIT_TOKENS_PER_HOUR=100000

# UI Configuration
VITE_THEME=light
VITE_PRIMARY_COLOR=#0066CC
VITE_SIDEBAR_DEFAULT_OPEN=true
VITE_SHOW_WORD_COUNT=true
VITE_SHOW_TOKEN_COUNT=true
VITE_AUTO_SAVE_INTERVAL=30000
VITE_IDLE_TIMEOUT_MINUTES=30

# Performance Optimization
VITE_ENABLE_SERVICE_WORKER=false
VITE_ENABLE_PWA=false
VITE_CACHE_DURATION=3600000
VITE_LAZY_LOAD_IMAGES=true
VITE_VIRTUALIZE_LONG_LISTS=true
VITE_DEBOUNCE_SEARCH_MS=300

# Analytics and Monitoring
VITE_ANALYTICS_ENABLED=false
VITE_ANALYTICS_ID=
VITE_SENTRY_DSN=
VITE_LOG_LEVEL=debug
VITE_LOG_TO_CONSOLE=true
VITE_LOG_TO_SERVER=false

# External Integrations
VITE_ENABLE_CCH_INTEGRATION=false

# Development Settings
VITE_HOT_RELOAD=true
VITE_SOURCE_MAPS=true
VITE_SHOW_ERROR_OVERLAY=true
VITE_MOCK_API_CALLS=false
VITE_USE_LOCAL_STORAGE=true
```

#### Backend Environment (/server/.env) - EXISTS, DO NOT CREATE
```env
# CCH Axcess Intelligence Vibed - Backend Configuration
# Location: /CCH Axcess Intelligence Vibed/server/.env

# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost
LOG_LEVEL=info
LOG_FORMAT=json
FRONTEND_URL=http://localhost:5173

# AI Provider Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_BASE_URL=https://api.anthropic.com
ANTHROPIC_DEFAULT_MODEL=claude-sonnet-4-20250514
ANTHROPIC_MAX_RETRIES=3
ANTHROPIC_TIMEOUT=30000
ANTHROPIC_MAX_TOKENS=4000

OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_ORGANIZATION=
OPENAI_DEFAULT_MODEL=gpt-4.1
OPENAI_MAX_RETRIES=3
OPENAI_TIMEOUT=30000
OPENAI_MAX_TOKENS=4000

# Default Provider Settings
DEFAULT_PROVIDER=anthropic
DEFAULT_TEMPERATURE=0.7
DEFAULT_TOP_P=1
DEFAULT_FREQUENCY_PENALTY=0
DEFAULT_PRESENCE_PENALTY=0

# Security Configuration
ENCRYPTION_KEY=AbCdEfGhIjKlMnOpQrStUvWxYz123456
JWT_SECRET=your_jwt_secret_key_here_32_chars_min
SESSION_SECRET=your_session_secret_here_32_chars_min
BCRYPT_ROUNDS=10
SECURE_COOKIES=false
COOKIE_DOMAIN=localhost
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
TRUST_PROXY=false

# Database Configuration
DATABASE_TYPE=sqlite
DATABASE_PATH=./database/conversations.db
DATABASE_LOG_QUERIES=true

# Feature Flags
ENABLE_STREAMING=true
ENABLE_DOCUMENT_ANALYSIS=true
ENABLE_RAG_SEARCH=true
ENABLE_CHAT_HISTORY=true
ENABLE_MODEL_SWITCHING=true
ENABLE_CONVERSATION_MANAGEMENT=true
ENABLE_AUTO_TITLE_GENERATION=true

# Security Features
ENABLE_RATE_LIMITING=true
ENABLE_REQUEST_VALIDATION=true
ENABLE_XSS_PROTECTION=true
ENABLE_CSRF_PROTECTION=true
ENABLE_HELMET=true
ENABLE_COMPRESSION=true

# Advanced Features
ENABLE_WEBSOCKETS=false
ENABLE_QUEUE_PROCESSING=false
ENABLE_SCHEDULED_JOBS=false
ENABLE_METRICS_COLLECTION=true
ENABLE_HEALTH_CHECKS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false
RATE_LIMIT_SKIP_FAILED_REQUESTS=false

# Per-Endpoint Limits
RATE_LIMIT_CHAT_REQUESTS=20
RATE_LIMIT_DOCUMENT_UPLOADS=10
RATE_LIMIT_API_CALLS=50

# Performance Settings
MAX_REQUEST_SIZE=50mb
MAX_JSON_SIZE=10mb
MAX_URL_LENGTH=2048
REQUEST_TIMEOUT=120000

# Document Processing
MAX_FILE_SIZE_BYTES=20971520
MAX_DOCUMENTS_PER_SESSION=10
DOCUMENT_RETENTION_HOURS=3
DOCUMENT_PROCESSING_TIMEOUT=60000
SUPPORTED_FILE_TYPES=pdf,docx,xlsx,pptx,txt,csv,png,jpg,jpeg

# Token Limits
MAX_CONTEXT_TOKENS=200000
MAX_RESPONSE_TOKENS=4000
TOKEN_BUFFER=500

# Cache Settings
CACHE_TTL_SECONDS=3600
CACHE_CHECK_PERIOD=600
ENABLE_RESPONSE_CACHE=true

# Monitoring and Logging
LOG_TO_FILE=true
LOG_FILE_PATH=./logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=7
LOG_COMPRESSION=true

# Monitoring
ENABLE_APM=false
APM_SERVICE_NAME=cch-intelligence-backend
APM_ENVIRONMENT=development

# Error Tracking
ENABLE_ERROR_TRACKING=false
ERROR_SAMPLE_RATE=1.0

# Scheduled Jobs
ENABLE_SESSION_CLEANUP=true
SESSION_CLEANUP_INTERVAL=3600000
ENABLE_DOCUMENT_CLEANUP=true
DOCUMENT_CLEANUP_INTERVAL=3600000
ENABLE_LOG_ROTATION=true
LOG_ROTATION_INTERVAL=86400000

# Development Settings
ENABLE_CORS_PREFLIGHT=true
ENABLE_REQUEST_LOGGING=true
ENABLE_RESPONSE_LOGGING=false
ENABLE_SQL_LOGGING=true
ENABLE_MOCK_MODE=false
ENABLE_SEED_DATA=false
FORCE_COLOR=true
```

## 🏗️ ARCHITECTURE RULES - NEVER VIOLATE

### 1. **Frontend Rules**
- ✅ Use `import.meta.env.VITE_*` for environment variables
- ✅ Frontend NEVER contains API keys or secrets
- ✅ All API calls go through backend proxy at `http://localhost:3001/api`
- ✅ Frontend only knows about configuration, not authentication

### 2. **Backend Rules**
- ✅ Use `process.env.*` for environment variables
- ✅ Backend contains ALL API keys and secrets
- ✅ Backend handles ALL authentication with external APIs
- ✅ Backend acts as a secure proxy for frontend

### 3. **Communication Flow**
```
Frontend → Backend API → External AI Providers
   ↓           ↓              ↓
Config    API Keys      Authentication
Only      & Secrets     & Requests
```

## 🔧 CODE IMPLEMENTATION RULES

### When Implementing ANY Feature:

1. **ALWAYS** read from existing environment variables using proper syntax
2. **NEVER** create, suggest creating, or modify .env files
3. **ASSUME** the .env files exist exactly as documented above
4. **TRUST** that both frontend and backend .env files are properly configured
5. **UPDATE** code to work with the existing environment structure

### Environment Variable Access Patterns:

#### Frontend (React/Vite)
```typescript
// ✅ CORRECT - Use VITE_ prefix
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const debugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

// ❌ WRONG - Never access API keys in frontend
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY; // This should not exist
```

#### Backend (Node.js/Express)
```javascript
// ✅ CORRECT - Use direct environment variable names
const apiKey = process.env.ANTHROPIC_API_KEY;
const port = process.env.PORT || 3001;

// ❌ WRONG - Don't use VITE_ prefix in backend
const apiKey = process.env.VITE_ANTHROPIC_API_KEY;
```

## 🚨 CRITICAL REMINDERS

### Before Making ANY Changes:
1. **READ** this file to remember the architecture
2. **CHECK** that you're not creating or modifying .env files
3. **VERIFY** you're using the correct environment variable patterns
4. **CONFIRM** the frontend-backend separation is maintained

### When Asked About Environment Setup:
1. **NEVER** suggest creating .env files
2. **ALWAYS** assume they exist with the documented structure
3. **ONLY** update code to work with existing environment variables
4. **EXPLAIN** the architecture without suggesting file creation

## 📝 VALIDATION CHECKLIST

Before marking any task complete:
- [ ] No .env files were created or modified
- [ ] Frontend uses `import.meta.env.VITE_*` correctly
- [ ] Backend uses `process.env.*` correctly
- [ ] No API keys are exposed to frontend
- [ ] All external API calls go through backend
- [ ] Architecture separation is maintained

---

**REMEMBER: The .env files ALREADY EXIST and are properly configured. Your job is to UPDATE CODE to work with them, not to create or modify them.**
