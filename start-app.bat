@echo off
REM Build and start Docker containers
docker compose up --build -d

REM Wait a few seconds for the frontend to start
timeout /t 5 >nul

REM Open the app in the default browser
start http://localhost:3000/