@echo off
echo ========================================
echo EquiAudit Quick Start
echo ========================================
echo.

echo [INFO] This script will:
echo   1. Check if Docker is running
echo   2. Start PostgreSQL and Redis
echo   3. Start the backend server
echo   4. Start the frontend server
echo.
pause

REM Check Docker
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/4] Starting Docker services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Docker services
    pause
    exit /b 1
)

echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [2/4] Checking backend setup...
if not exist "backend\venv" (
    echo [ERROR] Backend not set up! Run setup.bat first.
    pause
    exit /b 1
)

echo.
echo [3/4] Starting backend server...
start "EquiAudit Backend" cmd /k "cd backend && venv\Scripts\activate && echo Backend starting on http://localhost:8000 && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak >nul

echo.
echo [4/4] Starting frontend server...
start "EquiAudit Frontend" cmd /k "cd frontend && echo Frontend starting on http://localhost:5173 && npm run dev"

echo.
echo ========================================
echo EquiAudit is starting!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo.
echo Press any key to open the frontend in your browser...
pause >nul
start http://localhost:5173
