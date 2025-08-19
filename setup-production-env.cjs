#!/usr/bin/env node

/**
 * Production Environment Setup Helper
 * Generates secure keys and provides Railway deployment checklist
 */

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function generateSecureKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function main() {
    console.log('\n🚀 CCH Axcess Intelligence - Production Setup\n');
    console.log('This script will help you set up environment variables for Railway deployment.\n');

    // Generate secure keys
    console.log('🔐 Generated Secure Keys:');
    console.log('═'.repeat(50));
    console.log(`ADMIN_KEY=${generateSecureKey()}`);
    console.log(`SESSION_SECRET=${generateSecureKey()}`);
    console.log(`JWT_SECRET=${generateSecureKey()}`);
    console.log('');

    // Get API keys from user
    console.log('🤖 AI Provider Setup:');
    console.log('═'.repeat(50));
    
    const anthropicKey = await askQuestion('Enter your Anthropic API key (or press Enter to skip): ');
    const openaiKey = await askQuestion('Enter your OpenAI API key (or press Enter to skip): ');
    
    console.log('\n📋 Complete Environment Variables for Railway:');
    console.log('═'.repeat(60));
    console.log('Copy and paste these into Railway → Variables tab:');
    console.log('');
    
    console.log('# Basic Configuration');
    console.log('NODE_ENV=production');
    console.log('PORT=3001');
    console.log('');
    
    console.log('# Security Keys (KEEP THESE SECRET!)');
    console.log(`ADMIN_KEY=${generateSecureKey()}`);
    console.log(`SESSION_SECRET=${generateSecureKey()}`);
    console.log(`JWT_SECRET=${generateSecureKey()}`);
    console.log('');
    
    console.log('# AI Provider Keys');
    if (anthropicKey.trim()) {
        console.log(`ANTHROPIC_API_KEY=${anthropicKey.trim()}`);
    } else {
        console.log('ANTHROPIC_API_KEY=your_anthropic_key_here');
    }
    
    if (openaiKey.trim()) {
        console.log(`OPENAI_API_KEY=${openaiKey.trim()}`);
    } else {
        console.log('OPENAI_API_KEY=your_openai_key_here');
    }
    console.log('');
    
    console.log('# Optional: Custom Domain');
    console.log('FRONTEND_URL=https://your-app-name.up.railway.app');
    console.log('');
    
    console.log('🎯 Railway Deployment Checklist:');
    console.log('═'.repeat(40));
    console.log('□ 1. Create Railway account at railway.app');
    console.log('□ 2. Push your code to GitHub');
    console.log('□ 3. Create new Railway project from GitHub repo');
    console.log('□ 4. Add environment variables above to Railway');
    console.log('□ 5. Wait for deployment to complete');
    console.log('□ 6. Test your app at the provided URL');
    console.log('');
    
    if (!anthropicKey.trim() || !openaiKey.trim()) {
        console.log('🔑 Don\'t have API keys yet?');
        console.log('═'.repeat(30));
        console.log('Anthropic (Claude): https://console.anthropic.com/');
        console.log('OpenAI (GPT): https://platform.openai.com/api-keys');
        console.log('Both offer $5 free credits to start!');
        console.log('');
    }
    
    console.log('✅ Setup complete! Your app will be live in ~5 minutes after deployment.');
    console.log('📖 Full guide: See RAILWAY_DEPLOYMENT.md');
    
    rl.close();
}

main().catch(console.error);
