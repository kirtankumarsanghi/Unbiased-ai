# 🚀 START HERE - EquiAudit Quick Start Guide

## ✅ Installation Status

Your EquiAudit platform has been set up with:

- ✅ **Backend**: Python FastAPI with all dependencies installed
- ✅ **Frontend**: React + TypeScript with all dependencies installed
- ✅ **Configuration**: Environment files created
- ✅ **Docker**: docker-compose.yml ready for PostgreSQL and Redis

## 🎯 What You Need Before Starting

### Required (Must Have)
1. **Docker Desktop** - For PostgreSQL and Redis
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop
   - Verify: Run `docker ps` in terminal

### Already Installed ✅
- Python 3.14.0
- Node.js v18.20.8
- All backend Python packages
- All frontend Node packages

## 🚀 How to Start (3 Simple Steps)

### Step 1: Install Docker Desktop (if not installed)
1. Download from https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Wait for Docker to be running (check system tray icon)

### Step 2: Start the Platform
Double-click this file:
```
quick-start.bat
```

This will automatically:
- Start PostgreSQL database
- Start Redis cache
- Start backend API server
- Start frontend web server
- Open the app in your browser

### Step 3: Login and Explore
- The browser will open to http://localhost:5173
- Use test credentials:
  - Email: `admin@equiaudit.com`
  - Password: `admin123`

## 📋 Alternative Start Methods

### Method 1: All-in-One
```bash
start-all.bat
```

### Method 2: Manual (3 terminals)

**Terminal 1 - Docker Services:**
```bash
docker-compose up -d
```

**Terminal 2 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main application |
| **Backend** | http://localhost:8000 | API server |
| **API Docs** | http://localhost:8000/docs | Interactive API docs |

## 🎨 What You'll See

### Landing Page
- Futuristic cyberpunk interface
- Animated dashboard elements
- Platform overview
- Login button

### Dashboard (After Login)
- **Dashboard**: Overview with metrics
- **Models**: AI model management
- **Audits**: Fairness auditing tools
- **Interventions**: Bias mitigation
- **Reports**: Compliance reports
- **Alerts**: Real-time notifications
- **Settings**: Configuration

## 🛠️ Troubleshooting

### "Docker is not running"
1. Start Docker Desktop
2. Wait for it to fully start (green icon in system tray)
3. Run `docker ps` to verify
4. Try starting again

### "Port already in use"
**For port 8000 (backend):**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**For port 5173 (frontend):**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Backend won't start
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend won't start
```bash
cd frontend
npm install
```

## 📚 Documentation Files

- **START_HERE.md** (this file) - Quick start guide
- **INSTALLATION_COMPLETE.md** - Detailed installation info
- **SETUP_GUIDE.md** - Complete setup instructions
- **README.md** - Project overview and architecture

## 🎯 Quick Commands

### Start Everything
```bash
quick-start.bat
```

### Stop Everything
Press `Ctrl+C` in each terminal, then:
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### View Logs
```bash
docker-compose logs -f
```

### Check Status
```bash
docker-compose ps
```

## 💡 Tips

1. **First Time Setup**: Make sure Docker Desktop is installed and running
2. **Auto-Reload**: Both backend and frontend auto-reload on code changes
3. **API Testing**: Use http://localhost:8000/docs for interactive API testing
4. **Browser Console**: Press F12 to see frontend logs and errors
5. **Backend Logs**: Check the terminal where backend is running

## 🎉 You're Ready!

Your EquiAudit platform is fully set up and ready to use!

**Next Steps:**
1. Install Docker Desktop (if not already installed)
2. Run `quick-start.bat`
3. Login with test credentials
4. Explore the platform

**Need Help?**
- Check INSTALLATION_COMPLETE.md for detailed info
- Check SETUP_GUIDE.md for troubleshooting
- Review README.md for architecture details

---

<div align="center">

**🚀 Let's Start Auditing AI Systems! 🚀**

*EquiAudit - Making AI Fair and Accountable*

</div>
