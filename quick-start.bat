@echo off
REM STEPS Public - Quick Start Script for Windows

setlocal enabledelayedexpansion

echo.
echo ================================================================
echo   STEPS Public - Quick Start Setup
echo ================================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js is not installed.
    echo     Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Show versions
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo [✓] Node.js version: %NODE_VERSION%
echo [✓] npm version: %NPM_VERSION%
echo.

REM Check if .env exists
if not exist ".env" (
    echo [*] Creating .env file from template...
    copy .env.example .env >nul
    echo [✓] .env file created
    echo.
    echo [!] IMPORTANT: Edit .env and add your OpenAI API credentials:
    echo     OPENAI_API_KEY=your-api-key-here
    echo.
)

REM Install dependencies
echo [*] Installing dependencies...
call npm install
echo [✓] Dependencies installed
echo.

REM Show next steps
echo ================================================================
echo   Next Steps:
echo ================================================================
echo.
echo 1. Configure your OpenAI API key in .env:
echo    notepad .env
echo.
echo 2. Start the development server:
echo    npm run start:dev
echo.
echo 3. Open the API documentation:
echo    http://localhost:3001/api
echo.
echo For more information, see:
echo   - README.md - Detailed project documentation
echo   - SETUP_GUIDE.md - Installation and troubleshooting
echo   - PROJECT_SUMMARY.md - Architecture and structure
echo.
echo ================================================================
echo.
pause
