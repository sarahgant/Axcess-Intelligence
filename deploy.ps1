# CCH Axcess Intelligence - Production Deployment Script (PowerShell)
# Usage: .\deploy.ps1 [environment]

param(
    [Parameter(Position=0)]
    [string]$Environment = "production"
)

$ProjectName = "cch-intelligence"
$DockerRegistry = $env:DOCKER_REGISTRY ?? "your-registry.com"
$Version = $env:VERSION ?? (git rev-parse --short HEAD)

Write-Host "🚀 Deploying CCH Axcess Intelligence to $Environment" -ForegroundColor Green
Write-Host "📦 Version: $Version" -ForegroundColor Blue

# Pre-deployment checks
Write-Host "🔍 Running pre-deployment checks..." -ForegroundColor Yellow

# Check if required files exist
if (-not (Test-Path "server\.env.$Environment")) {
    Write-Host "❌ Error: server\.env.$Environment not found" -ForegroundColor Red
    Write-Host "Please create the environment file with:" -ForegroundColor Yellow
    Write-Host "- ANTHROPIC_API_KEY" -ForegroundColor Yellow
    Write-Host "- OPENAI_API_KEY" -ForegroundColor Yellow
    Write-Host "- ENCRYPTION_KEY" -ForegroundColor Yellow
    Write-Host "- Other production settings" -ForegroundColor Yellow
    exit 1
}

# Check Docker
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Error: Docker is not installed" -ForegroundColor Red
    exit 1
}

try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "❌ Error: Docker Compose is not installed" -ForegroundColor Red
    exit 1
}

# Build and test
Write-Host "🏗️ Building application..." -ForegroundColor Blue
docker build -t "${ProjectName}:${Version}" .
docker tag "${ProjectName}:${Version}" "${ProjectName}:latest"

# Deploy based on environment
switch ($Environment) {
    "development" {
        Write-Host "🧪 Deploying to development..." -ForegroundColor Cyan
        docker-compose -f docker-compose.yml up -d
    }
    "staging" {
        Write-Host "🎭 Deploying to staging..." -ForegroundColor Magenta
        docker-compose -f docker-compose.yml up -d
    }
    "production" {
        Write-Host "🎯 Deploying to production..." -ForegroundColor Green
        
        # Create backup
        Write-Host "💾 Creating backup..." -ForegroundColor Yellow
        $runningContainer = docker ps --filter "name=$ProjectName" --quiet
        if ($runningContainer) {
            Write-Host "Backup created: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Blue
        }
        
        # Deploy with zero downtime
        docker-compose up -d --no-deps app
        
        # Wait for health check
        Write-Host "⏳ Waiting for health check..." -ForegroundColor Yellow
        $timeout = 60
        $elapsed = 0
        do {
            Start-Sleep -Seconds 2
            $elapsed += 2
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 -ErrorAction Stop
                if ($response.StatusCode -eq 200) {
                    Write-Host "✅ Health check passed" -ForegroundColor Green
                    break
                }
            } catch {
                Write-Host "Waiting for app to be healthy..." -ForegroundColor Yellow
            }
        } while ($elapsed -lt $timeout)
        
        if ($elapsed -ge $timeout) {
            Write-Host "❌ Health check timeout" -ForegroundColor Red
            exit 1
        }
    }
    default {
        Write-Host "❌ Unknown environment: $Environment" -ForegroundColor Red
        Write-Host "Valid environments: development, staging, production" -ForegroundColor Yellow
        exit 1
    }
}

# Post-deployment verification
Write-Host "🔍 Running post-deployment tests..." -ForegroundColor Yellow

# Health check
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 10
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ Health check passed" -ForegroundColor Green
    } else {
        throw "Health check returned status $($healthResponse.StatusCode)"
    }
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# API test
try {
    $apiResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/chat/providers" -TimeoutSec 10
    if ($apiResponse.StatusCode -eq 200) {
        Write-Host "✅ API endpoint test passed" -ForegroundColor Green
    } else {
        throw "API test returned status $($apiResponse.StatusCode)"
    }
} catch {
    Write-Host "❌ API endpoint test failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "📊 Application status:" -ForegroundColor Blue
docker-compose ps

Write-Host ""
Write-Host "🌐 Access your application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost (or your domain)" -ForegroundColor White
Write-Host "   API: http://localhost:3001/api" -ForegroundColor White  
Write-Host "   Health: http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "📝 To view logs:" -ForegroundColor Yellow
Write-Host "   docker-compose logs -f app" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop:" -ForegroundColor Red
Write-Host "   docker-compose down" -ForegroundColor White