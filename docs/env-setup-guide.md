# Environment Setup Guide

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Get your AI provider API keys:**
   - **Anthropic Claude**: Visit [console.anthropic.com](https://console.anthropic.com/) 
   - **OpenAI GPT**: Visit [platform.openai.com](https://platform.openai.com/)

3. **Edit your `.env` file** with your actual API keys:
   ```bash
   # Required: At least one provider
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   OPENAI_API_KEY=sk-your-actual-openai-key-here
   
   # Required: 32-character encryption key
   VITE_ENCRYPTION_KEY=your-32-character-encryption-key-12345
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

## Environment Template

Create a `.env` file in your project root with the following content:

```bash
# CCH Axcess Intelligence Vibed - Environment Configuration

# =================================
# AI Provider Configuration
# =================================

# Anthropic Claude API Configuration
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
ANTHROPIC_DEFAULT_MODEL=claude-3-sonnet-20240229

# OpenAI GPT API Configuration  
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_DEFAULT_MODEL=gpt-4-turbo-preview

# =================================
# Application Configuration
# =================================

# Environment
VITE_APP_ENVIRONMENT=development

# Security Configuration (32 characters required)
VITE_ENCRYPTION_KEY=your-32-character-encryption-key-12345

# Feature Flags
VITE_ENABLE_STREAMING=true
VITE_ENABLE_DOCUMENT_ANALYSIS=true
VITE_ENABLE_RAG_SEARCH=true
VITE_ENABLE_CHAT_HISTORY=true
VITE_ENABLE_DEBUG_MODE=true

# Performance Settings
VITE_MAX_DOCUMENTS_PER_SESSION=10
VITE_DOCUMENT_RETENTION_HOURS=3

# Logging Level (debug, info, warn, error)
VITE_LOG_LEVEL=debug
```

## API Key Setup Instructions

### Anthropic Claude

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-`)
6. Add it to your `.env` file as `ANTHROPIC_API_KEY`

### OpenAI GPT

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in to your account  
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)
6. Add it to your `.env` file as `OPENAI_API_KEY`

## Configuration Options

### Required Settings

- **At least one AI provider API key** (Anthropic or OpenAI)
- **VITE_ENCRYPTION_KEY**: Must be exactly 32 characters long

### Optional Settings

- **Provider Models**: Choose specific models for each provider
- **Feature Flags**: Enable/disable specific features
- **Performance Settings**: Adjust caching, limits, and timeouts
- **Security Settings**: Configure CORS, rate limiting, etc.

## Troubleshooting

### Common Issues

1. **"No AI provider available"**
   - Check that you have a valid API key for at least one provider
   - Verify the API key format is correct
   - Check your internet connection

2. **"Encryption key must be at least 32 characters"**
   - Generate a 32+ character encryption key
   - Use: `openssl rand -base64 32` or an online generator

3. **"AI system is still initializing"**
   - Wait a few seconds for the system to start up
   - Check browser console for detailed error messages
   - Verify API keys are valid

### Testing Your Setup

1. Start the application: `npm run dev`
2. Open your browser to `http://localhost:3000`
3. Look for the AI status indicator in the disclaimer area
4. Try sending a test message: "Hello, what AI model are you?"
5. Switch between providers using the AI provider dropdown

## Security Notes

- **Never commit your `.env` file** to version control
- **Keep your API keys secure** and don't share them
- **Rotate API keys periodically** for security
- **Use environment-specific configurations** for different deployments

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your `.env` file configuration
3. Test your API keys directly with the provider APIs
4. Review the application logs in the development console