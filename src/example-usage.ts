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

/**
 * Initialize the application with configuration and prompts
 */
export async function initializeApplication() {
  try {
    console.log('🚀 Initializing CCH Axcess Intelligence...');

    // 1. Initialize configuration system
    const config = await initializeConfig();
    console.log('✅ Configuration loaded successfully');

    // 2. Initialize prompt registry
    const promptRegistry = initializePromptRegistry();
    console.log('✅ Prompt registry initialized');

    // 3. Validate setup
    const setupValidation = EnvHelper.validateEnvironmentSetup();
    if (!setupValidation.isValid) {
      console.warn('⚠️ Configuration issues found:', setupValidation.missingRequired);
    }

    // 4. Log configuration summary (in development)
    if (ConfigUtils.isDevelopment()) {
      console.log('🔧 Configuration Summary:', DevHelpers.getConfigSummary());
    }

    return { config, promptRegistry };
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    throw error;
  }
}

/**
 * Example: Using configuration utilities
 */
export function demonstrateConfigUsage() {
  console.log('\n📋 Configuration Usage Examples:');

  // Check if providers are configured
  const hasAnthropic = ConfigUtils.isProviderConfigured('anthropic');
  const hasOpenAI = ConfigUtils.isProviderConfigured('openai');
  console.log(`Anthropic configured: ${hasAnthropic}`);
  console.log(`OpenAI configured: ${hasOpenAI}`);

  // Get preferred provider
  const preferredProvider = ConfigUtils.getPreferredProvider();
  console.log(`Preferred provider: ${preferredProvider}`);

  // Check feature flags
  const streamingEnabled = ConfigUtils.isFeatureEnabled('enableStreaming');
  const ragEnabled = ConfigUtils.isFeatureEnabled('enableRAGSearch');
  console.log(`Streaming enabled: ${streamingEnabled}`);
  console.log(`RAG search enabled: ${ragEnabled}`);

  // Environment checks
  const isDev = ConfigUtils.isDevelopment();
  const debugMode = ConfigUtils.isDebugMode();
  console.log(`Development mode: ${isDev}`);
  console.log(`Debug mode: ${debugMode}`);
}

/**
 * Example: Working with prompt templates
 */
export function demonstratePromptUsage() {
  console.log('\n📝 Prompt Management Examples:');

  // Create a custom prompt
  const customPrompt = PromptBuilder.create()
    .id('example.custom')
    .name('Custom Example Prompt')
    .category('user')
    .template('Analyze the following tax scenario: {{scenario}}\n\nProvide guidance on {{focus}}.')
    .description('Custom prompt for tax scenario analysis')
    .author('developer')
    .tags('example', 'tax', 'analysis')
    .required('scenario', 'focus')
    .example(
      'Business Expense Analysis',
      'Analyze business meal expenses',
      {
        scenario: 'Client spent $5,000 on business meals in 2024',
        focus: 'deductibility and documentation requirements'
      }
    )
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

  console.log('✅ System prompt compiled:', systemPrompt.text.substring(0, 100) + '...');

  // Compile RAG search prompt
  const ragPrompt = PromptManager.compile(PROMPT_IDS.RAG_SEARCH, {
    query: 'business meal deduction limits for 2024',
    context: 'IRS allows 50% deduction for business meals that are directly related to business...',
    searchFocus: 'deduction limits',
    complianceYear: '2024'
  });

  console.log('✅ RAG prompt compiled:', ragPrompt.text.substring(0, 100) + '...');

  // Compile custom prompt
  const customCompiled = PromptManager.compile('example.custom', {
    scenario: 'A small business owner wants to understand home office deductions',
    focus: 'eligibility requirements and calculation methods'
  });

  console.log('✅ Custom prompt compiled:', customCompiled.text.substring(0, 100) + '...');
}

/**
 * Example: Advanced prompt features
 */
export function demonstrateAdvancedPromptFeatures() {
  console.log('\n🔧 Advanced Prompt Features:');

  const registry = initializePromptRegistry();

  // Search prompts by category
  const systemPrompts = PromptManager.byCategory('system');
  console.log(`Found ${systemPrompts.length} system prompts`);

  // Search prompts by tags
  const ragPrompts = PromptManager.byTags('rag', 'search');
  console.log(`Found ${ragPrompts.length} RAG prompts`);

  // Get registry statistics
  const stats = PromptManager.getStats();
  console.log('Registry stats:', {
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
    console.log('✅ Anthropic-specific prompt compiled');

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
    console.log('✅ OpenAI-specific prompt compiled');
  } catch (error) {
    console.log('ℹ️ Model-specific variants not available for this prompt');
  }
}

/**
 * Example: Configuration helpers for development
 */
export function demonstrateDevHelpers() {
  console.log('\n🛠️ Development Helper Examples:');

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

  console.log('📄 Generated .env file content (first 200 chars):');
  console.log(envContent.substring(0, 200) + '...');

  // Validate current setup
  const validation = DevHelpers.validateSetup();
  console.log('🔍 Setup validation:', {
    isValid: validation.isValid,
    missingCount: validation.missingRequired.length,
    warningCount: validation.warnings.length,
    suggestionCount: validation.suggestions.length
  });

  // Get setup instructions
  if (!validation.isValid) {
    console.log('📋 Setup instructions available via DevHelpers.getSetupInstructions()');
  }
}

/**
 * Example: Error handling and validation
 */
export function demonstrateErrorHandling() {
  console.log('\n⚠️ Error Handling Examples:');

  const registry = initializePromptRegistry();

  try {
    // Try to get a non-existent prompt
    PromptManager.get('non.existent.prompt');
  } catch (error) {
    console.log('✅ Caught expected error:', error.constructor.name);
  }

  try {
    // Try to compile with missing variables
    PromptManager.compile(PROMPT_IDS.CCH_SYSTEM, {
      userRole: 'Tax Professional'
      // Missing other required variables
    });
  } catch (error) {
    console.log('✅ Caught validation error:', error.constructor.name);
  }

  // Create an invalid prompt
  try {
    const invalidPrompt = PromptBuilder.create()
      .id('invalid.prompt')
      .name('Invalid Prompt')
      .template('Hello {{undeclaredVar}}!')
      .variables(['declaredVar']) // Mismatch
      .build();
    
    registry.register(invalidPrompt);
  } catch (error) {
    console.log('✅ Caught template validation error:', error.constructor.name);
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
    
    console.log('\n🎉 All examples completed successfully!');
  } catch (error) {
    console.error('\n❌ Example execution failed:', error);
  }
}

// Export for use in application
export {
  initializeApplication as default,
  initializeApplication,
  demonstrateConfigUsage,
  demonstratePromptUsage,
  demonstrateAdvancedPromptFeatures,
  demonstrateDevHelpers,
  demonstrateErrorHandling
};