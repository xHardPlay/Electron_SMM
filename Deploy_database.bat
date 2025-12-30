@echo off
echo Running database migration for electron-db...
cd backend

echo.
echo Current migration file: migration.sql
echo This will update the database schema with new tables and columns.
echo.

npx wrangler d1 execute electron-db --file=migration.sql

echo.
echo Database migration complete!
echo.
echo Migration details:
echo - Added ad_generations table for tracking ad generation jobs
echo - Added content_category and image_prompt columns to ads table
echo.
pause
