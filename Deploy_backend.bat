@echo off
echo Deploying backend to Cloudflare Workers...
cd backend

echo.
echo Checking if database migration is needed...
echo If this is your first deployment or you've made schema changes, run:
echo npx wrangler d1 execute electron-db --file=migration.sql
echo.

call npm run deploy
cd ..
echo.
echo Backend deployment complete!
echo Your backend API will be available at: https://electron-backend.carlos-mdtz9.workers.dev
echo.
echo If you need to run database migrations:
echo cd backend
echo npx wrangler d1 execute electron-db --file=migration.sql
echo.
