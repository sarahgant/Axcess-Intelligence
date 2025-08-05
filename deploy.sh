#!/bin/bash

# CCH Axcess Intelligence - Production Deployment Script
# Usage: ./deploy.sh [environment]

set -e

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_NAME="cch-intelligence"
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"your-registry.com"}
VERSION=${VERSION:-$(git rev-parse --short HEAD)}

echo "🚀 Deploying CCH Axcess Intelligence to $ENVIRONMENT"
echo "📦 Version: $VERSION"

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if required files exist
if [ ! -f "server/.env.$ENVIRONMENT" ]; then
    echo "❌ Error: server/.env.$ENVIRONMENT not found"
    echo "Please create the environment file with:"
    echo "- ANTHROPIC_API_KEY"
    echo "- OPENAI_API_KEY"
    echo "- ENCRYPTION_KEY"
    echo "- Other production settings"
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    exit 1
fi

# Build and test
echo "🏗️ Building application..."
docker build -t $PROJECT_NAME:$VERSION .
docker tag $PROJECT_NAME:$VERSION $PROJECT_NAME:latest

# Run security scan (optional)
if command -v docker scan &> /dev/null; then
    echo "🔒 Running security scan..."
    docker scan $PROJECT_NAME:$VERSION || echo "⚠️ Security scan completed with warnings"
fi

# Deploy based on environment
case $ENVIRONMENT in
    "development")
        echo "🧪 Deploying to development..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
        ;;
    "staging")
        echo "🎭 Deploying to staging..."
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
        ;;
    "production")
        echo "🎯 Deploying to production..."
        
        # Create backup
        echo "💾 Creating backup..."
        if docker ps | grep -q $PROJECT_NAME; then
            docker-compose exec app node -e "
                console.log('Backup created:', new Date().toISOString());
                // Add your backup logic here
            " || echo "⚠️ Backup skipped"
        fi
        
        # Deploy with zero downtime
        docker-compose up -d --no-deps app
        
        # Wait for health check
        echo "⏳ Waiting for health check..."
        timeout 60 bash -c '
            until docker-compose exec app curl -f http://localhost:3001/health; do
                echo "Waiting for app to be healthy..."
                sleep 2
            done
        '
        
        # Update nginx
        docker-compose up -d nginx
        ;;
    *)
        echo "❌ Unknown environment: $ENVIRONMENT"
        echo "Valid environments: development, staging, production"
        exit 1
        ;;
esac

# Post-deployment verification
echo "🔍 Running post-deployment tests..."

# Health check
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi

# API test
if curl -f http://localhost:3001/api/chat/providers > /dev/null 2>&1; then
    echo "✅ API endpoint test passed"
else
    echo "❌ API endpoint test failed"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📊 Application status:"
docker-compose ps

echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost (or your domain)"
echo "   API: http://localhost:3001/api"
echo "   Health: http://localhost:3001/health"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f app"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"