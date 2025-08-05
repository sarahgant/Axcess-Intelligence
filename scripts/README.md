# CCH Axcess Intelligence Vibed - Development Scripts

This directory contains scripts to manage the development environment for CCH Axcess Intelligence Vibed.

## 🚀 Quick Start

### Option 1: Simple Windows Batch File (Recommended for beginners)
Double-click `start-dev.bat` or run from command line:
```cmd
start-dev.bat
```

### Option 2: NPM Scripts (Recommended for developers)
```bash
# Start with automatic port cleanup
npm run start
# or
npm run dev:clean

# Start without port cleanup
npm run dev

# Clean ports only
npm run kill-ports
```

### Option 3: Direct Node.js Script
```bash
node scripts/start-dev.js
```

## 📁 Script Files

### `kill-ports.ps1`
**Windows PowerShell script for port cleanup**

- **Purpose**: Kills processes running on development ports
- **Ports**: 3000, 3001, 5173, 8080, 5000 (configurable)
- **Features**: 
  - Colored output with process information
  - Verbose mode support
  - Summary statistics
  - Error handling for permission issues

**Usage:**
```powershell
# Basic usage
powershell -ExecutionPolicy Bypass -File scripts/kill-ports.ps1

# With verbose output
powershell -ExecutionPolicy Bypass -File scripts/kill-ports.ps1 -Verbose

# Custom ports
powershell -ExecutionPolicy Bypass -File scripts/kill-ports.ps1 -Ports 3000,5173
```

### `start-dev.js`
**Node.js development server manager**

- **Purpose**: Orchestrates the complete development environment
- **Features**:
  - Automatic port cleanup before starting
  - Colored console output for different services
  - Graceful shutdown handling (Ctrl+C)
  - Process monitoring and restart capabilities
  - Cross-platform compatibility

**Configuration:**
```javascript
const config = {
  ports: [3000, 3001, 5173, 8080, 5000],  // Ports to clean
  frontend: {
    command: 'npm',
    args: ['run', 'dev'],
    name: 'VITE DEV SERVER',
    enabled: true
  },
  backend: {
    command: 'npm',
    args: ['run', 'server'],
    name: 'BACKEND SERVER',
    enabled: false  // Enable when backend is implemented
  }
};
```

### `start-dev.bat`
**Windows batch file for simplified startup**

- **Purpose**: Simple double-click startup for Windows users
- **Features**:
  - Dependency checks (Node.js, npm)
  - Automatic npm install if needed
  - Project validation
  - User-friendly error messages

## 🎯 Use Cases

### Daily Development Workflow
```bash
# Start your development session
npm run start

# When you're done, press Ctrl+C to stop all services
```

### Port Conflicts Resolution
```bash
# If you get "port already in use" errors
npm run kill-ports

# Then start normally
npm run dev
```

### Backend Development (Future)
When the backend is implemented, update `scripts/start-dev.js`:
```javascript
backend: {
  enabled: true  // Change this to true
}
```

## 🛠️ Customization

### Adding New Ports
Edit `scripts/kill-ports.ps1` and `scripts/start-dev.js`:
```javascript
// In start-dev.js
const config = {
  ports: [3000, 3001, 5173, 8080, 5000, 8000],  // Add your port
  // ...
};
```

```powershell
# In kill-ports.ps1
param(
    [int[]]$Ports = @(3000, 3001, 5173, 8080, 5000, 8000),  # Add your port
    # ...
)
```

### Adding New Services
Edit `scripts/start-dev.js`:
```javascript
const config = {
  // ... existing config
  newService: {
    command: 'your-command',
    args: ['your', 'args'],
    name: 'YOUR SERVICE',
    color: colors.info,
    enabled: true
  }
};

// Then update the startDevelopment() function to start your service
```

## 🔧 Troubleshooting

### PowerShell Execution Policy Error
If you get "execution of scripts is disabled", run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Still in Use
Sometimes processes don't terminate cleanly:
```bash
# Try the nuclear option
npm run kill-ports

# Or manually kill the process (find PID first)
netstat -ano | findstr :5173
taskkill /F /PID <process_id>
```

### Node.js/NPM Not Found
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt
- Verify installation: `node --version && npm --version`

### Script Not Found Errors
Make sure you're running commands from the project root directory where `package.json` is located.

## 📊 Features Summary

| Feature | Batch File | NPM Scripts | Node.js Script | PowerShell Script |
|---------|------------|-------------|----------------|-------------------|
| Port Cleanup | ✅ | ✅ | ✅ | ✅ |
| Colored Output | ❌ | ✅ | ✅ | ✅ |
| Multiple Services | ❌ | ✅ | ✅ | ❌ |
| Error Handling | ✅ | ✅ | ✅ | ✅ |
| Graceful Shutdown | ❌ | ✅ | ✅ | ❌ |
| Cross-Platform | ❌ | ✅ | ✅ | ❌ |
| Beginner Friendly | ✅ | ✅ | ❌ | ❌ |

## 🔮 Future Enhancements

- [ ] Backend server integration when implemented
- [ ] Database connection monitoring
- [ ] Hot reload configuration
- [ ] Environment-specific configurations
- [ ] Automated testing integration
- [ ] Docker development environment
- [ ] Health check endpoints monitoring

---

**Last Updated**: 2025-01-04  
**Compatible With**: Windows 10/11, Node.js 16+, PowerShell 5.1+