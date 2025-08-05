#!/usr/bin/env node

/**
 * CCH Axcess Intelligence Vibed - Port Checker Utility
 * 
 * This script checks what services are running on development ports
 * and provides detailed information about each process.
 */

const { exec } = require('child_process');
const os = require('os');

// Import port configuration
let PORTS;
try {
  PORTS = require('../src/config/ports.ts');
} catch {
  PORTS = {
    frontend: 5173,
    backend: 3001,
    websocket: 3002,
    preview: 4173,
    cleanup: [5173, 3001, 3002, 4173, 3000, 5000, 8080, 8000]
  };
}

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const platform = os.platform();
const isWindows = platform === 'win32';
const isDarwin = platform === 'darwin';

/**
 * Execute a command and return result
 */
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        resolve({ error, stdout: '', stderr });
      } else {
        resolve({ stdout: stdout.trim(), stderr: stderr.trim(), error: null });
      }
    });
  });
}

/**
 * Get service name for port
 */
function getServiceName(port) {
  const services = {
    [PORTS.frontend || 5173]: 'Frontend (Vite)',
    [PORTS.backend || 3001]: 'Backend (Express)',
    [PORTS.websocket || 3002]: 'WebSocket Server',
    [PORTS.preview || 4173]: 'Preview (Vite)',
    3000: 'React Dev Server (Legacy)',
    5000: 'Node.js Server',
    8080: 'Development Server',
    8000: 'Alternative Dev Server',
  };
  
  return services[port] || `Unknown Service`;
}

/**
 * Get process information for a port
 */
async function getPortInfo(port) {
  try {
    let command;
    
    if (isWindows) {
      command = `netstat -ano | findstr :${port}`;
    } else if (isDarwin) {
      command = `lsof -ti:${port}`;
    } else {
      command = `ss -tulpn | grep :${port} || netstat -tulpn | grep :${port}`;
    }

    const result = await execCommand(command);
    
    if (result.error && result.stdout === '') {
      return {
        port,
        status: 'free',
        service: getServiceName(port),
        processes: []
      };
    }

    const processes = [];

    if (isWindows) {
      const lines = result.stdout.split('\n').filter(line => line.trim());
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid)) {
            try {
              const processResult = await execCommand(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
              const processData = processResult.stdout.split(',');
              const processName = processData[0]?.replace(/"/g, '') || 'Unknown';
              const memoryUsage = processData[4]?.replace(/"/g, '').replace(/,/g, '') || 'Unknown';
              
              processes.push({
                pid: parseInt(pid),
                name: processName,
                memory: memoryUsage,
                command: processName
              });
            } catch {
              processes.push({
                pid: parseInt(pid),
                name: 'Unknown',
                memory: 'Unknown',
                command: 'Unknown'
              });
            }
          }
        }
      }
    } else if (isDarwin) {
      const pids = result.stdout.split('\n').filter(line => line.trim());
      for (const pidStr of pids) {
        const pid = parseInt(pidStr);
        if (!isNaN(pid)) {
          try {
            const processResult = await execCommand(`ps -p ${pid} -o pid,ppid,comm,args,pmem,pcpu`);
            const lines = processResult.stdout.split('\n');
            if (lines.length > 1) {
              const data = lines[1].trim().split(/\s+/);
              processes.push({
                pid,
                name: data[2] || 'Unknown',
                memory: data[4] ? `${data[4]}%` : 'Unknown',
                cpu: data[5] ? `${data[5]}%` : 'Unknown',
                command: lines[1].substring(lines[1].indexOf(data[3]) || 0) || 'Unknown'
              });
            }
          } catch {
            processes.push({
              pid,
              name: 'Unknown',
              memory: 'Unknown',
              cpu: 'Unknown',
              command: 'Unknown'
            });
          }
        }
      }
    } else {
      // Linux
      const lines = result.stdout.split('\n').filter(line => line.trim());
      for (const line of lines) {
        const pidMatch = line.match(/pid=(\d+)/);
        if (pidMatch) {
          const pid = parseInt(pidMatch[1]);
          try {
            const processResult = await execCommand(`ps -p ${pid} -o pid,ppid,comm,args,pmem,pcpu --no-headers`);
            const data = processResult.stdout.trim().split(/\s+/);
            processes.push({
              pid,
              name: data[2] || 'Unknown',
              memory: data[4] ? `${data[4]}%` : 'Unknown',
              cpu: data[5] ? `${data[5]}%` : 'Unknown',
              command: processResult.stdout.substring(processResult.stdout.indexOf(data[3]) || 0) || 'Unknown'
            });
          } catch {
            processes.push({
              pid,
              name: 'Unknown',
              memory: 'Unknown',
              cpu: 'Unknown',
              command: 'Unknown'
            });
          }
        }
      }
    }

    return {
      port,
      status: processes.length > 0 ? 'occupied' : 'free',
      service: getServiceName(port),
      processes
    };

  } catch (error) {
    return {
      port,
      status: 'error',
      service: getServiceName(port),
      processes: [],
      error: error.message
    };
  }
}

/**
 * Format process information for display
 */
function formatProcessInfo(process) {
  const parts = [
    `PID: ${process.pid}`,
    `Name: ${process.name}`,
  ];
  
  if (process.memory && process.memory !== 'Unknown') {
    parts.push(`Memory: ${process.memory}`);
  }
  
  if (process.cpu && process.cpu !== 'Unknown') {
    parts.push(`CPU: ${process.cpu}`);
  }
  
  return parts.join(' | ');
}

/**
 * Print colored output
 */
function printColored(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Print header
 */
function printHeader() {
  console.log('');
  printColored('🔍 CCH Axcess Intelligence Vibed - Port Status Checker', colors.cyan + colors.bright);
  printColored('='.repeat(65), colors.dim);
  printColored(`Platform: ${platform} | Checking ${(PORTS.cleanup || []).length} ports`, colors.dim);
  console.log('');
}

/**
 * Main function
 */
async function main() {
  printHeader();
  
  const portsToCheck = PORTS.cleanup || [5173, 3001, 3002, 4173, 3000, 5000, 8080, 8000];
  const results = [];
  
  printColored('Scanning ports...', colors.yellow);
  console.log('');
  
  // Check all ports
  for (const port of portsToCheck) {
    const info = await getPortInfo(port);
    results.push(info);
  }
  
  // Sort results: occupied first, then by port number
  results.sort((a, b) => {
    if (a.status === 'occupied' && b.status !== 'occupied') return -1;
    if (a.status !== 'occupied' && b.status === 'occupied') return 1;
    return a.port - b.port;
  });
  
  // Display results
  const occupiedPorts = results.filter(r => r.status === 'occupied');
  const freePorts = results.filter(r => r.status === 'free');
  const errorPorts = results.filter(r => r.status === 'error');
  
  if (occupiedPorts.length > 0) {
    printColored('🚨 OCCUPIED PORTS:', colors.red + colors.bright);
    console.log('');
    
    occupiedPorts.forEach(portInfo => {
      printColored(`  Port ${portInfo.port} - ${portInfo.service}`, colors.red);
      
      portInfo.processes.forEach(process => {
        printColored(`    • ${formatProcessInfo(process)}`, colors.yellow);
        if (process.command && process.command !== 'Unknown' && process.command !== process.name) {
          printColored(`      Command: ${process.command}`, colors.dim);
        }
      });
      console.log('');
    });
  }
  
  if (freePorts.length > 0) {
    printColored('✅ FREE PORTS:', colors.green + colors.bright);
    console.log('');
    
    freePorts.forEach(portInfo => {
      printColored(`  Port ${portInfo.port} - ${portInfo.service}`, colors.green);
    });
    console.log('');
  }
  
  if (errorPorts.length > 0) {
    printColored('⚠️  ERRORS:', colors.yellow + colors.bright);
    console.log('');
    
    errorPorts.forEach(portInfo => {
      printColored(`  Port ${portInfo.port} - ${portInfo.service}`, colors.yellow);
      printColored(`    Error: ${portInfo.error}`, colors.dim);
    });
    console.log('');
  }
  
  // Summary
  printColored('📊 SUMMARY:', colors.cyan + colors.bright);
  printColored(`  Total ports checked: ${results.length}`, colors.white);
  printColored(`  Occupied: ${occupiedPorts.length}`, occupiedPorts.length > 0 ? colors.red : colors.green);
  printColored(`  Free: ${freePorts.length}`, colors.green);
  if (errorPorts.length > 0) {
    printColored(`  Errors: ${errorPorts.length}`, colors.yellow);
  }
  
  console.log('');
  
  if (occupiedPorts.length > 0) {
    printColored('💡 To clean these ports, run:', colors.blue);
    printColored('   npm run clean', colors.white);
    printColored('   # or', colors.dim);
    printColored('   npm run start:clean', colors.white);
  } else {
    printColored('🎉 All development ports are free! Ready to start development.', colors.green);
  }
  
  console.log('');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = { main, getPortInfo, getServiceName };