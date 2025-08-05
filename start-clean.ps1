# CCH Axcess Intelligence Vibed - Windows PowerShell Clean Startup Script
# This script provides a robust Windows-specific development environment startup

param(
    [switch]$ClearCache,
    [switch]$Verbose,
    [switch]$Force,
    [switch]$NoStart,
    [string[]]$AdditionalPorts = @(),
    [switch]$Help
)

# Script configuration
$Script:Config = @{
    AppName = "CCH Axcess Intelligence Vibed"
    Ports = @(5173, 3001, 3002, 4173, 3000, 5000, 8080, 8000)
    PrimaryPort = 5173
    BackendPort = 3001
    MaxRetries = 3
    ProcessKillTimeout = 10
    StartupTimeout = 30
}

# Colors for Windows PowerShell
$Script:Colors = @{
    Red = "Red"
    Green = "Green" 
    Yellow = "Yellow"
    Blue = "Blue"
    Cyan = "Cyan"
    Magenta = "Magenta"
    White = "White"
    Gray = "Gray"
    DarkGray = "DarkGray"
}

# Add any additional ports specified
if ($AdditionalPorts.Count -gt 0) {
    $Script:Config.Ports += $AdditionalPorts
    $Script:Config.Ports = $Script:Config.Ports | Sort-Object | Get-Unique
}

#region Helper Functions

function Write-ColoredOutput {
    param(
        [string]$Message,
        [string]$Color = "White",
        [string]$Prefix = "",
        [switch]$NoNewline
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    $timestampStr = "[$timestamp]"
    
    if ($Prefix) {
        $fullMessage = "$timestampStr $Prefix $Message"
    } else {
        $fullMessage = "$timestampStr $Message"
    }
    
    $params = @{
        Object = $fullMessage
        ForegroundColor = $Color
    }
    
    if ($NoNewline) {
        $params.NoNewline = $true
    }
    
    Write-Host @params
}

function Write-Header {
    Clear-Host
    Write-Host ""
    Write-ColoredOutput "🚀 $($Script:Config.AppName) - Clean Development Startup" -Color $Script:Colors.Cyan
    Write-ColoredOutput ("=" * 70) -Color $Script:Colors.DarkGray
    Write-ColoredOutput "Platform: Windows PowerShell | Primary Port: $($Script:Config.PrimaryPort) | Backend Port: $($Script:Config.BackendPort)" -Color $Script:Colors.DarkGray
    Write-Host ""
}

function Show-Help {
    Write-Header
    Write-ColoredOutput "Usage: .\start-clean.ps1 [OPTIONS]" -Color $Script:Colors.Yellow
    Write-Host ""
    Write-ColoredOutput "Options:" -Color $Script:Colors.White
    Write-ColoredOutput "  -ClearCache        Clear npm cache before starting" -Color $Script:Colors.Gray
    Write-ColoredOutput "  -Verbose          Show detailed output" -Color $Script:Colors.Gray
    Write-ColoredOutput "  -Force            Force kill processes without confirmation" -Color $Script:Colors.Gray
    Write-ColoredOutput "  -NoStart          Only clean ports, don't start server" -Color $Script:Colors.Gray
    Write-ColoredOutput "  -AdditionalPorts  Extra ports to clean (comma-separated)" -Color $Script:Colors.Gray
    Write-ColoredOutput "  -Help             Show this help message" -Color $Script:Colors.Gray
    Write-Host ""
    Write-ColoredOutput "Examples:" -Color $Script:Colors.White
    Write-ColoredOutput "  .\start-clean.ps1                    # Standard clean startup" -Color $Script:Colors.Gray
    Write-ColoredOutput "  .\start-clean.ps1 -ClearCache       # Clear npm cache first" -Color $Script:Colors.Gray
    Write-ColoredOutput "  .\start-clean.ps1 -NoStart          # Only clean ports" -Color $Script:Colors.Gray
    Write-ColoredOutput "  .\start-clean.ps1 -Verbose -Force   # Detailed output, force kill" -Color $Script:Colors.Gray
    Write-Host ""
    exit 0
}

function Test-AdminRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Test-NodeInstallation {
    try {
        $nodeVersion = node --version 2>$null
        $npmVersion = npm --version 2>$null
        
        if ($nodeVersion -and $npmVersion) {
            if ($Verbose) {
                Write-ColoredOutput "✅ Node.js: $nodeVersion | npm: $npmVersion" -Color $Script:Colors.Green
            }
            return $true
        } else {
            Write-ColoredOutput "❌ Node.js or npm not found in PATH" -Color $Script:Colors.Red
            return $false
        }
    } catch {
        Write-ColoredOutput "❌ Failed to check Node.js installation: $($_.Exception.Message)" -Color $Script:Colors.Red
        return $false
    }
}

function Test-ProjectStructure {
    $packageJsonPath = Join-Path $PWD "package.json"
    $srcPath = Join-Path $PWD "src"
    
    if (-not (Test-Path $packageJsonPath)) {
        Write-ColoredOutput "❌ package.json not found. Are you in the project root?" -Color $Script:Colors.Red
        return $false
    }
    
    if (-not (Test-Path $srcPath)) {
        Write-ColoredOutput "❌ src directory not found. Are you in the project root?" -Color $Script:Colors.Red
        return $false
    }
    
    try {
        $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
        $hasVite = $packageJson.dependencies.vite -or $packageJson.devDependencies.vite
        
        if (-not $hasVite) {
            Write-ColoredOutput "❌ Vite not found in dependencies. Run 'npm install' first." -Color $Script:Colors.Red
            return $false
        }
        
        if ($Verbose) {
            Write-ColoredOutput "✅ Project structure validated" -Color $Script:Colors.Green
        }
        return $true
    } catch {
        Write-ColoredOutput "❌ Failed to validate package.json: $($_.Exception.Message)" -Color $Script:Colors.Red
        return $false
    }
}

function Get-ProcessByPort {
    param([int]$Port)
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        $processes = @()
        
        foreach ($connection in $connections) {
            $processId = $connection.OwningProcess
            try {
                $processInfo = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($processInfo) {
                    $processes += @{
                        PID = $processId
                        Name = $processInfo.ProcessName
                        Path = $processInfo.Path
                        StartTime = $processInfo.StartTime
                    }
                }
            } catch {
                $processes += @{
                    PID = $processId
                    Name = "Unknown"
                    Path = "Unknown"
                    StartTime = "Unknown"
                }
            }
        }
        
        return $processes
    } catch {
        if ($Verbose) {
            Write-ColoredOutput "⚠️  Could not check port $Port : $($_.Exception.Message)" -Color $Script:Colors.Yellow
        }
        return @()
    }
}

function Stop-ProcessByPid {
    param(
        [int]$ProcessId,
        [string]$ProcessName = "Unknown",
        [switch]$ForceKill
    )
    
    try {
        # Try graceful termination first
        $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
        if (-not $process) {
            if ($Verbose) {
                Write-ColoredOutput "ℹ️  Process $ProcessId ($ProcessName) already terminated" -Color $Script:Colors.Blue
            }
            return $true
        }
        
        if (-not $ForceKill) {
            # Try CloseMainWindow first for GUI applications
            if ($process.MainWindowTitle) {
                $process.CloseMainWindow() | Out-Null
                Start-Sleep -Seconds 2
                
                $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
                if (-not $process) {
                    Write-ColoredOutput "✅ Gracefully closed: $ProcessName (PID: $ProcessId)" -Color $Script:Colors.Green
                    return $true
                }
            }
        }
        
        # Force termination
        Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
        
        # Verify termination
        $stillRunning = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
        if ($stillRunning) {
            # Use taskkill as last resort
            $result = taskkill /F /PID $ProcessId 2>$null
            Start-Sleep -Milliseconds 500
            
            $finalCheck = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
            if ($finalCheck) {
                Write-ColoredOutput "❌ Failed to kill process: $ProcessName (PID: $ProcessId)" -Color $Script:Colors.Red
                return $false
            }
        }
        
        Write-ColoredOutput "✅ Killed process: $ProcessName (PID: $ProcessId)" -Color $Script:Colors.Green
        return $true
    } catch {
        Write-ColoredOutput "⚠️  Error killing process $ProcessId ($ProcessName): $($_.Exception.Message)" -Color $Script:Colors.Yellow
        return $false
    }
}

function Clear-DevelopmentPorts {
    Write-ColoredOutput "🧹 Cleaning up development ports..." -Color $Script:Colors.Yellow
    
    $totalKilled = 0
    $portResults = @()
    
    foreach ($port in $Script:Config.Ports) {
        if ($Verbose) {
            Write-ColoredOutput "Checking port $port..." -Color $Script:Colors.Blue
        }
        
        $processes = Get-ProcessByPort -Port $port
        
        if ($processes.Count -eq 0) {
            if ($Verbose) {
                Write-ColoredOutput "✅ Port $port is free" -Color $Script:Colors.Green
            }
            $portResults += @{ Port = $port; Status = "free"; Killed = 0 }
            continue
        }
        
        Write-ColoredOutput "Found $($processes.Count) process(es) on port $port" -Color $Script:Colors.Yellow
        $killedCount = 0
        
        foreach ($process in $processes) {
            $processName = $process.Name
            $processId = $process.PID
            
            Write-ColoredOutput "  • $processName (PID: $processId)" -Color $Script:Colors.Gray
            
            $success = Stop-ProcessByPid -ProcessId $processId -ProcessName $processName -ForceKill:$Force
            if ($success) {
                $killedCount++
                $totalKilled++
            }
        }
        
        $portResults += @{ Port = $port; Status = "cleaned"; Killed = $killedCount }
        
        if ($killedCount -gt 0) {
            Start-Sleep -Milliseconds 500
        }
    }
    
    # Display summary
    Write-Host ""
    Write-ColoredOutput "📊 Port cleanup summary:" -Color $Script:Colors.Blue
    foreach ($result in $portResults) {
        $icon = if ($result.Status -eq "free") { "✅" } else { "🧹" }
        $color = if ($result.Status -eq "free") { $Script:Colors.Green } else { $Script:Colors.Yellow }
        Write-ColoredOutput "   $icon Port $($result.Port): $($result.Status) ($($result.Killed) killed)" -Color $color
    }
    
    if ($totalKilled -gt 0) {
        Write-ColoredOutput "🎯 Successfully killed $totalKilled process(es)" -Color $Script:Colors.Green
    } else {
        Write-ColoredOutput "🎉 All ports were already free!" -Color $Script:Colors.Green
    }
    
    return $totalKilled
}

function Clear-NpmCache {
    if (-not $ClearCache) { return }
    
    Write-ColoredOutput "🗑️  Clearing npm cache..." -Color $Script:Colors.Yellow
    
    try {
        $result = npm cache clean --force 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColoredOutput "✅ npm cache cleared successfully" -Color $Script:Colors.Green
        } else {
            Write-ColoredOutput "⚠️  npm cache clear completed with warnings" -Color $Script:Colors.Yellow
            if ($Verbose) {
                Write-ColoredOutput "Output: $result" -Color $Script:Colors.Gray
            }
        }
    } catch {
        Write-ColoredOutput "❌ Failed to clear npm cache: $($_.Exception.Message)" -Color $Script:Colors.Red
    }
}

function Start-DevelopmentServer {
    Write-ColoredOutput "🚀 Starting Vite development server..." -Color $Script:Colors.Cyan
    
    try {
        # Set environment variables
        $env:NODE_ENV = "development"
        $env:FORCE_COLOR = "1"
        $env:PORT = $Script:Config.PrimaryPort
        
        # Start the development server
        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = "npm"
        $processInfo.Arguments = "run dev"
        $processInfo.UseShellExecute = $false
        $processInfo.RedirectStandardOutput = $true
        $processInfo.RedirectStandardError = $true
        $processInfo.CreateNoWindow = $false
        
        # Add environment variables
        $processInfo.EnvironmentVariables["NODE_ENV"] = "development"
        $processInfo.EnvironmentVariables["FORCE_COLOR"] = "1"
        $processInfo.EnvironmentVariables["PORT"] = $Script:Config.PrimaryPort.ToString()
        
        $process = New-Object System.Diagnostics.Process
        $process.StartInfo = $processInfo
        
        # Event handlers for real-time output
        $process.add_OutputDataReceived({
            param($sender, $e)
            if ($e.Data) {
                $line = $e.Data
                
                # Color code different types of output
                $color = $Script:Colors.White
                $prefix = "[VITE]"
                
                if ($line -match "error|Error") {
                    $color = $Script:Colors.Red
                } elseif ($line -match "warn|Warning") {
                    $color = $Script:Colors.Yellow
                } elseif ($line -match "http://|Local:|ready in") {
                    $color = $Script:Colors.Cyan
                    if ($line -match "Local:|ready in") {
                        Write-ColoredOutput "✅ Development server started successfully!" -Color $Script:Colors.Green
                    }
                }
                
                Write-ColoredOutput "$prefix $line" -Color $color
            }
        })
        
        $process.add_ErrorDataReceived({
            param($sender, $e)
            if ($e.Data) {
                $line = $e.Data
                $isWarning = $line -match "warning|deprecated"
                $color = if ($isWarning) { $Script:Colors.Yellow } else { $Script:Colors.Red }
                $prefix = if ($isWarning) { "[VITE WARN]" } else { "[VITE ERROR]" }
                
                Write-ColoredOutput "$prefix $line" -Color $color
            }
        })
        
        # Start the process
        $process.Start() | Out-Null
        $process.BeginOutputReadLine()
        $process.BeginErrorReadLine()
        
        Write-ColoredOutput "📡 Vite process started (PID: $($process.Id))" -Color $Script:Colors.Blue
        
        # Display startup information
        Write-Host ""
        Write-ColoredOutput "🎉 Development environment is ready!" -Color $Script:Colors.Green
        Write-ColoredOutput "📱 Frontend: http://localhost:$($Script:Config.PrimaryPort)" -Color $Script:Colors.Cyan
        Write-ColoredOutput "🔧 Backend: http://localhost:$($Script:Config.BackendPort) (when implemented)" -Color $Script:Colors.Gray
        Write-ColoredOutput "💻 Platform: Windows PowerShell" -Color $Script:Colors.Blue
        Write-Host ""
        Write-ColoredOutput "Press Ctrl+C to stop all services" -Color $Script:Colors.Gray
        Write-Host ""
        
        # Wait for the process to complete or be interrupted
        $process.WaitForExit()
        
    } catch {
        Write-ColoredOutput "❌ Failed to start development server: $($_.Exception.Message)" -Color $Script:Colors.Red
        throw
    }
}

#endregion

#region Main Execution

function Start-CleanDevelopment {
    try {
        # Show help if requested
        if ($Help) {
            Show-Help
        }
        
        # Display header
        Write-Header
        
        # Check for admin rights (warn but don't require)
        if (-not (Test-AdminRights)) {
            Write-ColoredOutput "⚠️  Not running as Administrator. Some port cleanup operations may fail." -Color $Script:Colors.Yellow
            Write-ColoredOutput "   For best results, run PowerShell as Administrator." -Color $Script:Colors.Gray
            Write-Host ""
        }
        
        # Validate environment
        Write-ColoredOutput "🔍 Validating development environment..." -Color $Script:Colors.Blue
        
        if (-not (Test-NodeInstallation)) {
            throw "Node.js installation validation failed"
        }
        
        if (-not (Test-ProjectStructure)) {
            throw "Project structure validation failed"
        }
        
        Write-ColoredOutput "✅ Environment validation successful" -Color $Script:Colors.Green
        Write-Host ""
        
        # Clear npm cache if requested
        Clear-NpmCache
        if ($ClearCache) { Write-Host "" }
        
        # Clean up ports
        $killedCount = Clear-DevelopmentPorts
        Write-Host ""
        
        # Start development server unless NoStart is specified
        if (-not $NoStart) {
            Start-DevelopmentServer
        } else {
            Write-ColoredOutput "🏁 Port cleanup completed. Development server not started (NoStart flag specified)." -Color $Script:Colors.Blue
        }
        
    } catch {
        Write-Host ""
        Write-ColoredOutput "❌ Startup failed: $($_.Exception.Message)" -Color $Script:Colors.Red
        
        # Provide helpful suggestions
        if ($_.Exception.Message -match "npm install") {
            Write-ColoredOutput "💡 Try running: npm install" -Color $Script:Colors.Blue
        } elseif ($_.Exception.Message -match "port|process") {
            Write-ColoredOutput "💡 Try running as Administrator or manually killing processes" -Color $Script:Colors.Blue
        } elseif ($_.Exception.Message -match "Node.js") {
            Write-ColoredOutput "💡 Install Node.js from https://nodejs.org/" -Color $Script:Colors.Blue
        }
        
        Write-Host ""
        Write-ColoredOutput "For more options, run: .\start-clean.ps1 -Help" -Color $Script:Colors.Gray
        exit 1
    }
}

# Handle Ctrl+C gracefully
$cleanup = {
    Write-Host ""
    Write-ColoredOutput "🛑 Received interrupt signal, shutting down..." -Color $Script:Colors.Yellow
    
    # Try to stop any child processes gracefully
    Get-Job | Stop-Job
    Get-Job | Remove-Job -Force
    
    Write-ColoredOutput "👋 Development environment stopped. Thank you!" -Color $Script:Colors.Blue
    exit 0
}

# Register the cleanup function
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action $cleanup | Out-Null

# Start the main function
Start-CleanDevelopment

#endregion