# EquiAudit

EquiAudit is a full-stack AI fairness auditing platform with a cyber-style operations dashboard.
It helps teams monitor model behavior, run fairness audits, manage interventions, and generate compliance-style reports.

## Table of Contents
- [What This Project Does](#what-this-project-does)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [How The Website Works](#how-the-website-works)
- [Backend API Overview](#backend-api-overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Run The Project](#run-the-project)
- [Testing](#testing)
- [Docker and Deployment Assets](#docker-and-deployment-assets)
- [Current State and Limitations](#current-state-and-limitations)
- [Roadmap Ideas](#roadmap-ideas)

## What This Project Does
EquiAudit provides:
- model registry operations (list, upload, fetch, delete)
- audit execution and fairness metric retrieval
- intervention enable/disable workflows
- compliance report generation and download
- alert and audit-log monitoring views
- websocket channel for real-time messaging (`/ws`)
- Prometheus scrape endpoint (`/metrics`)

Primary use cases include fairness monitoring in domains like hiring, lending, healthcare, and risk scoring.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack React Query
- Zustand
- Axios
- Recharts
- Framer Motion

### Backend
- FastAPI
- Pydantic
- SQLAlchemy (models/repository scaffolding present)
- Alembic
- PostgreSQL (configured in infra)
- Redis
- Celery
- python-jose + passlib for token/security utilities
- ML libraries included: NumPy, Pandas, scikit-learn, SHAP

### Infrastructure / Ops
- Docker Compose
- NGINX reverse proxy container
- Kubernetes manifests (`infrastructure/kubernetes`)
- Prometheus config
- Grafana dashboard JSON

## System Architecture
High-level flow:
1. User interacts with React UI (`frontend`).
2. UI calls REST APIs under `http://localhost:8000/api/v1`.
3. FastAPI routes process requests and currently rely mainly on in-memory state from `backend/app/data/store.py`.
4. WebSocket endpoint `/ws` supports broadcast-style real-time messages.
5. `/metrics` exposes a Prometheus-compatible plain-text metric payload.
6. Docker/K8s assets provide runtime/deployment scaffolding for Postgres, Redis, backend, frontend, and proxying.

## How The Website Works

### 1) Routing and access control
- Public routes:
  - `/` landing page
  - `/login` login page
- Protected routes (via `ProtectedRoute` + Zustand auth store token):
  - `/dashboard`
  - `/dashboard/models`
  - `/dashboard/audits`
  - `/dashboard/interventions`
  - `/dashboard/reports`
  - `/dashboard/alerts`
  - `/dashboard/settings`

### 2) Authentication flow
- Login form calls `POST /api/v1/auth/login`.
- Backend returns bearer token (`access_token`).
- Token is stored by frontend token service and attached to outgoing Axios requests.
- On `401`, frontend clears session and redirects to `/login`.

Note: current backend login is prototype logic that accepts any non-empty email/password.

### 3) Dashboard behavior
- Dashboard uses React Query to fetch audit logs from `GET /api/v1/audit-logs/`.
- KPI-style cards and audit terminal feed are rendered from API data.

### 4) Models workflow
- Fetch models: `GET /api/v1/models/`
- Upload model: `POST /api/v1/models/upload` (multipart form-data)
- View model details: `GET /api/v1/models/{id}`
- Delete model: `DELETE /api/v1/models/{id}`

### 5) Audits workflow
- Run audit for a model: `POST /api/v1/audits/run/{model_id}`
- Fetch audit metrics: `GET /api/v1/audits/{audit_id}/metrics`
- Metrics currently include demographic parity, equalized odds, and disparate impact.

### 6) Interventions workflow
- List interventions: `GET /api/v1/interventions/`
- Enable intervention: `POST /api/v1/interventions/{model_id}/enable`
- Disable intervention: `POST /api/v1/interventions/{model_id}/disable`
- Preview impact: `GET /api/v1/interventions/{model_id}/preview`

### 7) Reports workflow
- List reports: `GET /api/v1/reports/`
- Generate report: `POST /api/v1/reports/generate`
- Download report: `GET /api/v1/reports/{report_id}/download`

### 8) Alerts and metrics workflow
- Alerts: `GET /api/v1/alerts/`
- Update thresholds: `POST /api/v1/alerts/thresholds`
- Summary cards data: `GET /api/v1/metrics/summary`
- Infrastructure metric endpoint: `GET /metrics`

### 9) Real-time channel
- WebSocket endpoint: `ws://localhost:8000/ws`
- Current behavior: broadcast incoming text messages to all connected clients.

## Backend API Overview
Base path: `/api/v1`

- Auth: `/auth/login`, `/auth/refresh`
- Users: `/users/me`
- Models: `/models`, `/models/{id}`, `/models/upload`
- Audits: `/audits/run/{model_id}`, `/audits/{audit_id}/metrics`
- Interventions: `/interventions/*`
- Reports: `/reports/*`
- Alerts: `/alerts/*`
- Audit Logs: `/audit-logs/`
- Summary Metrics: `/metrics/summary`

Interactive docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```text
equiaudit/
  backend/
    app/
      api/               # FastAPI routers and route modules
      core/              # config, security, db/websocket primitives
      data/store.py      # in-memory state used by active routes
      models/            # SQLAlchemy models (scaffolding)
      repositories/      # repository scaffolding
      schemas/           # Pydantic schemas
      services/          # fairness/auth/report/etc service modules
      workers/           # Celery app/tasks
    tests/               # backend tests
    requirements.txt
    Dockerfile
  frontend/
    src/
      app/               # router/providers/stores
      pages/             # route-level UI screens
      components/        # reusable UI units
      services/          # API/auth/websocket clients
      hooks/             # custom hooks
      constants/         # shared constants and endpoint config
      styles/            # global/theme/animation styles
    public/              # static assets
    package.json
  infrastructure/
    kubernetes/
    nginx/
    prometheus/
    grafana/
  docker-compose.yml
  setup.bat
  quick-start.bat
  start-all.bat
```

## Prerequisites
- Python 3.11+
- Node.js 18+
- npm
- Docker Desktop (recommended)

## Environment Configuration

### Backend (`backend/.env`)

```env
APP_NAME=EquiAudit
APP_VERSION=4.2.0
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/equiaudit
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REDIS_URL=redis://localhost:6379
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=EquiAudit
VITE_APP_VERSION=4.2.0
```

## Run The Project

### Option A: Windows helper scripts
From `equiaudit/`:

```bat
check-system.bat
setup.bat
quick-start.bat
```

Or directly:

```bat
start-all.bat
```

### Option B: Manual local run

1. Start infra services:

```bash
docker-compose up -d postgres redis
```

2. Start backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. Start frontend (new terminal):

```bash
cd frontend
npm install
npm run dev
```

### Local URLs
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- WebSocket: `ws://localhost:8000/ws`

## Testing

### Backend tests

```bash
cd backend
python -m pytest
```

### Frontend build check

```bash
cd frontend
npm run build
```

There is also a Windows validation script:

```bat
test-installation.bat
```

## Docker and Deployment Assets

### Docker Compose services
Defined in `docker-compose.yml`:
- frontend
- backend
- postgres
- redis
- nginx

### Kubernetes manifests
Available in `infrastructure/kubernetes`:
- namespace
- backend/frontend deployments and services
- postgres
- redis
- celery worker
- ingress

### Monitoring assets
- Prometheus config: `infrastructure/prometheus/prometheus.yml`
- Grafana dashboard: `infrastructure/grafana/dashboards/equiaudit-dashboard.json`

## Current State and Limitations
- The API architecture is production-style, but many active routes currently use in-memory data from `backend/app/data/store.py`.
- Auth is currently simplified prototype logic.
- SQLAlchemy models, repositories, fairness service modules, Celery, and explainability modules are present as scaffolding/extension points.
- `GET /metrics` currently returns a minimal `equiaudit_up` gauge.

## Roadmap Ideas
- Replace memory store with full PostgreSQL-backed persistence.
- Add strict credential validation and role-based authorization.
- Wire fairness services to real model outputs/datasets.
- Add authenticated/typed WebSocket event channels.
- Expand Prometheus/Grafana with business and model-health KPIs.
- Add CI pipeline for linting, tests, and deployment checks.