@echo off
echo ========================================
echo EquiAudit Installation Test
echo ========================================
echo.

set ERRORS=0

echo [1/10] Testing Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Python not found
    set /a ERRORS+=1
) else (
    python --version
    echo [PASS] Python installed
)
echo.

echo [2/10] Testing Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Node.js not found
    set /a ERRORS+=1
) else (
    node --version
    echo [PASS] Node.js installed
)
echo.

echo [3/10] Testing Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Docker not found
    set /a ERRORS+=1
) else (
    docker --version
    echo [PASS] Docker installed
)
echo.

echo [4/10] Testing Docker running...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] Docker not running - start Docker Desktop
    set /a ERRORS+=1
) else (
    echo [PASS] Docker is running
)
echo.

echo [5/10] Testing backend virtual environment...
if exist "backend\venv\Scripts\python.exe" (
    echo [PASS] Virtual environment exists
) else (
    echo [FAIL] Virtual environment not found
    echo Run: cd backend ^&^& python -m venv venv
    set /a ERRORS+=1
)
echo.

echo [6/10] Testing backend dependencies...
if exist "backend\venv\Scripts\python.exe" (
    backend\venv\Scripts\python.exe -c "import fastapi; print('[PASS] FastAPI installed')" 2>nul
    if %errorlevel% neq 0 (
        echo [FAIL] Backend dependencies not installed
        echo Run: cd backend ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt
        set /a ERRORS+=1
    )
) else (
    echo [SKIP] Virtual environment not found
)
echo.

echo [7/10] Testing backend imports...
if exist "backend\venv\Scripts\python.exe" (
    backend\venv\Scripts\python.exe -c "from app.main import app; print('[PASS] Backend imports work')" 2>nul
    if %errorlevel% neq 0 (
        echo [FAIL] Backend imports failed
        set /a ERRORS+=1
    )
) else (
    echo [SKIP] Virtual environment not found
)
echo.

echo [8/10] Testing frontend node_modules...
if exist "frontend\node_modules" (
    echo [PASS] Frontend dependencies installed
) else (
    echo [FAIL] Frontend dependencies not installed
    echo Run: cd frontend ^&^& npm install
    set /a ERRORS+=1
)
echo.

echo [9/10] Testing frontend build...
if exist "frontend\node_modules" (
    echo Testing TypeScript compilation...
    cd frontend
    call npm run build >nul 2>&1
    if %errorlevel% neq 0 (
        echo [FAIL] Frontend build failed
        set /a ERRORS+=1
    ) else (
        echo [PASS] Frontend builds successfully
    )
    cd ..
) else (
    echo [SKIP] Frontend dependencies not installed
)
echo.

echo [10/10] Testing configuration files...
set CONFIG_OK=1

if not exist "backend\.env" (
    echo [WARN] backend\.env not found
    set CONFIG_OK=0
)

if not exist "frontend\.env" (
    echo [WARN] frontend\.env not found
    set CONFIG_OK=0
)

if not exist "docker-compose.yml" (
    echo [FAIL] docker-compose.yml not found
    set /a ERRORS+=1
    set CONFIG_OK=0
)

if %CONFIG_OK%==1 (
    echo [PASS] All configuration files present
)
echo.

echo ========================================
echo Test Results
echo ========================================
echo.

if %ERRORS%==0 (
    echo [SUCCESS] All tests passed!
    echo.
    echo Your EquiAudit installation is ready!
    echo.
    echo To start the platform:
    echo   1. Run: quick-start.bat
    echo   2. Or run: start-all.bat
    echo   3. Or manually start services
    echo.
    echo See INSTALLATION_COMPLETE.md for details.
) else (
    echo [FAILED] Some tests failed
    echo.
    echo Please fix the issues above and run setup.bat
    echo.
    echo For help, see SETUP_GUIDE.md
)

echo.
echo ========================================
pause
