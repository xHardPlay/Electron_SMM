@echo off
echo Building frontend...
cd frontend
call npm run build
cd ..
echo.
echo Deploying to Cloudflare Pages...
npx wrangler pages deploy frontend/out --project-name=electron-frontend --commit-dirty=true
echo.
echo Deployment complete!
pause
