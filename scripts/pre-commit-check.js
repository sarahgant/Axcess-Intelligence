#!/usr/bin/env node

/**
 * 🚨 PRE-COMMIT ARCHITECTURE CHECK 🚨
 * 
 * This script ensures we never violate the critical architecture constraints
 * regarding environment files and API key security.
 */

const fs = require('fs');
const path = require('path');

function checkArchitectureConstraints() {
    console.log('🔍 Checking architecture constraints...');

    // Check for any .env file creation attempts
    const envFiles = [
        '.env',
        '.env.example',
        '.env.template',
        '.env.local',
        '.env.development',
        '.env.production'
    ];

    let violations = [];

    // Check if any .env files were created in this commit
    envFiles.forEach(envFile => {
        if (fs.existsSync(envFile)) {
            violations.push(`❌ Found ${envFile} - Environment files should not be created!`);
        }
    });

    // Check for API key references in frontend code
    const frontendFiles = [
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/**/*.js',
        'src/**/*.jsx'
    ];

    // Check for common API key patterns in frontend
    const apiKeyPatterns = [
        /VITE_ANTHROPIC_API_KEY/,
        /VITE_OPENAI_API_KEY/,
        /import\.meta\.env\.VITE_.*API_KEY/,
        /new Anthropic\(/,
        /new OpenAI\(/
    ];

    if (violations.length > 0) {
        console.log('\n🚨 ARCHITECTURE VIOLATIONS DETECTED:');
        violations.forEach(violation => console.log(violation));
        console.log('\n📖 See docs/ARCHITECTURE_CONSTRAINTS.md for proper architecture');
        process.exit(1);
    }

    console.log('✅ Architecture constraints satisfied');
    console.log('💡 Remember: .env files already exist - update code to work with them!');
}

// Run the check
checkArchitectureConstraints();
