# Kill processes on specific ports for CCH Axcess Intelligence Vibed
# This script handles Windows PowerShell port cleanup

param(
    [int[]]$Ports = @(3000, 3001, 5173, 8080, 5000),  # Default ports to check
    [switch]$Verbose = $false
)

Write-Host "CCH Axcess Intelligence Vibed - Port Cleanup Script" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$killedProcesses = 0
$checkedPorts = 0

foreach ($port in $Ports) {
    $checkedPorts++
    if ($Verbose) {
        Write-Host "Checking port $port..." -ForegroundColor Yellow
    }
    
    try {
        # Get TCP connections on the specified port
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        
        if ($connections) {
            foreach ($connection in $connections) {
                $processId = $connection.OwningProcess
                
                try {
                    $processInfo = Get-Process -Id $processId -ErrorAction SilentlyContinue
                    
                    if ($processInfo) {
                        Write-Host "[KILL] Found process: $($processInfo.ProcessName) (PID: $processId) on port $port" -ForegroundColor Red
                        
                        # Kill the process
                        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                        $killedProcesses++
                        
                        # Verify the process was killed
                        Start-Sleep -Milliseconds 500
                        $stillRunning = Get-Process -Id $processId -ErrorAction SilentlyContinue
                        
                        if ($stillRunning) {
                            Write-Host "   [WARN] Process may still be running - trying force kill" -ForegroundColor Yellow
                            taskkill /F /PID $processId 2>$null
                        } else {
                            Write-Host "   [OK] Process terminated successfully" -ForegroundColor Green
                        }
                    }
                } catch {
                    Write-Host "   [WARN] Could not get process info for PID $processId" -ForegroundColor Yellow
                }
            }
        } else {
            if ($Verbose) {
                Write-Host "[OK] Port $port is free" -ForegroundColor Green
            }
        }
    } catch {
        if ($Verbose) {
            Write-Host "[WARN] Could not check port $port - $_" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "   Ports checked: $checkedPorts" -ForegroundColor White
Write-Host "   Processes killed: $killedProcesses" -ForegroundColor White

if ($killedProcesses -eq 0) {
    Write-Host "[OK] All ports were already free! Ready to start development." -ForegroundColor Green
} else {
    Write-Host "[OK] Killed $killedProcesses process(es). Ports are now available." -ForegroundColor Green
}

Write-Host ""
Write-Host "Ready to start CCH Axcess Intelligence Vibed!" -ForegroundColor Cyan

# Exit with success code
exit 0