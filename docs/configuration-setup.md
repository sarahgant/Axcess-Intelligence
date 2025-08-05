# CCH Axcess Intelligence Vibed - Configuration Setup Guide

## Overview

This guide will help you set up the centralized configuration and API management system for CCH Axcess Intelligence Vibed. The system provides type-safe configuration loading, environment variable management, and centralized prompt template management.

## Quick Start

### 1. Install Dependencies

The required dependencies are already installed:
- `zod` - Schema validation
- `dotenv` - Environment variable loading
- `@types/node` - Node.js type definitions

### 2. Create Environment File

Create a `.env` file in the project root with your API keys:

```bash
# CCH Axcess Intelligence Vibed - Environment Configuration
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

# ==========================================
# AI PROVIDER CONFIGURATION
# ==========================================

# Anthropic Claude API Configuration
# Get your API key from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_DEFAULT_MODEL=claude-sonnet-4-20250514

# OpenAI GPT API Configuration
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_DEFAULT_MODEL=gpt-4.1

# ==========================================
# SECURITY CONFIGURATION
# ==========================================

# Required: Encryption Key (must be 32+ characters)
ENCRYPTION_KEY=your_32_character_encryption_key_here

# ==========================================
# ENVIRONMENT CONFIGURATION
# ==========================================

NODE_ENV=development
LOG_LEVEL=info
```

### 3. Get Your API Keys

#### Anthropic Claude API
1. Visit https://console.anthropic.com/
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it as `ANTHROPIC_API_KEY` in your `.env` file

#### OpenAI GPT API
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in to your account
3. Click "Create new secret key"
4. Copy the key and paste it as `OPENAI_API_KEY` in your `.env` file

### 4. Generate Encryption Key

The system requires a secure encryption key. You can generate one using:

```javascript
// Run this in your browser console or Node.js
const key = Array.from({length: 32}, () => Math.random().toString(36).charAt(2)).join('');
console.log(key);
```

Or use this pre-generated key for development (replace for production):
```
AbCdEfGhIjKlMnOpQrStUvWxYz123456
```

## Advanced Configuration

### Full Environment Variables

```bash
# ==========================================
# AI PROVIDER CONFIGURATION
# ==========================================

# Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_DEFAULT_MODEL=claude-sonnet-4-20250514
ANTHROPIC_BASE_URL=# Optional: Custom endpoint

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORGANIZATION=# Optional: Organization ID
OPENAI_DEFAULT_MODEL=gpt-4.1
OPENAI_BASE_URL=# Optional: Custom endpoint

# ==========================================
# FEATURE FLAGS
# ==========================================

# AI Features
ENABLE_STREAMING=true
ENABLE_DOCUMENT_ANALYSIS=true
ENABLE_RAG_SEARCH=true
ENABLE_CHAT_HISTORY=true
ENABLE_DEBUG_MODE=false

# Limits and Timeouts
MAX_DOCUMENTS_PER_SESSION=10
MAX_CHAT_HISTORY_ENTRIES=100
DOCUMENT_RETENTION_HOURS=3

# ==========================================
# SECURITY CONFIGURATION
# ==========================================

# Encryption and Security
ENCRYPTION_KEY=your_32_character_encryption_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
ENABLE_CORS=true
RATE_LIMIT_PER_MINUTE=60

# ==========================================
# PERFORMANCE CONFIGURATION
# ==========================================

# Caching and Performance
CACHE_ENABLED=true
CACHE_TTL_MINUTES=30
ENABLE_SERVICE_WORKER=false
MAX_CONCURRENT_REQUESTS=5

# ==========================================
# ENVIRONMENT CONFIGURATION
# ==========================================

# Application Environment
NODE_ENV=development
LOG_LEVEL=info
```

## Usage Examples

### Initialize Configuration

```typescript
import { initializeConfig, getConfig } from './src/config';

// Initialize configuration on app startup
async function startApp() {
  try {
    const config = await initializeConfig();
    console.log('Configuration loaded successfully');
    
    // Now you can use getConfig() anywhere in your app
    const appConfig = getConfig();
    console.log('Using model:', appConfig.providers.anthropic.defaultModel);
  } catch (error) {
    console.error('Failed to load configuration:', error);
  }
}
```

### Using Configuration

```typescript
import { getConfig, ConfigUtils } from './src/config';

// Check if features are enabled
if (ConfigUtils.isFeatureEnabled('enableStreaming')) {
  // Enable streaming functionality
}

// Get provider configuration
const anthropicConfig = ConfigUtils.getProviderConfig('anthropic');
console.log('Using model:', anthropicConfig.defaultModel);

// Check environment
if (ConfigUtils.isDevelopment()) {
  console.log('Running in development mode');
}
```

### Prompt Management

```typescript
import { 
  initializePromptRegistry, 
  PromptManager, 
  PROMPT_IDS 
} from './src/prompts';

// Initialize prompt registry
const registry = initializePromptRegistry();

// Compile a prompt
const compiled = PromptManager.compile(PROMPT_IDS.CCH_SYSTEM, {
  userRole: 'Tax Professional',
  sessionType: 'Client Consultation',
  availableResources: 'CCH AnswerConnect',
  complianceYear: '2024'
});

console.log('Compiled prompt:', compiled.text);
```

## Configuration Validation

The system automatically validates your configuration on startup. If there are issues, you'll see helpful error messages:

### Common Validation Errors

1. **Missing API Keys**
   ```
   Configuration validation failed: providers.anthropic.apiKey: Anthropic API key is required
   ```
   **Solution**: Add your Anthropic API key to the `.env` file

2. **Invalid Encryption Key**
   ```
   Configuration validation failed: security.encryptionKey: Encryption key must be at least 32 characters long
   ```
   **Solution**: Generate a proper encryption key (see above)

3. **Invalid Environment Variables**
   ```
   Environment variable parsing warnings: [...]
   ```
   **Solution**: Check the format of your environment variables

## Environment-Specific Setup

### Development
```bash
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_DEBUG_MODE=true
CACHE_ENABLED=false
RATE_LIMIT_PER_MINUTE=120
```

### Production
```bash
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_DEBUG_MODE=false
CACHE_ENABLED=true
ENABLE_SERVICE_WORKER=true
RATE_LIMIT_PER_MINUTE=30
```

## Troubleshooting

### Configuration Not Loading
1. Check that your `.env` file is in the project root
2. Verify there are no syntax errors in your `.env` file
3. Ensure all required variables are set
4. Check the console for detailed error messages

### API Key Issues
1. Verify your API keys are valid and active
2. Check that you haven't exceeded rate limits
3. Ensure API keys don't have extra spaces or quotes
4. Test API keys with a simple request

### Performance Issues
1. Enable caching: `CACHE_ENABLED=true`
2. Adjust cache TTL: `CACHE_TTL_MINUTES=30`
3. Limit concurrent requests: `MAX_CONCURRENT_REQUESTS=3`

## Security Best Practices

1. **Never commit your `.env` file** - Add it to `.gitignore`
2. **Use strong encryption keys** - Generate random 32+ character keys
3. **Rotate API keys regularly** - Replace keys periodically
4. **Limit CORS origins** - Only allow necessary domains
5. **Monitor API usage** - Track usage to detect anomalies

## Support

For additional help:
1. Check the console for detailed error messages
2. Review the configuration schema in `src/config/schema.ts`
3. Use the development helpers in `src/config/index.ts`
4. Consult the API provider documentation

---

**Important**: Always keep your API keys secure and never share them publicly. The configuration system is designed to fail safely - if configuration is invalid, the application will not start rather than running with incorrect settings.