# EquiAudit - AI Governance & Fairness Auditing Platform

<div align="center">

![EquiAudit](https://img.shields.io/badge/EquiAudit-v4.2.0-00ff9f?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.14-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript)

**A futuristic AI governance and fairness auditing platform for monitoring, detecting, explaining, and mitigating bias in high-stakes AI systems.**

</div>

---

## 🚀 Quick Start

### Prerequisites Check

Run the system check script:
```bash
check-system.bat
```

### One-Command Setup

```bash
setup.bat
```

This will:
- ✅ Start PostgreSQL and Redis with Docker
- ✅ Create Python virtual environment
- ✅ Install all backend dependencies
- ✅ Initialize database
- ✅ Install all frontend dependencies

### Start the Platform

**Option 1: Start Everything at Once**
```bash
start-all.bat
```

**Option 2: Start Services Separately**

Terminal 1 - Backend:
```bash
start-backend.bat
```

Terminal 2 - Frontend:
```bash
start-frontend.bat
```

### Access the Platform

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:8000
- 📚 **API Documentation**: http://localhost:8000/docs
- 🗄️ **PostgreSQL**: localhost:5432
- 🔴 **Redis**: localhost:6379

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     EquiAudit Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Frontend   │◄───────►│   Backend    │                 │
│  │ React + TS   │  REST   │   FastAPI    │                 │
│  │   + Vite     │   API   │   + Python   │                 │
│  └──────────────┘         └──────┬───────┘                 │
│                                   │                          │
│                          ┌────────┴────────┐                │
│                          │                 │                │
│                   ┌──────▼──────┐   ┌─────▼─────┐          │
│                   │  PostgreSQL │   │   Redis   │          │
│                   │  Database   │   │   Cache   │          │
│                   └─────────────┘   └───────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
equiaudit/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── routes/        # Endpoint handlers
│   │   │   │   ├── auth.py
│   │   │   │   ├── models.py
│   │   │   │   ├── audits.py
│   │   │   │   ├── interventions.py
│   │   │   │   ├── reports.py
│   │   │   │   ├── alerts.py
│   │   │   │   └── users.py
│   │   │   └── router.py      # Main router
│   │   ├── core/              # Core Configuration
│   │   │   ├── config.py      # Settings
│   │   │   ├── database.py    # DB connection
│   │   │   ├── security.py    # JWT & Auth
│   │   │   └── redis.py       # Redis client
│   │   ├── models/            # SQLAlchemy Models
│   │   ├── schemas/           # Pydantic Schemas
│   │   ├── services/          # Business Logic
│   │   └── main.py            # App Entry Point
│   ├── requirements.txt       # Python Dependencies
│   └── .env                   # Environment Variables
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── app/               # App Configuration
│   │   │   ├── providers/     # Context Providers
│   │   │   ├── router/        # Route Configuration
│   │   │   └── store/         # Zustand Stores
│   │   ├── components/        # React Components
│   │   │   ├── cards/
│   │   │   ├── charts/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── forms/
│   │   │   ├── layout/
│   │   │   ├── modals/
│   │   │   ├── tables/
│   │   │   └── terminal/
│   │   ├── pages/             # Page Components
│   │   │   ├── landing/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── models/
│   │   │   ├── audits/
│   │   │   ├── interventions/
│   │   │   ├── reports/
│   │   │   ├── alerts/
│   │   │   └── settings/
│   │   ├── services/          # API Services
│   │   │   ├── api/           # API Clients
│   │   │   ├── auth/          # Auth Service
│   │   │   └── websocket/     # WebSocket Client
│   │   ├── types/             # TypeScript Types
│   │   ├── utils/             # Utility Functions
│   │   ├── constants/         # Constants
│   │   ├── styles/            # Global Styles
│   │   ├── App.tsx            # Root Component
│   │   └── main.tsx           # Entry Point
│   ├── package.json           # Node Dependencies
│   ├── vite.config.ts         # Vite Configuration
│   ├── tailwind.config.ts     # Tailwind Config
│   └── .env                   # Environment Variables
│
├── docker-compose.yml         # Docker Services
├── setup.bat                  # Setup Script
├── start-all.bat              # Start All Services
├── start-backend.bat          # Start Backend Only
├── start-frontend.bat         # Start Frontend Only
├── check-system.bat           # System Check
└── SETUP_GUIDE.md             # Detailed Setup Guide
```

---

## 🎯 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Secure token management
- Session persistence

### 🤖 AI Model Management
- Register and monitor AI models
- Track model performance
- View model metadata
- Upload model artifacts

### 📊 Fairness Auditing
- Demographic parity analysis
- Equalized odds computation
- Disparate impact detection
- Calibration scoring
- Bias drift monitoring

### 🔍 Explainability
- SHAP value computation
- Feature importance analysis
- Proxy variable detection
- Prediction explanations

### 🛡️ Intervention Protocols
- Reweighing
- Adversarial debiasing
- Reject-option classification
- Optimized preprocessing
- Real-time mitigation

### 📈 Reporting & Compliance
- Automated report generation
- GDPR Article 22 compliance
- EU AI Act reporting
- EEOC audit exports
- PDF report downloads

### 🚨 Real-Time Alerts
- Fairness threshold monitoring
- Critical disparity detection
- WebSocket live updates
- Anomaly notifications

### 🎨 Cyberpunk UI
- Dark theme with neon accents
- Animated dashboard elements
- Terminal-style telemetry
- Futuristic typography
- Responsive design

---

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI 0.109
- **Language**: Python 3.14
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic 2.5
- **Auth**: JWT (python-jose)
- **Password**: bcrypt (passlib)
- **ML**: scikit-learn, SHAP, pandas, numpy
- **Async**: Celery

### Frontend
- **Framework**: React 18.3
- **Language**: TypeScript 5.5
- **Build Tool**: Vite 5.4
- **Styling**: TailwindCSS 3.4
- **State**: Zustand 4.5
- **Data Fetching**: TanStack Query 5.56
- **HTTP Client**: Axios 1.7
- **Routing**: React Router 6.26
- **Charts**: Recharts 2.12
- **Animation**: Framer Motion 11.3
- **Icons**: Lucide React

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: NGINX (optional)
- **Monitoring**: Prometheus + Grafana (optional)

---

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
APP_NAME=EquiAudit
APP_VERSION=4.2.0
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/equiaudit
SECRET_KEY=super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REDIS_URL=redis://localhost:6379
```

### Frontend Environment Variables

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=EquiAudit
VITE_APP_VERSION=4.2.0
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/me` - Get current user

### Models
- `GET /api/v1/models` - List all models
- `POST /api/v1/models/upload` - Upload model
- `GET /api/v1/models/{id}` - Get model details
- `DELETE /api/v1/models/{id}` - Delete model

### Audits
- `POST /api/v1/audits/run/{id}` - Run audit
- `GET /api/v1/audits/{id}/metrics` - Get audit metrics

### Interventions
- `GET /api/v1/interventions` - List interventions
- `POST /api/v1/interventions/{model_id}/enable` - Enable intervention

### Reports
- `GET /api/v1/reports` - List reports
- `POST /api/v1/reports/generate` - Generate report

### Alerts
- `GET /api/v1/alerts` - Get alerts

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
venv\Scripts\activate
pytest
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 🐛 Troubleshooting

### Docker Issues
```bash
# Check if Docker is running
docker ps

# Restart Docker services
docker-compose down
docker-compose up -d

# View logs
docker-compose logs -f
```

### Backend Issues
```bash
# Check if virtual environment is activated
# You should see (venv) in your terminal

# Reinstall dependencies
pip install -r requirements.txt

# Check database connection
python -c "from app.core.database import engine; print(engine)"
```

### Frontend Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

### Port Already in Use
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

---

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [API Documentation](http://localhost:8000/docs) - Interactive API docs
- [Architecture Guide](docs/architecture.md) - System architecture
- [Development Guide](docs/development.md) - Development workflow

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- FastAPI for the amazing backend framework
- React team for the frontend library
- TailwindCSS for the styling system
- SHAP for explainability tools

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting guide
- Review the setup documentation

---

<div align="center">

**Built with ❤️ for AI Governance and Fairness**

</div>
