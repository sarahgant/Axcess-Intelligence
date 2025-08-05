#!/usr/bin/env node

/**
 * CCH Axcess Intelligence Vibed - Enhanced Cross-Platform Development Startup
 * 
 * This script provides a robust, cross-platform development environment startup system:
 * 1. Kills processes on configured ports
 * 2. Clears terminal/console 
 * 3. Starts development server with proper environment
 * 4. Provides colored output and error handling
 * 5. Works on Windows, macOS, and Linux
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Import port configuration (fallback if TypeScript config not available)
let PORTS;
try {
  // Try to load from TypeScript config (compiled)
  PORTS = require('../src/config/ports.ts');
} catch {
  // Fallback configuration
  PORTS = {
    frontend: 5173,
    backend: 3001,
    websocket: 3002,
    preview: 4173,
    cleanup: [5173, 3001, 3002, 4173, 3000, 5000, 8080, 8000]
  };
}

// Colors for cross-platform terminal output
const colors = {
  // Standard colors
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

// Semantic color mappings
const semantic = {
  success: colors.green,
  error: colors.red,
  warning: colors.yellow,
  info: colors.blue,
  highlight: colors.cyan,
  dim: colors.dim,
  bold: colors.bright,
};

// Configuration
const config = {
  ports: PORTS.cleanup || [5173, 3001, 3002, 4173, 3000, 5000, 8080, 8000],
  primaryPort: PORTS.frontend || 5173,
  backendPort: PORTS.backend || 3001,
  maxRetries: 3,
  retryDelay: 1000,
  startupTimeout: 30000,
  platform: os.platform(),
  isWindows: os.platform() === 'win32',
  isDarwin: os.platform() === 'darwin',
  isLinux: os.platform() === 'linux',
};

let processes = [];
let isShuttingDown = false;

/**
 * Clear the terminal/console
 */
function clearTerminal() {
  if (config.isWindows) {
    process.stdout.write('\x1B[2J\x1B[0f');
  } else {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
  }
}

/**
 * Print a formatted log message with timestamp and color
 */
function log(message, color = semantic.info, prefix = '') {
  const timestamp = new Date().toLocaleTimeString();
  const timestampStr = `${colors.dim}[${timestamp}]${colors.reset}`;
  const prefixStr = prefix ? `${prefix} ` : '';
  console.log(`${timestampStr} ${prefixStr}${color}${message}${colors.reset}`);
}

/**
 * Print application header
 */
function printHeader() {
  console.log(`${semantic.bold}${semantic.highlight}🚀 CCH Axcess Intelligence Vibed - Clean Development Startup${colors.reset}`);
  console.log(`${colors.dim}=${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.dim}Platform: ${config.platform} | Primary Port: ${config.primaryPort} | Backend Port: ${config.backendPort}${colors.reset}`);
  console.log('');
}

/**
 * Execute a shell command and return a promise
 */
function execCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, { ...options, encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      }
    });
  });
}

/**
 * Kill a process by PID with cross-platform support
 */
async function killProcessByPid(pid, processName = 'Unknown') {
  try {
    const killCommand = config.isWindows 
      ? `taskkill /F /PID ${pid}`
      : `kill -9 ${pid}`;
    
    await execCommand(killCommand);
    log(`✅ Killed process: ${processName} (PID: ${pid})`, semantic.success);
    return true;
  } catch (error) {
    log(`⚠️  Failed to kill process ${pid}: ${error.error?.message || 'Unknown error'}`, semantic.warning);
    return false;
  }
}

/**
 * Find processes using a specific port (cross-platform)
 */
async function findProcessesByPort(port) {
  try {
    let command;
    
    if (config.isWindows) {
      // Windows: Use netstat to find processes
      command = `netstat -ano | findstr :${port}`;
    } else if (config.isDarwin) {
      // macOS: Use lsof
      command = `lsof -ti:${port}`;
    } else {
      // Linux: Use netstat or ss
      command = `ss -tulpn | grep :${port} || netstat -tulpn | grep :${port}`;
    }

    const result = await execCommand(command);
    const processes = [];

    if (config.isWindows) {
      // Parse Windows netstat output
      const lines = result.stdout.split('\n').filter(line => line.trim());
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid)) {
            try {
              const processInfo = await execCommand(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
              const processName = processInfo.stdout.split(',')[0]?.replace(/"/g, '') || 'Unknown';
              processes.push({ pid: parseInt(pid), name: processName });
            } catch {
              processes.push({ pid: parseInt(pid), name: 'Unknown' });
            }
          }
        }
      }
    } else if (config.isDarwin) {
      // Parse macOS lsof output
      const pids = result.stdout.split('\n').filter(line => line.trim());
      for (const pidStr of pids) {
        const pid = parseInt(pidStr);
        if (!isNaN(pid)) {
          try {
            const processInfo = await execCommand(`ps -p ${pid} -o comm=`);
            processes.push({ pid, name: processInfo.stdout || 'Unknown' });
          } catch {
            processes.push({ pid, name: 'Unknown' });
          }
        }
      }
    } else {
      // Parse Linux ss/netstat output
      const lines = result.stdout.split('\n').filter(line => line.trim());
      for (const line of lines) {
        const pidMatch = line.match(/pid=(\d+)/);
        if (pidMatch) {
          const pid = parseInt(pidMatch[1]);
          try {
            const processInfo = await execCommand(`ps -p ${pid} -o comm=`);
            processes.push({ pid, name: processInfo.stdout || 'Unknown' });
          } catch {
            processes.push({ pid, name: 'Unknown' });
          }
        }
      }
    }

    return processes;
  } catch (error) {
    // No processes found or command failed
    return [];
  }
}

/**
 * Kill all processes using configured ports
 */
async function killPorts() {
  log('🧹 Cleaning up development ports...', semantic.warning);
  
  let totalKilled = 0;
  const portResults = [];

  for (const port of config.ports) {
    try {
      log(`Checking port ${port}...`, semantic.info);
      const processes = await findProcessesByPort(port);
      
      if (processes.length === 0) {
        log(`✅ Port ${port} is free`, semantic.success);
        portResults.push({ port, status: 'free', killed: 0 });
        continue;
      }

      log(`Found ${processes.length} process(es) on port ${port}`, semantic.warning);
      let killedCount = 0;

      for (const process of processes) {
        const success = await killProcessByPid(process.pid, process.name);
        if (success) {
          killedCount++;
          totalKilled++;
        }
      }

      portResults.push({ port, status: 'cleaned', killed: killedCount });
      
      // Wait a bit for processes to fully terminate
      if (killedCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

    } catch (error) {
      log(`⚠️  Error checking port ${port}: ${error.message || 'Unknown error'}`, semantic.warning);
      portResults.push({ port, status: 'error', killed: 0 });
    }
  }

  // Summary
  console.log('');
  log('📊 Port cleanup summary:', semantic.info);
  portResults.forEach(result => {
    const icon = result.status === 'free' ? '✅' : result.status === 'cleaned' ? '🧹' : '⚠️';
    const statusColor = result.status === 'free' ? semantic.success : 
                       result.status === 'cleaned' ? semantic.warning : semantic.error;
    log(`   ${icon} Port ${result.port}: ${result.status} (${result.killed} killed)`, statusColor);
  });
  
  if (totalKilled > 0) {
    log(`🎯 Successfully killed ${totalKilled} process(es)`, semantic.success);
  } else {
    log('🎉 All ports were already free!', semantic.success);
  }
  
  return totalKilled;
}

/**
 * Check if Node.js development dependencies are available
 */
async function checkDependencies() {
  log('🔍 Checking development dependencies...', semantic.info);
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found. Are you in the project root?');
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const hasVite = packageJson.dependencies?.vite || packageJson.devDependencies?.vite;
    
    if (!hasVite) {
      throw new Error('Vite not found in dependencies. Run "npm install" first.');
    }
    
    log('✅ Dependencies look good', semantic.success);
    return true;
  } catch (error) {
    throw new Error(`Failed to check dependencies: ${error.message}`);
  }
}

/**
 * Start the development server
 */
function startDevelopmentServer() {
  return new Promise((resolve, reject) => {
    log('🚀 Starting Vite development server...', semantic.highlight);
    
    const viteProcess = spawn('npm', ['run', 'dev'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: 'development',
        FORCE_COLOR: '1',
        PORT: config.primaryPort.toString(),
      },
    });

    let serverStarted = false;
    let startupTimer;

    // Handle startup timeout
    startupTimer = setTimeout(() => {
      if (!serverStarted) {
        log('⏰ Server startup timed out', semantic.error);
        viteProcess.kill();
        reject(new Error('Development server startup timed out'));
      }
    }, config.startupTimeout);

    // Handle stdout
    viteProcess.stdout.on('data', (data) => {
      const output = data.toString();
      const lines = output.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        // Check for server ready indicators
        if (line.includes('Local:') || line.includes('http://localhost') || line.includes('ready in')) {
          if (!serverStarted) {
            serverStarted = true;
            clearTimeout(startupTimer);
            log('✅ Development server started successfully!', semantic.success);
            resolve(viteProcess);
          }
        }
        
        // Color code different types of output
        let color = colors.reset;
        if (line.includes('error') || line.includes('Error')) {
          color = semantic.error;
        } else if (line.includes('warn') || line.includes('Warning')) {
          color = semantic.warning;
        } else if (line.includes('http://')) {
          color = semantic.highlight;
        }
        
        process.stdout.write(`${semantic.dim}[VITE]${colors.reset} ${color}${line}${colors.reset}\n`);
      });
    });

    // Handle stderr
    viteProcess.stderr.on('data', (data) => {
      const output = data.toString();
      const lines = output.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        const isWarning = line.includes('warning') || line.includes('deprecated');
        const color = isWarning ? semantic.warning : semantic.error;
        const prefix = isWarning ? 'WARN' : 'ERROR';
        
        process.stderr.write(`${semantic.error}[VITE ${prefix}]${colors.reset} ${color}${line}${colors.reset}\n`);
      });
    });

    // Handle process events
    viteProcess.on('spawn', () => {
      log('📡 Vite process spawned successfully', semantic.info);
      processes.push(viteProcess);
    });

    viteProcess.on('error', (error) => {
      clearTimeout(startupTimer);
      log(`❌ Failed to start development server: ${error.message}`, semantic.error);
      reject(error);
    });

    viteProcess.on('close', (code) => {
      clearTimeout(startupTimer);
      if (code !== 0 && code !== null && !isShuttingDown) {
        log(`💥 Development server exited with code ${code}`, semantic.error);
        reject(new Error(`Development server exited with code ${code}`));
      }
    });
  });
}

/**
 * Handle graceful shutdown
 */
function handleShutdown(signal = 'SIGINT') {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n${semantic.warning}🛑 Received ${signal}, shutting down gracefully...${colors.reset}`);
  
  processes.forEach((process, index) => {
    if (process && !process.killed) {
      log(`Stopping process ${index + 1}...`, semantic.warning);
      
      // Try graceful shutdown first
      process.kill('SIGTERM');
      
      // Force kill after 5 seconds if process doesn't respond
      setTimeout(() => {
        if (!process.killed) {
          log(`Force killing process ${index + 1}...`, semantic.error);
          process.kill('SIGKILL');
        }
      }, 5000);
    }
  });

  setTimeout(() => {
    log('👋 Development environment stopped. Thank you!', semantic.info);
    process.exit(0);
  }, 1000);
}

/**
 * Display final startup information
 */
function displayStartupInfo() {
  console.log('');
  log('🎉 Development environment is ready!', semantic.success);
  log(`📱 Frontend: ${semantic.highlight}http://localhost:${config.primaryPort}${colors.reset}`, semantic.info);
  log(`🔧 Backend: ${semantic.dim}http://localhost:${config.backendPort} (when implemented)${colors.reset}`, semantic.info);
  log(`💻 Platform: ${config.platform}`, semantic.info);
  console.log('');
  log('Press Ctrl+C to stop all services', semantic.dim);
  console.log('');
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Clear terminal for clean output
    clearTerminal();
    
    // Print header
    printHeader();

    // Step 1: Check dependencies
    await checkDependencies();
    console.log('');

    // Step 2: Kill processes on development ports
    await killPorts();
    console.log('');

    // Step 3: Start development server
    await startDevelopmentServer();

    // Step 4: Display final information
    displayStartupInfo();

  } catch (error) {
    console.log('');
    log(`❌ Startup failed: ${error.message}`, semantic.error);
    
    if (error.message.includes('npm install')) {
      log('💡 Try running: npm install', semantic.info);
    } else if (error.message.includes('port')) {
      log('💡 Try manually killing processes or restarting your terminal', semantic.info);
    }
    
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
if (config.isWindows) {
  process.on('SIGBREAK', () => handleShutdown('SIGBREAK'));
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`💥 Uncaught exception: ${error.message}`, semantic.error);
  handleShutdown('EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  log(`💥 Unhandled rejection: ${reason}`, semantic.error);
  handleShutdown('REJECTION');
});

// Start the application
if (require.main === module) {
  main();
}

module.exports = {
  main,
  killPorts,
  startDevelopmentServer,
  config,
  colors,
  semantic,
};