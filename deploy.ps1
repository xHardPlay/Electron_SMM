# Electron Marketing Tool - Deployment Script
# This script deploys both backend and frontend to CloudFlare

Write-Host "🚀 Deploying Electron Marketing Tool..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Yellow

# Deploy Backend
Write-Host "📦 Deploying Backend..." -ForegroundColor Blue
Set-Location backend
try {
    & npx wrangler deploy
    if ($LASTEXITCODE -ne 0) {
        throw "Backend deployment failed"
    }
    Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend deployment failed: $_" -ForegroundColor Red
    exit 1
}

# Deploy Frontend
Write-Host "🌐 Deploying Frontend..." -ForegroundColor Blue
Set-Location ../frontend
try {
    & npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend build failed"
    }

    & npx wrangler pages deploy out --project-name electron-frontend
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend deployment failed"
    }
    Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend deployment failed: $_" -ForegroundColor Red
    exit 1
}

# Return to root
Set-Location ..

Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Yellow
Write-Host "📱 Frontend: https://4249eeba.electron-frontend.pages.dev" -ForegroundColor Cyan
Write-Host "🔧 Backend:  https://electron-backend.carlos-mdtz9.workers.dev" -ForegroundColor Cyan
Write-Host "📚 Docs:     README.md, docs/ARCHITECTURE.md, docs/API_REFERENCE.md" -ForegroundColor Cyan
