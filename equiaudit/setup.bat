@echo off
echo ========================================
echo EquiAudit Setup Script for Windows
echo ========================================
echo.

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not running
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo [1/6] Starting PostgreSQL and Redis with Docker...
docker-compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Docker services
    pause
    exit /b 1
)

echo.
echo [2/6] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [3/6] Setting up Python backend...
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo [4/6] Initializing database...
alembic upgrade head
if %errorlevel% neq 0 (
    echo [WARNING] Database migration failed - this is normal on first run
)

cd ..

echo.
echo [5/6] Setting up React frontend...
cd frontend

echo Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Node.js dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo [6/6] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Start Backend:
echo    cd backend
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.
echo 2. Start Frontend (in a new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open browser:
echo    http://localhost:5173
echo.
echo ========================================
echo.
pause
