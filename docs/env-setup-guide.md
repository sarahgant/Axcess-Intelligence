# Environment Setup Guide

## 🚨 Current Issue: Environment Validation Errors

You're encountering environment validation errors because your `.env` file is missing required variables or contains invalid values. The error shows that numeric environment variables are being parsed as `NaN` (Not a Number).

## 🔧 Quick Fix

### Option 1: Automatic Setup (Recommended)
```bash
npm run setup:env
```

This will:
- Create a proper `.env` file with all required variables
- Use sensible defaults for all numeric values
- Back up your existing `.env` file if it exists

### Option 2: Manual Setup
1. Copy the example file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file and add your API keys:
   ```bash
   # Required: Add at least one API key
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   VITE_OPENAI_API_KEY=sk-your-openai-key-here
   ```

## 📋 Required Environment Variables

### Essential Variables (Must be set)
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_ANTHROPIC_API_KEY` | string | - | Anthropic API key |
| `VITE_OPENAI_API_KEY` | string | - | OpenAI API key |

### Optional Variables (Have defaults)
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_BASE_URL` | string | `http://localhost:3001` | Backend API URL |
| `VITE_API_TIMEOUT` | number | `5000` | API timeout in ms |
| `VITE_AI_PROVIDER` | string | `anthropic` | Preferred AI provider |
| `VITE_CORS_ORIGIN` | string | `http://localhost:5173` | CORS origin |
| `VITE_RATE_LIMIT_REQUESTS` | number | `100` | Rate limit requests |
| `VITE_RATE_LIMIT_WINDOW` | number | `60000` | Rate limit window (ms) |
| `VITE_ENABLE_LOGGING` | boolean | `true` | Enable logging |
| `VITE_ENABLE_MONITORING` | boolean | `false` | Enable monitoring |
| `VITE_ENABLE_CACHE` | boolean | `true` | Enable caching |
| `VITE_MAX_FILE_SIZE` | number | `20971520` | Max file size (20MB) |
| `VITE_MAX_CONCURRENT_REQUESTS` | number | `5` | Max concurrent requests |
| `VITE_CACHE_TTL` | number | `3600` | Cache TTL (seconds) |
| `VITE_DEBUG` | boolean | `false` | Debug mode |
| `VITE_RETRY_MAX_ATTEMPTS` | number | `3` | Max retry attempts |
| `VITE_RETRY_INITIAL_DELAY` | number | `1000` | Initial retry delay (ms) |
| `VITE_RETRY_MAX_DELAY` | number | `10000` | Max retry delay (ms) |
| `VITE_CIRCUIT_BREAKER_FAILURE_THRESHOLD` | number | `5` | Circuit breaker failure threshold |
| `VITE_CIRCUIT_BREAKER_RESET_TIMEOUT` | number | `60000` | Circuit breaker reset timeout (ms) |
| `VITE_CIRCUIT_BREAKER_SUCCESS_THRESHOLD` | number | `2` | Circuit breaker success threshold |

## 🔑 Getting API Keys

### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-`)

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-`)

## 🛠️ Troubleshooting

### Error: "Expected number, received nan"
This happens when:
- Environment variable is missing
- Environment variable is empty
- Environment variable contains non-numeric text

**Solution**: Use the automatic setup script or ensure all numeric variables have valid values.

### Error: "Invalid environment configuration"
This happens when:
- Required variables are missing
- Variables have invalid formats
- Validation fails

**Solution**: Check the `.env` file format and ensure all required variables are set.

### Error: "API key not found"
This happens when:
- No API keys are provided
- API keys are invalid

**Solution**: Add valid API keys to your `.env` file.

## 📝 Example .env File

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=5000

# AI Providers (Add your keys here)
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_AI_PROVIDER=anthropic

# Security Configuration
VITE_CORS_ORIGIN=http://localhost:5173
VITE_RATE_LIMIT_REQUESTS=100
VITE_RATE_LIMIT_WINDOW=60000

# Feature Flags
VITE_ENABLE_LOGGING=true
VITE_ENABLE_MONITORING=false
VITE_ENABLE_CACHE=true

# Performance Configuration
VITE_MAX_FILE_SIZE=20971520
VITE_MAX_CONCURRENT_REQUESTS=5
VITE_CACHE_TTL=3600

# Development Configuration
VITE_DEBUG=false

# Retry Configuration
VITE_RETRY_MAX_ATTEMPTS=3
VITE_RETRY_INITIAL_DELAY=1000
VITE_RETRY_MAX_DELAY=10000

# Circuit Breaker Configuration
VITE_CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
VITE_CIRCUIT_BREAKER_RESET_TIMEOUT=60000
VITE_CIRCUIT_BREAKER_SUCCESS_THRESHOLD=2
```

## 🚀 Next Steps

1. Run the setup script: `npm run setup:env`
2. Add your API keys to the `.env` file
3. Restart your development server: `npm run dev`
4. The application should now start without environment errors

## 🔍 Validation

After setup, you can verify your environment configuration by checking the console logs. You should see:
```
[INFO] Environment configuration loaded successfully
```

If you see any warnings about invalid values, they will be logged with the specific variable name and the default value being used.