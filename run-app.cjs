#!/usr/bin/env node

/**
 * CCH Axcess Intelligence Vibed - Application Runner
 * 
 * This is the main entry point for running the application.
 * When Cursor or any IDE asks to "run the app", this script will:
 * 1. Kill any processes on development ports
 * 2. Start the development server cleanly
 * 
 * This script simply delegates to our clean startup system.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CCH Axcess Intelligence Vibed...');
console.log('🔧 Using clean startup process...');
console.log('');

// Run the clean startup script
const startupScript = path.join(__dirname, 'scripts', 'start-clean.cjs');
const child = spawn('node', [startupScript], {
    stdio: 'inherit',
    shell: true,
    env: {
        ...process.env,
        NODE_ENV: 'development',
        FORCE_COLOR: '1'
    }
});

// Handle process events
child.on('error', (error) => {
    console.error(`❌ Failed to start application: ${error.message}`);
    process.exit(1);
});

child.on('close', (code) => {
    if (code !== 0) {
        console.error(`❌ Application exited with code ${code}`);
        process.exit(code);
    }
});

// Handle shutdown signals
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down application...');
    child.kill('SIGINT');
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Terminating application...');
    child.kill('SIGTERM');
});