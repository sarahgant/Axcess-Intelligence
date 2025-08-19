/**
 * Example usage of the Configuration and Prompt Management System
 * This file demonstrates how to use the newly implemented systems
 */

import {
  initializeConfig,
  getConfig,
  ConfigUtils,
  EnvHelper,
  DevHelpers
} from './config';

import {
  initializePromptRegistry,
  PromptManager,
  PromptBuilder,
  PromptUtils,
  PROMPT_IDS
} from './prompts';

import { logger } from './core/logging/logger';

/**
 * Initialize the application with configuration and prompts
 */
export async function initializeApplication() {
  try {
    logger.info('🚀 Initializing CCH Axcess Intelligence...');

    // 1. Initialize configuration system
    const config = await initializeConfig();
    logger.info('✅ Configuration loaded successfully');

    // 2. Initialize prompt registry
    const promptRegistry = initializePromptRegistry();
    logger.info('✅ Prompt registry initialized');

    // 3. Validate setup
    const setupValidation = EnvHelper.validateEnvironmentSetup();
    if (!setupValidation.isValid) {
      logger.warn('⚠️ Configuration issues found', { missingRequired: setupValidation.missingRequired });
    }

    // 4. Log configuration summary (in development)
    if (ConfigUtils.isDevelopment()) {
      const configSummary = DevHelpers.getConfigSummary();
      logger.info('🔧 Configuration Summary', configSummary as any);
    }

    return { config, promptRegistry };
  } catch (error) {
    logger.error('❌ Failed to initialize application', { error: String(error) });
    throw error;
  }
}

/**
 * Example: Using configuration utilities
 */
export function demonstrateConfigUsage() {
  logger.info('📋 Configuration Usage Examples:');

  // Check if providers are configured
  const hasAnthropic = ConfigUtils.isProviderConfigured('anthropic');
  const hasOpenAI = ConfigUtils.isProviderConfigured('openai');
  logger.info('Provider configuration status', { anthropic: hasAnthropic, openai: hasOpenAI });

  // Get preferred provider
  const preferredProvider = ConfigUtils.getPreferredProvider();
  logger.info('Preferred provider', { provider: preferredProvider });

  // Check feature flags
  const streamingEnabled = ConfigUtils.isFeatureEnabled('enableStreaming');
  const ragEnabled = ConfigUtils.isFeatureEnabled('enableRAGSearch');
  logger.info('Feature flags status', { streaming: streamingEnabled, ragSearch: ragEnabled });

  // Environment checks
  const isDev = ConfigUtils.isDevelopment();
  const debugMode = ConfigUtils.isDebugMode();
  logger.info('Environment status', { development: isDev, debug: debugMode });
}

/**
 * Example: Working with prompt templates
 */
export function demonstratePromptUsage() {
  logger.info('📝 Prompt Management Examples:');

  // Create a custom prompt
  const customPrompt = PromptBuilder.create()
    .id('example.custom')
    .name('Custom Example Prompt')
    .category('user')
    .template('Analyze the following tax scenario: {{scenario}}\n\nProvide guidance on {{focus}}.')
    .metadata({ author: 'developer', tags: ['example', 'tax', 'analysis'] })
    .validation({ required: ['scenario', 'focus'] })
    .examples({
      name: 'Business Expense Analysis',
      description: 'Analyze business meal expenses',
      variables: {
        scenario: 'Client spent $5,000 on business meals in 2024',
        focus: 'deductibility and documentation requirements'
      }
    })
    .build();

  // Register the custom prompt
  const registry = initializePromptRegistry();
  registry.register(customPrompt);

  // Compile built-in system prompt
  const systemPrompt = PromptManager.compile(PROMPT_IDS.CCH_SYSTEM, {
    userRole: 'Senior Tax Consultant',
    sessionType: 'Client Advisory',
    availableResources: 'CCH AnswerConnect, IRS Publications',
    complianceYear: '2024'
  });

  logger.info('✅ System prompt compiled', { text: systemPrompt.text.substring(0, 100) + '...' });

  // Compile RAG search prompt
  const ragPrompt = PromptManager.compile(PROMPT_IDS.RAG_SEARCH, {
    query: 'business meal deduction limits for 2024',
    context: 'IRS allows 50% deduction for business meals that are directly related to business...',
    searchFocus: 'deduction limits',
    complianceYear: '2024'
  });

  logger.info('✅ RAG prompt compiled', { text: ragPrompt.text.substring(0, 100) + '...' });

  // Compile custom prompt
  const customCompiled = PromptManager.compile('example.custom', {
    scenario: 'A small business owner wants to understand home office deductions',
    focus: 'eligibility requirements and calculation methods'
  });

  logger.info('✅ Custom prompt compiled', { text: customCompiled.text.substring(0, 100) + '...' });
}

/**
 * Example: Advanced prompt features
 */
export function demonstrateAdvancedPromptFeatures() {
  logger.info('🔧 Advanced Prompt Features:');

  const registry = initializePromptRegistry();

  // Search prompts by category
  const systemPrompts = PromptManager.byCategory('system');
  logger.info(`Found ${systemPrompts.length} system prompts`);

  // Search prompts by tags
  const ragPrompts = PromptManager.byTags('rag', 'search');
  logger.info(`Found ${ragPrompts.length} RAG prompts`);

  // Get registry statistics
  const stats = PromptManager.getStats();
  logger.info('Registry stats', {
    totalPrompts: stats.totalPrompts,
    categories: Object.keys(stats.categories),
    mostUsed: stats.mostUsed.slice(0, 3) // Top 3
  });

  // Test model-specific compilation
  try {
    const anthropicPrompt = PromptManager.compile(
      PROMPT_IDS.CCH_SYSTEM,
      {
        userRole: 'Tax Professional',
        sessionType: 'Consultation',
        availableResources: 'CCH Database',
        complianceYear: '2024'
      },
      'anthropic'
    );
    logger.info('✅ Anthropic-specific prompt compiled');

    const openaiPrompt = PromptManager.compile(
      PROMPT_IDS.CCH_SYSTEM,
      {
        userRole: 'Tax Professional',
        sessionType: 'Consultation',
        availableResources: 'CCH Database',
        complianceYear: '2024'
      },
      'openai'
    );
    logger.info('✅ OpenAI-specific prompt compiled');
  } catch (error) {
    logger.info('ℹ️ Model-specific variants not available for this prompt');
  }
}

/**
 * Example: Configuration helpers for development
 */
export function demonstrateDevHelpers() {
  logger.info('🛠️ Development Helper Examples:');

  // Generate .env file content
  const envContent = DevHelpers.generateEnvFile({
    providers: {
      anthropic: {
        apiKey: 'your-anthropic-key',
        defaultModel: 'claude-3-sonnet-20240229'
      },
      openai: {
        apiKey: 'your-openai-key',
        defaultModel: 'gpt-4-turbo-preview'
      }
    },
    features: {
      enableStreaming: true,
      enableDebugMode: true
    }
  });

  logger.info('📄 Generated .env file content (first 200 chars)', { content: envContent.substring(0, 200) + '...' });

  // Validate current setup
  const validation = DevHelpers.validateSetup();
  logger.info('🔍 Setup validation', {
    isValid: validation.isValid,
    missingCount: validation.missingRequired.length,
    warningCount: validation.warnings.length,
    suggestionCount: validation.suggestions.length
  });

  // Get setup instructions
  if (!validation.isValid) {
    logger.info('📋 Setup instructions available via DevHelpers.getSetupInstructions()');
  }
}

/**
 * Example: Error handling and validation
 */
export function demonstrateErrorHandling() {
  logger.info('⚠️ Error Handling Examples:');

  const registry = initializePromptRegistry();

  try {
    // Try to get a non-existent prompt
    PromptManager.get('non.existent.prompt');
  } catch (error) {
    logger.info('✅ Caught expected error', { errorType: error instanceof Error ? error.constructor.name : 'Unknown' });
  }

  try {
    // Try to compile with missing variables
    PromptManager.compile(PROMPT_IDS.CCH_SYSTEM, {
      userRole: 'Tax Professional'
      // Missing other required variables
    });
  } catch (error) {
    logger.info('✅ Caught validation error', { errorType: error instanceof Error ? error.constructor.name : 'Unknown' });
  }

  // Create an invalid prompt
  try {
    const invalidPrompt = PromptBuilder.create()
      .id('invalid.prompt')
      .name('Invalid Prompt')
      .template('Hello {{undeclaredVar}}!')
      .variables('declaredVar') // Fix: pass as individual arguments
      .build();

    registry.register(invalidPrompt);
  } catch (error) {
    logger.info('✅ Caught template validation error', { errorType: error instanceof Error ? error.constructor.name : 'Unknown' });
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  try {
    await initializeApplication();
    demonstrateConfigUsage();
    demonstratePromptUsage();
    demonstrateAdvancedPromptFeatures();
    demonstrateDevHelpers();
    demonstrateErrorHandling();

    logger.info('🎉 All examples completed successfully!');
  } catch (error) {
    logger.error('❌ Example execution failed', { error: String(error) });
  }
}

// Default export
export default initializeApplication;