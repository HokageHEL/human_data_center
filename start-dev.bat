@echo off
setlocal enabledelayedexpansion

REM Colors for output
set GREEN=[32m
set RED=[31m
set NC=[0m

REM Create database directory if it doesn't exist
if not exist "database" (
    mkdir database
    echo %GREEN%[INFO]%NC% Created database directory
)

REM Check if ports are in use
netstat -ano | findstr :3000 >nul
if not errorlevel 1 (
    echo %RED%[ERROR]%NC% Port 3000 is already in use
    exit /b 1
)

netstat -ano | findstr :5173 >nul
if not errorlevel 1 (
    echo %RED%[ERROR]%NC% Port 5173 is already in use
    exit /b 1
)

REM Start backend server
echo %GREEN%[INFO]%NC% Starting backend server...
start /B node backend/server.js

REM Wait for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend dev server
echo %GREEN%[INFO]%NC% Starting frontend development server...
start /B npm run dev

REM Keep window open
echo %GREEN%[INFO]%NC% Servers started. Press Ctrl+C to stop.
pause >nul