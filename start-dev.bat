@echo off
:: CCH Axcess Intelligence Vibed - Development Environment Startup
:: Simple Windows batch file for launching the development environment

title CCH Axcess Intelligence Vibed - Development Environment
color 0A

echo.
echo ========================================================
echo   CCH Axcess Intelligence Vibed - Development Setup
echo ========================================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not available
    echo Please ensure Node.js and npm are properly installed
    pause
    exit /b 1
)

echo [INFO] Node.js and npm are available
echo.

:: Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

:: Check if node_modules exists, install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

:: Check if scripts directory exists
if not exist "scripts" (
    echo [ERROR] Scripts directory not found
    echo Please ensure the project is properly set up
    pause
    exit /b 1
)

echo [INFO] Starting development environment with port cleanup...
echo.
echo Press Ctrl+C to stop the development server
echo.

:: Run the development script
npm run start

:: Handle exit
echo.
echo [INFO] Development environment stopped
pause