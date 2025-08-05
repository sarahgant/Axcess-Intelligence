import { AppConfig } from './schema';
import { REQUIRED_ENV_VARS, OPTIONAL_ENV_VARS } from './defaults';

/**
 * Environment helper utilities for managing .env files and configuration
 */
export class EnvHelper {
  private static envContent: string = '';

  /**
   * Generate a complete .env file content with all configuration options
   */
  static generateEnvFile(config?: Partial<AppConfig>): string {
    const timestamp = new Date().toISOString();
    const encryptionKey = config?.security?.encryptionKey || this.generateEncryptionKey();

    const lines = [
      '# CCH Axcess Intelligence Vibed - Environment Configuration',
      `# Generated on: ${timestamp}`,
      '# DO NOT COMMIT THIS FILE TO VERSION CONTROL',
      '',
      '# ==========================================',
      '# AI PROVIDER CONFIGURATION',
      '# ==========================================',
      '',
      '# Anthropic Claude API Configuration',
      '# Get your API key from: https://console.anthropic.com/',
      `ANTHROPIC_API_KEY=${config?.providers?.anthropic?.apiKey || 'your_anthropic_api_key_here'}`,
      `ANTHROPIC_DEFAULT_MODEL=${config?.providers?.anthropic?.defaultModel || 'claude-sonnet-4-20250514'}`,
      `ANTHROPIC_BASE_URL=${config?.providers?.anthropic?.baseUrl || '# Optional: Custom Anthropic API endpoint'}`,
      '',
      '# OpenAI GPT API Configuration',
      '# Get your API key from: https://platform.openai.com/api-keys',
      `OPENAI_API_KEY=${config?.providers?.openai?.apiKey || 'your_openai_api_key_here'}`,
      `OPENAI_ORGANIZATION=${config?.providers?.openai?.organization || '# Optional: Your OpenAI organization ID'}`,
      `OPENAI_DEFAULT_MODEL=${config?.providers?.openai?.defaultModel || 'gpt-4.1'}`,
      `OPENAI_BASE_URL=${config?.providers?.openai?.baseUrl || '# Optional: Custom OpenAI API endpoint'}`,
      '',
      '# ==========================================',
      '# FEATURE FLAGS',
      '# ==========================================',
      '',
      '# AI Features',
      `ENABLE_STREAMING=${config?.features?.enableStreaming ?? true}`,
      `ENABLE_DOCUMENT_ANALYSIS=${config?.features?.enableDocumentAnalysis ?? true}`,
      `ENABLE_RAG_SEARCH=${config?.features?.enableRAGSearch ?? true}`,
      `ENABLE_CHAT_HISTORY=${config?.features?.enableChatHistory ?? true}`,
      `ENABLE_DEBUG_MODE=${config?.features?.enableDebugMode ?? false}`,
      '',
      '# Limits and Timeouts',
      `MAX_DOCUMENTS_PER_SESSION=${config?.features?.maxDocumentsPerSession || 10}`,
      `MAX_CHAT_HISTORY_ENTRIES=${config?.features?.maxChatHistoryEntries || 100}`,
      `DOCUMENT_RETENTION_HOURS=${config?.features?.documentRetentionHours || 3}`,
      '',
      '# ==========================================',
      '# SECURITY CONFIGURATION',
      '# ==========================================',
      '',
      '# Encryption and Security',
      `ENCRYPTION_KEY=${encryptionKey}`,
      `ALLOWED_ORIGINS=${config?.security?.allowedOrigins?.join(',') || 'http://localhost:3000,http://localhost:5173'}`,
      `ENABLE_CORS=${config?.security?.enableCORS ?? true}`,
      `RATE_LIMIT_PER_MINUTE=${config?.security?.rateLimitPerMinute || 60}`,
      '',
      '# ==========================================',
      '# PERFORMANCE CONFIGURATION',
      '# ==========================================',
      '',
      '# Caching and Performance',
      `CACHE_ENABLED=${config?.performance?.cacheEnabled ?? true}`,
      `CACHE_TTL_MINUTES=${config?.performance?.cacheTTLMinutes || 30}`,
      `ENABLE_SERVICE_WORKER=${config?.performance?.enableServiceWorker ?? false}`,
      `MAX_CONCURRENT_REQUESTS=${config?.performance?.maxConcurrentRequests || 5}`,
      '',
      '# ==========================================',
      '# ENVIRONMENT CONFIGURATION',
      '# ==========================================',
      '',
      '# Application Environment',
      `NODE_ENV=${config?.environment || 'development'}`,
      `LOG_LEVEL=${config?.logLevel || 'info'}`,
      '',
      '# ==========================================',
      '# NOTES',
      '# ==========================================',
      '# - Replace placeholder values with your actual API keys',
      '# - Keep this file secure and never commit it to version control',
      '# - Restart your development server after making changes',
      '# - Use different .env files for different environments',
      '',
    ];

    this.envContent = lines.join('\n');
    return this.envContent;
  }

  /**
   * Generate a minimal .env file with only required values
   */
  static generateMinimalEnvFile(): string {
    const encryptionKey = this.generateEncryptionKey();

    const lines = [
      '# CCH Axcess Intelligence Vibed - Minimal Configuration',
      '# Add your API keys below and restart the server',
      '',
      '# Required: Anthropic API Key',
      'ANTHROPIC_API_KEY=your_anthropic_api_key_here',
      'ANTHROPIC_DEFAULT_MODEL=claude-sonnet-4-20250514',
      '',
      '# Required: OpenAI API Key',
      'OPENAI_API_KEY=your_openai_api_key_here',
      'OPENAI_DEFAULT_MODEL=gpt-4.1',
      '',
      '# Required: Encryption Key (generated)',
      `ENCRYPTION_KEY=${encryptionKey}`,
      '',
      '# Environment',
      'NODE_ENV=development',
      '',
    ];

    return lines.join('\n');
  }

  /**
   * Generate setup instructions for the .env file
   */
  static getSetupInstructions(): string {
    return `
=== CCH Axcess Intelligence Vibed - Environment Setup ===

📋 SETUP INSTRUCTIONS:

1. 🔑 GET YOUR API KEYS:
   • Anthropic Claude: https://console.anthropic.com/
   • OpenAI GPT: https://platform.openai.com/api-keys

2. 📁 CREATE .env FILE:
   • Create a new file named ".env" in your project root
   • Copy the generated configuration below
   • Replace placeholder values with your actual API keys

3. 🔄 UPDATE YOUR CONFIGURATION:
   • Replace "your_anthropic_api_key_here" with your Anthropic API key
   • Replace "your_openai_api_key_here" with your OpenAI API key
   • Adjust other settings as needed

4. 🚀 RESTART YOUR SERVER:
   • Stop your development server (Ctrl+C)
   • Run: npm run dev
   • Your application will now use the new configuration

⚠️  SECURITY NOTES:
   • Never commit your .env file to version control
   • The .env file should be listed in your .gitignore
   • Keep your API keys secure and rotate them regularly

📄 .env FILE CONTENT:
${this.envContent}

✅ VERIFICATION:
   • Your application will show configuration errors if setup is incorrect
   • Check the browser console for configuration validation messages
   • All API keys should be at least 20 characters long

🔧 TROUBLESHOOTING:
   • If you see "Configuration not loaded" errors, check your .env file
   • Ensure the .env file is in the project root directory
   • Verify there are no extra spaces or quotes around your API keys
   • Check that your API keys are valid and active

==================================================
    `;
  }

  /**
   * Get update instructions when configuration changes
   */
  static getUpdateInstructions(): string {
    return `
=== Configuration Update Required ===

Your .env file needs to be updated with the latest configuration.

📋 UPDATE STEPS:
1. Locate your .env file in the project root
2. Replace its contents with the configuration shown above
3. Save the file
4. Restart your development server: npm run dev

⚡ Quick Update Command:
You can copy the generated configuration and paste it into your .env file.

🔍 What Changed:
• Updated configuration structure
• New feature flags available  
• Enhanced security options
• Performance optimizations

=====================================
    `;
  }

  /**
   * Validate current environment setup
   */
  static validateEnvironmentSetup(): {
    isValid: boolean;
    missingRequired: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const missing: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check required environment variables
    for (const envVar of REQUIRED_ENV_VARS) {
      const envVars = typeof window !== 'undefined' ? import.meta.env : process.env;
    const value = envVars[envVar];
      if (!value || value.trim() === '' || value.includes('your_') || value.includes('_here')) {
        missing.push(envVar);
      }
    }

    // Check for common issues
    const envVars = typeof window !== 'undefined' ? import.meta.env : process.env;
    
    if (envVars.ANTHROPIC_API_KEY && envVars.ANTHROPIC_API_KEY.length < 20) {
      warnings.push('Anthropic API key appears to be too short');
    }

    if (envVars.OPENAI_API_KEY && envVars.OPENAI_API_KEY.length < 20) {
      warnings.push('OpenAI API key appears to be too short');
    }

    if (envVars.VITE_ENCRYPTION_KEY && envVars.VITE_ENCRYPTION_KEY.length < 32) {
      warnings.push('Encryption key should be at least 32 characters long');
    }

    // Suggestions for optimization
    if (!envVars.VITE_ENABLE_STREAMING) {
      suggestions.push('Consider enabling VITE_ENABLE_STREAMING for better user experience');
    }

    if (!envVars.VITE_ENABLE_RAG_SEARCH) {
      suggestions.push('Enable VITE_ENABLE_RAG_SEARCH for document intelligence features');
    }

    if (envVars.VITE_APP_ENVIRONMENT === 'production' && envVars.VITE_ENABLE_DEBUG_MODE === 'true') {
      warnings.push('Debug mode is enabled in production environment');
    }

    return {
      isValid: missing.length === 0,
      missingRequired: missing,
      warnings,
      suggestions
    };
  }

  /**
   * Generate a cryptographically secure encryption key
   */
  static generateEncryptionKey(): string {
    // Generate a 32-character alphanumeric key
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Create a sample config.json file for local overrides
   */
  static generateLocalConfigTemplate(): string {
    return JSON.stringify({
      environment: 'development',
      features: {
        enableDebugMode: true,
        enableStreaming: true
      },
      security: {
        rateLimitPerMinute: 120
      },
      performance: {
        cacheEnabled: false
      }
    }, null, 2);
  }

  /**
   * Get environment-specific recommendations
   */
  static getEnvironmentRecommendations(environment: string): string[] {
    const recommendations: string[] = [];

    switch (environment) {
      case 'development':
        recommendations.push(
          'Enable debug mode for detailed logging',
          'Disable caching for immediate updates',
          'Use higher rate limits for testing',
          'Consider using test API keys'
        );
        break;

      case 'staging':
        recommendations.push(
          'Use production-like settings',
          'Enable caching for performance testing',
          'Test with realistic rate limits',
          'Validate all security features'
        );
        break;

      case 'production':
        recommendations.push(
          'Disable debug mode',
          'Enable all security features',
          'Use appropriate rate limits',
          'Enable service worker for performance',
          'Monitor API key usage',
          'Set up proper logging and monitoring'
        );
        break;
    }

    return recommendations;
  }
}