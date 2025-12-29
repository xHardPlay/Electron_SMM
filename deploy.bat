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

echo Incrementing AI iteration counter...
powershell -Command "$json = Get-Content '..\counter.json' | ConvertFrom-Json; $json.iterations = $json.iterations + 1; $json | ConvertTo-Json | Set-Content '..\counter.json'"

echo Deployment complete!
