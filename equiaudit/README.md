# EquiAudit

EquiAudit is an AI fairness auditing platform with a React + TypeScript frontend and a FastAPI backend.

## Stack
- Frontend: React, Vite, TypeScript, TailwindCSS, React Query, Zustand
- Backend: FastAPI, SQLAlchemy, Celery, Redis, PostgreSQL
- Infra: Docker Compose, Kubernetes manifests, NGINX, Prometheus/Grafana scaffolding

## Repository Structure
- `equiaudit/frontend`: web application
- `equiaudit/backend`: API, services, workers
- `equiaudit/infrastructure`: deployment and monitoring configs
- `equiaudit/docs`: project documentation

## Local Development
From `equiaudit/`:

1. Start services:
```bash
docker-compose up -d postgres redis
```

2. Start backend:
```bash
start-backend.bat
```

3. Start frontend:
```bash
start-frontend.bat
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

## Notes
- This repository now ignores generated caches/build artifacts (`__pycache__`, `*.pyc`, virtualenvs, frontend build output, node_modules).
- If startup fails, run `check-system.bat` from `equiaudit/`.
