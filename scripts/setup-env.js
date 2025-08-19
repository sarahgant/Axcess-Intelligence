#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup script to create a proper .env file with default values
 */
function setupEnvironment() {
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), 'env.example');

    console.log('🔧 Setting up environment configuration...');

    // Check if .env already exists
    if (fs.existsSync(envPath)) {
        console.log('⚠️  .env file already exists. Creating backup...');
        const backupPath = path.join(process.cwd(), '.env.backup');
        fs.copyFileSync(envPath, backupPath);
        console.log(`✅ Backup created at: ${backupPath}`);
    }

    // Read the example file
    if (!fs.existsSync(envExamplePath)) {
        console.error('❌ env.example file not found!');
        process.exit(1);
    }

    const envExample = fs.readFileSync(envExamplePath, 'utf8');

    // Create the .env file with example content
    fs.writeFileSync(envPath, envExample);

    console.log('✅ .env file created successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Edit the .env file and add your API keys:');
    console.log('   - VITE_ANTHROPIC_API_KEY=your_anthropic_key_here');
    console.log('   - VITE_OPENAI_API_KEY=your_openai_key_here');
    console.log('');
    console.log('2. Update any other settings as needed');
    console.log('');
    console.log('3. Restart your development server');
    console.log('');
    console.log('🔑 API Key Setup:');
    console.log('- Anthropic: https://console.anthropic.com/');
    console.log('- OpenAI: https://platform.openai.com/api-keys');
    console.log('');
    console.log('💡 All numeric values have sensible defaults and will work out of the box!');
}

// Run the setup
setupEnvironment();
