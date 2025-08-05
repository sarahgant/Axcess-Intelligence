#!/usr/bin/env node

/**
 * CCH Axcess Intelligence Vibed - Fresh Installation Script
 * 
 * This script performs a complete clean installation:
 * 1. Backs up important files (.env, etc.)
 * 2. Removes node_modules and lock files
 * 3. Clears npm cache
 * 4. Reinstalls all dependencies
 * 5. Restores backed up files
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const os = require('os');

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

const isWindows = os.platform() === 'win32';

// Configuration
const config = {
  filesToBackup: ['.env', '.env.local', '.env.development'],
  filesToRemove: ['node_modules', 'package-lock.json', 'yarn.lock', '.next', 'dist', 'build'],
  backupDir: '.backup-fresh-install',
  maxBackups: 5,
};

/**
 * Print colored output with timestamp
 */
function log(message, color = colors.white, prefix = '') {
  const timestamp = new Date().toLocaleTimeString();
  const timestampStr = `${colors.dim}[${timestamp}]${colors.reset}`;
  const prefixStr = prefix ? `${prefix} ` : '';
  console.log(`${timestampStr} ${prefixStr}${color}${message}${colors.reset}`);
}

/**
 * Print header
 */
function printHeader() {
  console.clear();
  console.log('');
  log('🧹 CCH Axcess Intelligence Vibed - Fresh Installation', colors.cyan + colors.bright);
  log('='.repeat(65), colors.dim);
  log(`Platform: ${os.platform()} | Working Directory: ${process.cwd()}`, colors.dim);
  console.log('');
}

/**
 * Execute a command and return promise
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
 * Check if we're in a valid project directory
 */
function validateProjectDirectory() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const srcPath = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found. Are you in the project root?');
  }
  
  if (!fs.existsSync(srcPath)) {
    throw new Error('src directory not found. Are you in the project root?');
  }
  
  log('✅ Project directory validated', colors.green);
}

/**
 * Create backup directory with timestamp
 */
function createBackupDirectory() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const backupPath = path.join(config.backupDir, `backup-${timestamp}-${Date.now()}`);
  
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
  }
  
  fs.mkdirSync(backupPath, { recursive: true });
  
  log(`📁 Created backup directory: ${backupPath}`, colors.blue);
  return backupPath;
}

/**
 * Backup important files
 */
function backupFiles(backupPath) {
  log('💾 Backing up important files...', colors.yellow);
  
  const backedUpFiles = [];
  
  for (const fileName of config.filesToBackup) {
    const filePath = path.join(process.cwd(), fileName);
    
    if (fs.existsSync(filePath)) {
      const backupFilePath = path.join(backupPath, fileName);
      
      try {
        // Ensure backup subdirectories exist
        const backupFileDir = path.dirname(backupFilePath);
        if (!fs.existsSync(backupFileDir)) {
          fs.mkdirSync(backupFileDir, { recursive: true });
        }
        
        fs.copyFileSync(filePath, backupFilePath);
        backedUpFiles.push(fileName);
        log(`  ✅ Backed up: ${fileName}`, colors.green);
      } catch (error) {
        log(`  ⚠️  Failed to backup ${fileName}: ${error.message}`, colors.yellow);
      }
    } else {
      log(`  ℹ️  File not found: ${fileName}`, colors.dim);
    }
  }
  
  if (backedUpFiles.length === 0) {
    log('  📝 No files needed backup', colors.dim);
  } else {
    log(`📦 Successfully backed up ${backedUpFiles.length} file(s)`, colors.green);
  }
  
  return backedUpFiles;
}

/**
 * Remove files and directories
 */
async function removeFiles() {
  log('🗑️  Removing old installation files...', colors.yellow);
  
  const removedItems = [];
  
  for (const item of config.filesToRemove) {
    const itemPath = path.join(process.cwd(), item);
    
    if (fs.existsSync(itemPath)) {
      try {
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          // Remove directory
          if (isWindows) {
            await execCommand(`rmdir /s /q "${itemPath}"`);
          } else {
            await execCommand(`rm -rf "${itemPath}"`);
          }
          log(`  🗂️  Removed directory: ${item}`, colors.green);
        } else {
          // Remove file
          fs.unlinkSync(itemPath);
          log(`  📄 Removed file: ${item}`, colors.green);
        }
        
        removedItems.push(item);
      } catch (error) {
        log(`  ⚠️  Failed to remove ${item}: ${error.message}`, colors.yellow);
      }
    } else {
      log(`  ℹ️  Not found: ${item}`, colors.dim);
    }
  }
  
  if (removedItems.length === 0) {
    log('  📝 No files needed removal', colors.dim);
  } else {
    log(`🗑️  Successfully removed ${removedItems.length} item(s)`, colors.green);
  }
  
  return removedItems;
}

/**
 * Clear npm cache
 */
async function clearNpmCache() {
  log('🧽 Clearing npm cache...', colors.yellow);
  
  try {
    const result = await execCommand('npm cache clean --force');
    log('✅ npm cache cleared successfully', colors.green);
    return true;
  } catch (error) {
    log(`⚠️  npm cache clear failed: ${error.error?.message || 'Unknown error'}`, colors.yellow);
    log('  This is usually not critical, continuing...', colors.dim);
    return false;
  }
}

/**
 * Install dependencies with progress monitoring
 */
function installDependencies() {
  return new Promise((resolve, reject) => {
    log('📦 Installing dependencies...', colors.cyan);
    log('  This may take several minutes...', colors.dim);
    
    const npmProcess = spawn('npm', ['install'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: {
        ...process.env,
        FORCE_COLOR: '1',
      },
    });

    let hasError = false;
    let installationComplete = false;

    // Handle stdout
    npmProcess.stdout.on('data', (data) => {
      const output = data.toString();
      const lines = output.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        // Filter out noisy npm output
        if (line.includes('added') || line.includes('found') || line.includes('audited')) {
          if (line.includes('packages in')) {
            installationComplete = true;
            log('✅ Dependencies installed successfully!', colors.green);
          }
          log(`  📊 ${line}`, colors.blue);
        } else if (line.includes('WARN')) {
          log(`  ⚠️  ${line}`, colors.yellow);
        } else if (line.trim() && !line.includes('npm') && !line.includes('├─') && !line.includes('└─')) {
          log(`  ℹ️  ${line}`, colors.dim);
        }
      });
    });

    // Handle stderr
    npmProcess.stderr.on('data', (data) => {
      const output = data.toString();
      const lines = output.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        if (line.includes('WARN')) {
          log(`  ⚠️  ${line}`, colors.yellow);
        } else if (line.includes('ERR!')) {
          hasError = true;
          log(`  ❌ ${line}`, colors.red);
        } else if (line.trim()) {
          log(`  ℹ️  ${line}`, colors.dim);
        }
      });
    });

    // Handle process completion
    npmProcess.on('close', (code) => {
      if (code === 0) {
        if (!installationComplete) {
          log('✅ Dependencies installed successfully!', colors.green);
        }
        resolve(true);
      } else {
        const message = hasError ? 'npm install failed with errors' : `npm install exited with code ${code}`;
        log(`❌ ${message}`, colors.red);
        reject(new Error(message));
      }
    });

    npmProcess.on('error', (error) => {
      log(`❌ Failed to start npm install: ${error.message}`, colors.red);
      reject(error);
    });
  });
}

/**
 * Restore backed up files
 */
function restoreFiles(backupPath, backedUpFiles) {
  if (backedUpFiles.length === 0) {
    log('📝 No files to restore', colors.dim);
    return;
  }
  
  log('📋 Restoring backed up files...', colors.yellow);
  
  let restoredCount = 0;
  
  for (const fileName of backedUpFiles) {
    const backupFilePath = path.join(backupPath, fileName);
    const originalFilePath = path.join(process.cwd(), fileName);
    
    try {
      if (fs.existsSync(backupFilePath)) {
        fs.copyFileSync(backupFilePath, originalFilePath);
        log(`  ✅ Restored: ${fileName}`, colors.green);
        restoredCount++;
      } else {
        log(`  ⚠️  Backup not found: ${fileName}`, colors.yellow);
      }
    } catch (error) {
      log(`  ❌ Failed to restore ${fileName}: ${error.message}`, colors.red);
    }
  }
  
  log(`📋 Successfully restored ${restoredCount}/${backedUpFiles.length} file(s)`, colors.green);
}

/**
 * Clean up old backups
 */
function cleanupOldBackups() {
  if (!fs.existsSync(config.backupDir)) {
    return;
  }
  
  try {
    const backups = fs.readdirSync(config.backupDir)
      .filter(name => name.startsWith('backup-'))
      .map(name => ({
        name,
        path: path.join(config.backupDir, name),
        mtime: fs.statSync(path.join(config.backupDir, name)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);
    
    if (backups.length > config.maxBackups) {
      const toDelete = backups.slice(config.maxBackups);
      
      log(`🧹 Cleaning up ${toDelete.length} old backup(s)...`, colors.yellow);
      
      for (const backup of toDelete) {
        try {
          if (isWindows) {
            execCommand(`rmdir /s /q "${backup.path}"`);
          } else {
            execCommand(`rm -rf "${backup.path}"`);
          }
          log(`  🗂️  Removed old backup: ${backup.name}`, colors.dim);
        } catch (error) {
          log(`  ⚠️  Failed to remove old backup ${backup.name}: ${error.message}`, colors.yellow);
        }
      }
    }
  } catch (error) {
    log(`⚠️  Failed to cleanup old backups: ${error.message}`, colors.yellow);
  }
}

/**
 * Display final summary
 */
function displaySummary(startTime, backupPath) {
  const duration = Math.round((Date.now() - startTime) / 1000);
  
  console.log('');
  log('🎉 Fresh installation completed successfully!', colors.green + colors.bright);
  log(`⏱️  Total time: ${duration} seconds`, colors.blue);
  log(`💾 Backup saved in: ${backupPath}`, colors.blue);
  console.log('');
  log('🚀 Ready to start development:', colors.cyan);
  log('   npm run dev         # Start development server', colors.white);
  log('   npm run start:clean # Clean start with port cleanup', colors.white);
  log('   npm run check:ports # Check port status', colors.white);
  console.log('');
}

/**
 * Main execution function
 */
async function main() {
  const startTime = Date.now();
  let backupPath = '';
  let backedUpFiles = [];
  
  try {
    printHeader();
    
    // Step 1: Validate project directory
    log('🔍 Validating project directory...', colors.blue);
    validateProjectDirectory();
    console.log('');
    
    // Step 2: Create backup
    backupPath = createBackupDirectory();
    backedUpFiles = backupFiles(backupPath);
    console.log('');
    
    // Step 3: Remove old files
    await removeFiles();
    console.log('');
    
    // Step 4: Clear npm cache
    await clearNpmCache();
    console.log('');
    
    // Step 5: Install dependencies
    await installDependencies();
    console.log('');
    
    // Step 6: Restore backed up files
    restoreFiles(backupPath, backedUpFiles);
    console.log('');
    
    // Step 7: Clean up old backups
    cleanupOldBackups();
    
    // Step 8: Display summary
    displaySummary(startTime, backupPath);
    
  } catch (error) {
    console.log('');
    log(`❌ Fresh installation failed: ${error.message}`, colors.red);
    
    if (backupPath && backedUpFiles.length > 0) {
      console.log('');
      log('🔄 Attempting to restore backed up files...', colors.yellow);
      restoreFiles(backupPath, backedUpFiles);
    }
    
    console.log('');
    log('💡 Troubleshooting tips:', colors.blue);
    log('   1. Check your internet connection', colors.dim);
    log('   2. Try running: npm cache clean --force', colors.dim);
    log('   3. Delete node_modules manually and try again', colors.dim);
    log('   4. Check if you have permission to write to this directory', colors.dim);
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };