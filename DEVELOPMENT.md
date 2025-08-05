# CCH Axcess Intelligence Vibed - Development Guide

## Quick Start for Cursor Users

When you ask Cursor to "run the app" or want to start development, use any of these commands:

```bash
npm start           # Primary method - uses clean startup
npm run run-app     # Alternative explicit method
npm run start:clean # Direct clean startup method
```

All of these will:
1. 🧹 Kill any processes using development ports
2. 🚀 Start Vite development server on port 5173
3. 📱 Open your app at http://localhost:5173

## Available Commands

### 🚀 Starting Development
- `npm start` - **Default**: Clean startup (recommended for Cursor)
- `npm run start:clean` - Cross-platform clean startup
- `npm run start:clean:windows` - Windows-specific with detailed output
- `npm run run-app` - Alternative explicit method
- `npm run dev` - Standard Vite (no port cleanup)

### 🔧 Maintenance
- `npm run ports:check` - See what's using your ports
- `npm run clean` - Kill processes on development ports
- `npm run fresh` - Complete clean install
- `npm run doctor` - Check environment health

## IDE Integration

### VS Code / Cursor Commands
1. **Command Palette** (`Ctrl+Shift+P`):
   - Type "Run Task" → "Run CCH Axcess Intelligence Vibed"
   - Type "Run Task" → "Start Development Server (Clean)"

2. **Debug Panel** (`Ctrl+Shift+D`):
   - Select "Launch CCH Axcess Intelligence Vibed"
   - Click the green play button

3. **Terminal**:
   - Any of the npm commands listed above

### Default Behavior
- `npm start` is configured to use the clean startup method
- Tasks are configured to use clean startup by default
- Launch configurations use clean startup method

## Port Configuration

The application uses these ports:
- **5173** - Frontend (Vite) - Primary development server
- **3001** - Backend (future implementation)
- **3002** - WebSocket (future implementation)
- **4173** - Preview server (production builds)

Additional ports (3000, 5000, 8080, 8000) are also cleaned during startup.

## Troubleshooting

### Port Issues
```bash
npm run ports:check    # See what's using ports
npm run clean          # Kill port processes
npm run start          # Clean restart
```

### Dependency Issues
```bash
npm run fresh          # Complete clean install
```

### Windows Issues
```bash
npm run start:clean:windows    # Windows-specific startup
```

## Scripts Location

All utility scripts are in:
- `scripts/start-clean.cjs` - Main clean startup
- `scripts/check-ports.cjs` - Port checker
- `scripts/fresh-install.cjs` - Fresh installation
- `start-clean.ps1` - Windows PowerShell script
- `run-app.cjs` - Simple app runner

## Configuration Files

The following files ensure consistent behavior:
- `.vscode/settings.json` - IDE settings and defaults
- `.vscode/tasks.json` - Task definitions for running the app
- `.vscode/launch.json` - Debug configurations
- `package.json` - npm scripts configuration

## For Cursor AI Assistant

When the user asks to "run the app" or "start development":
1. Use `npm start` (primary method)
2. Alternative: `npm run start:clean`
3. For Windows issues: `npm run start:clean:windows`
4. For troubleshooting: `npm run ports:check` then `npm run clean`

The system automatically handles port conflicts and provides clean startup every time.