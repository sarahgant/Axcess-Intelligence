# 🚨 FRONTEND ARCHITECTURE REMINDER

## ENVIRONMENT FILES ALREADY EXIST - DO NOT CREATE OR MODIFY THEM!

### Frontend Environment (/.env) - EXISTS, DO NOT CREATE
- **Location**: `/CCH Axcess Intelligence Vibed/.env`
- **Purpose**: Configuration only, NO API keys or secrets
- **Access Pattern**: `import.meta.env.VITE_*`

### Backend Environment (/server/.env) - EXISTS, DO NOT CREATE  
- **Location**: `/CCH Axcess Intelligence Vibed/server/.env`
- **Purpose**: All API keys and secrets
- **Access Pattern**: `process.env.*`

## 🏗️ ARCHITECTURE RULES

### ✅ CORRECT Frontend Patterns:
```typescript
// ✅ Use VITE_ prefix for configuration
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const debugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

// ✅ All API calls go through backend proxy
const response = await fetch(`${apiUrl}/chat`, { ... });
```

### ❌ WRONG Frontend Patterns:
```typescript
// ❌ Never access API keys in frontend
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

// ❌ Never make direct AI provider calls
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: ... });
```

## 📖 Complete Details
See [docs/ARCHITECTURE_CONSTRAINTS.md](../../docs/ARCHITECTURE_CONSTRAINTS.md) for complete architecture documentation.

---

**REMEMBER: Update code to work with existing environment variables, don't create new ones!**
