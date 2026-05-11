# EquiAudit Setup Guide

## Prerequisites

✅ **Already Installed:**
- Python 3.14.0
- Node.js v18.20.8

❌ **Need to Install:**
- PostgreSQL (or use Docker)
- Redis (or use Docker)

## Quick Setup Options

### Option 1: Using Docker (Recommended)

This is the easiest way to get PostgreSQL and Redis running without installing them directly.

1. **Install Docker Desktop for Windows**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop

2. **Start Services**
   ```bash
   cd "d:\Kirtan Folder\Unbiased ai\equiaudit"
   docker-compose up -d
   ```

### Option 2: Manual Installation

#### Install PostgreSQL
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user
4. Update `backend/.env` with your password

#### Install Redis
1. Download from: https://github.com/microsoftarchive/redis/releases
2. Or use WSL2 with Redis
3. Or use Docker for Redis only

## Setup Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd "d:\Kirtan Folder\Unbiased ai\equiaudit\backend"

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
alembic upgrade head

# Run backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

### 2. Frontend Setup

```bash
# Open a new terminal
cd "d:\Kirtan Folder\Unbiased ai\equiaudit\frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

## Verification

1. **Backend API**: Visit http://localhost:8000/docs
2. **Frontend**: Visit http://localhost:5173
3. **Database**: Should be running on localhost:5432
4. **Redis**: Should be running on localhost:6379

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check credentials in `backend/.env`
- Verify DATABASE_URL format

### Redis Connection Issues
- Ensure Redis is running
- Check REDIS_URL in `backend/.env`

### Frontend Build Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Backend Import Issues
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

## Default Credentials

For testing purposes:
- Email: admin@equiaudit.com
- Password: Admin@123

## Next Steps

1. Start backend server
2. Start frontend server
3. Open http://localhost:5173
4. Login with test credentials
5. Explore the dashboard

## Architecture

```
EquiAudit/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── core/     # Core config
│   │   ├── models/   # Database models
│   │   ├── schemas/  # Pydantic schemas
│   │   └── services/ # Business logic
│   └── requirements.txt
├── frontend/         # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
└── docker-compose.yml
```

## Support

For issues, check:
1. This setup guide
2. Backend logs
3. Frontend console
4. Docker logs (if using Docker)
