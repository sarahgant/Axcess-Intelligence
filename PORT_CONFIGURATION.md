# 🚨 PORT CONFIGURATION - PERMANENT REMINDER

## CRITICAL: USE THESE PORTS ONLY

### ✅ CORRECT PORTS
- **Frontend (Vite)**: `http://localhost:5173` ← USE THIS ONE
- **Backend (Express)**: `http://localhost:3001`

### ❌ WRONG PORTS  
- **Frontend**: ~~`http://localhost:3000`~~ ← NEVER USE THIS
- **Backend**: ~~`http://localhost:3000`~~ ← NEVER USE THIS

## Why Port 5173?
- **Vite default**: Vite development server uses port 5173 by default
- **React Create App**: Uses port 3000 (we're NOT using Create React App)
- **Our setup**: Uses Vite, so port 5173 is correct

## Configuration Files
- `vite.config.ts`: Configured for port 5173
- `server/server.js`: CORS allows both 3000 and 5173 (for compatibility)
- `src/config/environment.ts`: API points to backend on 3001

## Quick Access
```bash
# Frontend (Vite)
http://localhost:5173

# Backend API
http://localhost:3001/api/health

# Admin Dashboard
http://localhost:5173 → Press Ctrl+Alt+A
```

## Deployment Commands
```bash
# Development (both frontend + backend)
npm run dev

# Frontend only
npm run client:dev  # Runs on 5173

# Backend only  
npm run server:dev  # Runs on 3001
```

---
**REMEMBER: ALWAYS USE PORT 5173 FOR FRONTEND ACCESS!**
