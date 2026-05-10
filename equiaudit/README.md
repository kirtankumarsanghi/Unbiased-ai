# EquiAudit

Enterprise-focused AI fairness auditing and accountability platform.

EquiAudit provides a cyber-style control center for monitoring model fairness, running audits, generating reports, and tracking intervention protocols across high-stakes AI domains.

## Table of Contents
- [Overview](#overview)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Runbook](#runbook)
- [API Reference](#api-reference)
- [WebSocket and Metrics](#websocket-and-metrics)
- [Docker and Infrastructure](#docker-and-infrastructure)
- [Testing and Quality](#testing-and-quality)
- [Troubleshooting](#troubleshooting)
- [Current Implementation Notes](#current-implementation-notes)
- [Roadmap Suggestions](#roadmap-suggestions)
- [License](#license)

## Overview
EquiAudit is a full-stack platform built to support:
- fairness monitoring for ML systems
- intervention lifecycle management
- explainability and accountability workflows
- regulatory-style reporting interfaces

Primary use cases:
- hiring systems
- lending decisions
- healthcare risk prediction
- legal risk scoring
- enterprise predictive analytics

## Core Features
- JWT-based authentication flow
- model registry and model lifecycle endpoints
- fairness audit triggers and metrics retrieval
- intervention protocol activation/deactivation
- report generation and download
- alert stream and audit logs
- real-time channel via WebSocket endpoint
- Prometheus-compatible health metric endpoint

## Architecture
High-level flow:
1. React frontend calls FastAPI REST APIs (`/api/v1/*`).
2. Backend serves data from service/route layers.
3. Redis and Celery are available for async workloads.
4. PostgreSQL is defined for persistence.
5. WebSocket endpoint (`/ws`) supports live broadcast.
6. Prometheus scrapes `/metrics`.

## Tech Stack
### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query
- Zustand
- Axios
- Recharts

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- PostgreSQL (configured)
- Redis
- Celery
- SHAP / scikit-learn / pandas / numpy

### Infrastructure
- Docker Compose
- Kubernetes manifests
- NGINX reverse proxy
- Prometheus + Grafana scaffolding

## Repository Structure
```text
equiaudit/
  backend/                 # FastAPI application and workers
    app/
      api/                # Routers and route handlers
      core/               # Config/security/db/websocket primitives
      data/               # In-memory store (current implementation path)
      models/             # SQLAlchemy models
      repositories/       # Repository layer scaffolding
      schemas/            # Pydantic schemas
      services/           # Business/service modules
      workers/            # Celery app and tasks
    alembic/              # Migration scaffolding
    requirements.txt
  frontend/               # React + TypeScript app
    src/
      app/                # providers/router/store
      components/
      pages/
      services/
      hooks/
      constants/
      styles/
  infrastructure/         # nginx/k8s/prometheus/grafana assets
  docker-compose.yml
  setup.bat
  start-all.bat
  start-backend.bat
  start-frontend.bat
  check-system.bat
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm
- Docker Desktop (recommended)

### Option A: One-command setup (Windows)
From `equiaudit/`:
```bat
setup.bat
```

Then start everything:
```bat
start-all.bat
```

### Option B: Manual startup
From `equiaudit/`:

1. Start infra:
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

### Service URLs
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- OpenAPI docs: `http://localhost:8000/docs`
- WebSocket: `ws://localhost:8000/ws`

## Configuration

### Backend (`backend/.env`)
```env
APP_NAME=EquiAudit
APP_VERSION=4.2.0
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/equiaudit
SECRET_KEY=super-secret-key
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

## Runbook

### Start checks
```bat
check-system.bat
```

### Backend dev
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend dev
```bash
cd frontend
npm run dev
```

### Build frontend
```bash
cd frontend
npm run build
```

## API Reference
Base prefix: `/api/v1`

### Auth
- `POST /auth/login`
- `POST /auth/refresh`

### Users
- `GET /users/me`

### Models
- `GET /models`
- `GET /models/{model_id}`
- `POST /models/upload`
- `DELETE /models/{model_id}`

### Audits
- `POST /audits/run/{model_id}`
- `GET /audits/{audit_id}/metrics`

### Interventions
- `GET /interventions`
- `POST /interventions/{model_id}/enable`
- `POST /interventions/{model_id}/disable`
- `GET /interventions/{model_id}/preview`

### Reports
- `GET /reports`
- `POST /reports/generate`
- `GET /reports/{report_id}/download`

### Alerts and Metrics
- `GET /alerts`
- `POST /alerts/thresholds`
- `GET /audit-logs`
- `GET /metrics/summary`

## WebSocket and Metrics
- WebSocket endpoint: `/ws`
- Prometheus scrape endpoint: `/metrics`

Current metric payload includes a basic `equiaudit_up` gauge.

## Docker and Infrastructure

### Compose services
Defined in `docker-compose.yml`:
- `frontend`
- `backend`
- `postgres`
- `redis`
- `nginx`

### Kubernetes manifests
Located in `infrastructure/kubernetes`:
- namespace
- backend/frontend deployments + services
- postgres + redis
- celery worker
- ingress

### Monitoring assets
- Prometheus config: `infrastructure/prometheus/prometheus.yml`
- Grafana dashboard JSON: `infrastructure/grafana/dashboards/equiaudit-dashboard.json`

## Testing and Quality

### Backend tests
```bash
cd backend
python -m pytest
```

### Frontend type/build checks
```bash
cd frontend
npm run build
```

### Recommended additions
- backend linting (`ruff`/`flake8`)
- frontend unit tests (Vitest + RTL)
- e2e tests (Playwright)
- CI pipeline for build + test + security checks

## Troubleshooting

### Backend not reachable from frontend
- verify backend is running on `:8000`
- verify `frontend/.env` API URL matches backend
- restart Vite after env changes

### Docker service issues
```bash
docker-compose ps
docker-compose logs -f
```

### Port conflict
- `5173` (frontend), `8000` (backend), `5432` (Postgres), `6379` (Redis)

### Python dependencies fail
- recreate venv
- ensure pip/setuptools are updated

## Current Implementation Notes
- The platform includes both scaffolded enterprise architecture and active prototype pathways.
- Several backend feature flows currently rely on in-memory data in `backend/app/data/store.py`.
- SQLAlchemy/Celery/SHAP modules are present and ready for deeper production integration.

## Roadmap Suggestions
- move all routes to repository/service + DB-backed persistence
- implement full fairness metric pipeline against real model outputs
- implement authenticated WebSocket channels
- expand Prometheus/Grafana dashboards with business and model KPIs
- enforce RBAC and stricter security policies for production

## License
Add your preferred license (MIT/Apache-2.0/etc.) and include a `LICENSE` file.
