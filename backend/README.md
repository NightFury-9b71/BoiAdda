# BoiAdda Backend - Production Ready

## Setup Instructions

### Development Setup

1. **Clone and navigate to the project:**
   ```bash
   cd /home/nomanstine/Desktop/BoiAdda/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the development server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Production Deployment

#### Option 1: Docker Compose (Recommended)

1. **Build and run with PostgreSQL:**
   ```bash
   docker-compose up --build -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

#### Option 2: Manual Production Setup

1. **Install production dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Setup production environment:**
   ```bash
   cp .env.production .env
   # Edit .env with your production configuration
   ```

3. **Run with Gunicorn:**
   ```bash
   gunicorn main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 --workers 4
   ```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| ENVIRONMENT | Application environment | development | No |
| DEBUG | Enable debug mode | true | No |
| SECRET_KEY | JWT secret key | auto-generated | Yes (prod) |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration | 1440 | No |
| DATABASE_URL | Database connection string | SQLite | No |
| CORS_ORIGINS | Allowed CORS origins | localhost | No |
| SEED_DEMO_DATA | Populate sample data | true | No |

### API Documentation

Once running, visit:
- Development: http://localhost:8000/docs
- Production: https://yourdomain.com/docs

### Health Checks

- Health: `GET /healthz`
- Readiness: `GET /readyz`
- App Info: `GET /info`

### Security Features

- ✅ Bcrypt password hashing
- ✅ JWT authentication
- ✅ Environment-based configuration
- ✅ CORS protection
- ✅ Request logging
- ✅ Global exception handling
- ✅ Database connection pooling
- ✅ Production-safe database operations

### Database Migration

For production, consider using Alembic for database migrations:

```bash
pip install alembic
alembic init alembic
# Configure alembic.ini and create migrations
```
