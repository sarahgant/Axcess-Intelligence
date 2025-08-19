#!/usr/bin/env node

/**
 * Test script for AI provider system
 * Tests both Anthropic and OpenAI providers if configured
 */

import { initializeConfig } from '../src/config/index.js';
import { initializeAIProviders, ChatUtils } from '../src/core/providers/index.js';

// Simple logger for scripts
const logger = {
  info: (message, data = '') => console.log(`[INFO] ${message}`, data),
  success: (message, data = '') => console.log(`[SUCCESS] ${message}`, data),
  error: (message, data = '') => console.log(`[ERROR] ${message}`, data)
};

async function testAIProviders() {
  logger.info('🧪 Testing AI Provider System\n');

  try {
    // Initialize configuration
    logger.info('1. Initializing configuration...');
    await initializeConfig();
    logger.success('✅ Configuration loaded\n');

    // Initialize AI providers
    logger.info('2. Initializing AI providers...');
    const providerSystem = await initializeAIProviders();
    logger.success(`✅ Initialized ${providerSystem.providers.length} providers: ${providerSystem.providers.join(', ')}\n`);

    // Test each provider
    for (const providerName of providerSystem.providers) {
      logger.info(`3. Testing ${providerName}...`);

      try {
        const response = await ChatUtils.quickMessage(
          "Hello, what AI model are you? Please respond with just your model name.",
          providerName,
          { maxTokens: 50 }
        );

        logger.success(`✅ ${providerName} response: ${response.trim()}\n`);
      } catch (error) {
        logger.error(`❌ ${providerName} failed: ${error.message}\n`);
      }
    }

    logger.success('🎉 AI Provider test completed!');

  } catch (error) {
    logger.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testAIProviders().catch(console.error);