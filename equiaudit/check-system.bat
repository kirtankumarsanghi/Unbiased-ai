@echo off
echo ========================================
echo EquiAudit System Check
echo ========================================
echo.

echo [1] Checking Python...
python --version
if %errorlevel% neq 0 (
    echo [ERROR] Python not found
) else (
    echo [OK] Python installed
)
echo.

echo [2] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found
) else (
    echo [OK] Node.js installed
)
echo.

echo [3] Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo [ERROR] npm not found
) else (
    echo [OK] npm installed
)
echo.

echo [4] Checking Docker...
docker --version
if %errorlevel% neq 0 (
    echo [ERROR] Docker not found
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
) else (
    echo [OK] Docker installed
)
echo.

echo [5] Checking Docker Compose...
docker-compose --version
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose not found
) else (
    echo [OK] Docker Compose installed
)
echo.

echo [6] Checking if Docker is running...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Docker is not running
    echo Please start Docker Desktop
) else (
    echo [OK] Docker is running
)
echo.

echo [7] Checking backend virtual environment...
if exist "backend\venv" (
    echo [OK] Virtual environment exists
) else (
    echo [INFO] Virtual environment not created yet
    echo Run setup.bat to create it
)
echo.

echo [8] Checking frontend node_modules...
if exist "frontend\node_modules" (
    echo [OK] Node modules installed
) else (
    echo [INFO] Node modules not installed yet
    echo Run setup.bat to install them
)
echo.

echo ========================================
echo System Check Complete
echo ========================================
pause
