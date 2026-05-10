@echo off
echo Starting EquiAudit Platform...
echo.

REM Start Docker services
echo [1/3] Starting Docker services...
docker-compose up -d

echo.
echo [2/3] Starting Backend...
start "EquiAudit Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak >nul

echo.
echo [3/3] Starting Frontend...
start "EquiAudit Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo EquiAudit is starting...
echo ========================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo ========================================
