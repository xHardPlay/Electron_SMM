@echo off
echo Incrementing counter...
powershell -Command "$json = Get-Content 'counter.json' | ConvertFrom-Json; $json.iterations = $json.iterations + 1; $json | ConvertTo-Json | Set-Content 'counter.json'"

echo Compiling frontend...
cd frontend
npm run build
cd ..

echo Starting local development servers...
code --run-task "Start Full Stack Dev"

echo Local development environment started!
