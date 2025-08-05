#!/usr/bin/env node

/**
 * Test script for AI provider system
 * Tests both Anthropic and OpenAI providers if configured
 */

import { initializeConfig } from '../src/config/index.js';
import { initializeAIProviders, ChatUtils } from '../src/core/providers/index.js';

async function testAIProviders() {
  console.log('🧪 Testing AI Provider System\n');

  try {
    // Initialize configuration
    console.log('1. Initializing configuration...');
    await initializeConfig();
    console.log('✅ Configuration loaded\n');

    // Initialize AI providers
    console.log('2. Initializing AI providers...');
    const providerSystem = await initializeAIProviders();
    console.log(`✅ Initialized ${providerSystem.providers.length} providers: ${providerSystem.providers.join(', ')}\n`);

    // Test each provider
    for (const providerName of providerSystem.providers) {
      console.log(`3. Testing ${providerName}...`);
      
      try {
        const response = await ChatUtils.quickMessage(
          "Hello, what AI model are you? Please respond with just your model name.",
          providerName,
          { maxTokens: 50 }
        );
        
        console.log(`✅ ${providerName} response: ${response.trim()}\n`);
      } catch (error) {
        console.error(`❌ ${providerName} failed: ${error.message}\n`);
      }
    }

    console.log('🎉 AI Provider test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testAIProviders().catch(console.error);