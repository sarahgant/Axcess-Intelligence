# 🚨 BACKEND ARCHITECTURE REMINDER

## ENVIRONMENT FILES ALREADY EXIST - DO NOT CREATE OR MODIFY THEM!

### Backend Environment (/server/.env) - EXISTS, DO NOT CREATE
- **Location**: `/CCH Axcess Intelligence Vibed/server/.env`
- **Purpose**: All API keys and secrets
- **Access Pattern**: `process.env.*`

### Frontend Environment (/.env) - EXISTS, DO NOT CREATE
- **Location**: `/CCH Axcess Intelligence Vibed/.env`
- **Purpose**: Configuration only, NO API keys or secrets
- **Access Pattern**: `import.meta.env.VITE_*`

## 🏗️ ARCHITECTURE RULES

### ✅ CORRECT Backend Patterns:
```javascript
// ✅ Use direct environment variable names
const apiKey = process.env.ANTHROPIC_API_KEY;
const port = process.env.PORT || 3001;

// ✅ Handle all external API authentication
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

### ❌ WRONG Backend Patterns:
```javascript
// ❌ Don't use VITE_ prefix in backend
const apiKey = process.env.VITE_ANTHROPIC_API_KEY;

// ❌ Don't expose API keys to frontend
res.json({ apiKey: process.env.ANTHROPIC_API_KEY });
```

## 🔒 SECURITY RESPONSIBILITIES

1. **API Key Management**: Backend handles ALL API keys
2. **Authentication**: Backend authenticates with external APIs
3. **Proxy Role**: Backend acts as secure proxy for frontend
4. **Request Validation**: Backend validates all incoming requests
5. **Rate Limiting**: Backend enforces rate limits

## 📖 Complete Details
See [docs/ARCHITECTURE_CONSTRAINTS.md](../../docs/ARCHITECTURE_CONSTRAINTS.md) for complete architecture documentation.

---

**REMEMBER: Backend contains all secrets, frontend only gets configuration!**
