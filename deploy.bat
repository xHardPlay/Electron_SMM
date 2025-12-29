@echo off
echo Starting deployment...

echo Deploying backend...
cd backend
npx wrangler deploy
cd ..

echo Building and deploying frontend...
cd frontend
npm run build
cd ..
npx wrangler pages deploy frontend/out --project-name electron-frontend

echo Deployment complete!
