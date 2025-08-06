/**
 * CCH Axcess Intelligence Vibed - Development Server Startup Script
 * 
 * This script handles:
 * 1. Port cleanup (kills processes on common development ports)
 * 2. Starting the Vite development server
 * 3. Optional backend server startup (when implemented)
 * 4. Colored console output for easy debugging
 * 5. Graceful shutdown handling
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  frontend: '\x1b[36m',   // Cyan
  backend: '\x1b[33m',    // Yellow
  error: '\x1b[31m',      // Red
  success: '\x1b[32m',    // Green
  info: '\x1b[34m',       // Blue
  warn: '\x1b[35m',       // Magenta
  reset: '\x1b[0m',       // Reset
  bold: '\x1b[1m',        // Bold
  dim: '\x1b[2m'          // Dim
};

// Configuration
const config = {
  ports: [3000, 3001, 5173, 8080, 5000],
  frontend: {
    command: 'npm',
    args: ['run', 'dev'],
    name: 'VITE DEV SERVER',
    color: colors.frontend
  },
  backend: {
    command: 'npm',
    args: ['run', 'server:dev'],
    name: 'BACKEND SERVER',
    color: colors.backend,
    enabled: true  // Backend is now implemented and ready
  }
};

let processes = [];

/**
 * Print formatted header
 */
function printHeader() {
  console.log(`${colors.bold}${colors.info}🚀 CCH Axcess Intelligence Vibed - Development Environment${colors.reset}`);
  console.log(`${colors.dim}================================================================${colors.reset}`);
  console.log('');
}

/**
 * Print formatted message with timestamp
 */
function logMessage(message, color = colors.reset, prefix = '') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${prefix}${color}${message}${colors.reset}`);
}

/**
 * Kill processes on specified ports (Windows PowerShell)
 */
function killPorts() {
  return new Promise((resolve, reject) => {
    logMessage('🧹 Cleaning up ports...', colors.warn);

    const scriptPath = path.join(__dirname, 'kill-ports.ps1');
    const portsArg = config.ports.join(',');

    // Check if PowerShell script exists
    if (!fs.existsSync(scriptPath)) {
      logMessage('⚠️  PowerShell script not found, using fallback method', colors.warn);
      resolve();
      return;
    }

    const killProcess = spawn('powershell', [
      '-ExecutionPolicy', 'Bypass',
      '-File', scriptPath,
      '-Ports', portsArg,
      '-Verbose'
    ], {
      stdio: 'inherit',
      shell: true
    });

    killProcess.on('close', (code) => {
      if (code === 0) {
        logMessage('✅ Ports cleaned successfully!', colors.success);
        resolve();
      } else {
        logMessage('⚠️  Port cleanup completed with warnings', colors.warn);
        resolve(); // Continue even if some ports couldn't be cleaned
      }
    });

    killProcess.on('error', (error) => {
      logMessage(`⚠️  Port cleanup error: ${error.message}`, colors.warn);
      resolve(); // Continue even if port cleanup fails
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      killProcess.kill();
      logMessage('⚠️  Port cleanup timed out, continuing...', colors.warn);
      resolve();
    }, 10000);
  });
}

/**
 * Start a service (frontend or backend)
 */
function startService(serviceConfig) {
  return new Promise((resolve, reject) => {
    logMessage(`🚀 Starting ${serviceConfig.name}...`, serviceConfig.color);

    const service = spawn(serviceConfig.command, serviceConfig.args, {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      windowsVerbatimArguments: false,
      env: {
        ...process.env,
        FORCE_COLOR: '1',
        NODE_ENV: 'development',
        PATH: process.env.PATH
      }
    });

    // Handle stdout with colored prefix
    service.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      lines.forEach(line => {
        // Avoid duplicate prefixes if the line already has them
        const cleanLine = line.replace(/^\[.*?\]\s*/, '');
        process.stdout.write(`${serviceConfig.color}[${serviceConfig.name}]${colors.reset} ${cleanLine}\n`);
      });
    });

    // Handle stderr with error coloring
    service.stderr.on('data', (data) => {
      const lines = data.toString().split('\n').filter(line => line.trim());
      lines.forEach(line => {
        // Don't treat warnings as errors for some common dev server messages
        const isWarning = line.includes('warning') || line.includes('deprecated');
        const color = isWarning ? colors.warn : colors.error;
        process.stderr.write(`${color}[${serviceConfig.name} ${isWarning ? 'WARN' : 'ERROR'}]${colors.reset} ${line}\n`);
      });
    });

    // Handle service startup
    service.on('spawn', () => {
      logMessage(`✅ ${serviceConfig.name} started successfully`, colors.success);
      processes.push(service);
      resolve(service);
    });

    // Handle service errors
    service.on('error', (error) => {
      logMessage(`❌ Failed to start ${serviceConfig.name}: ${error.message}`, colors.error);
      reject(error);
    });

    // Handle unexpected exit
    service.on('close', (code) => {
      if (code !== 0 && code !== null) {
        logMessage(`⚠️  ${serviceConfig.name} exited with code ${code}`, colors.warn);
      }
    });
  });
}

/**
 * Handle graceful shutdown
 */
function handleShutdown() {
  console.log(`\n${colors.warn}🛑 Shutting down development environment...${colors.reset}`);

  processes.forEach((process, index) => {
    if (process && !process.killed) {
      logMessage(`Stopping process ${index + 1}...`, colors.warn);
      process.kill('SIGTERM');

      // Force kill after 5 seconds if process doesn't respond
      setTimeout(() => {
        if (!process.killed) {
          process.kill('SIGKILL');
        }
      }, 5000);
    }
  });

  setTimeout(() => {
    logMessage('👋 Development environment stopped', colors.info);
    process.exit(0);
  }, 1000);
}

/**
 * Main startup sequence
 */
async function startDevelopment() {
  try {
    printHeader();

    // Step 1: Clean up ports
    await killPorts();
    console.log('');

    // Step 2: Start frontend (always)
    await startService(config.frontend);

    // Step 3: Start backend (if enabled)
    if (config.backend.enabled) {
      console.log('');
      await startService(config.backend);
    }

    console.log('');
    logMessage('🎉 Development environment is ready!', colors.success);
    logMessage('Frontend should be available at: http://localhost:5173', colors.info);
    if (config.backend.enabled) {
      logMessage('Backend should be available at: http://localhost:3001', colors.info);
    }
    logMessage('Press Ctrl+C to stop all services', colors.dim);

  } catch (error) {
    logMessage(`❌ Failed to start development environment: ${error.message}`, colors.error);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
process.on('SIGBREAK', handleShutdown); // Windows specific

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logMessage(`💥 Uncaught exception: ${error.message}`, colors.error);
  handleShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  logMessage(`💥 Unhandled rejection: ${reason}`, colors.error);
  handleShutdown();
});

// Start the development environment
startDevelopment();