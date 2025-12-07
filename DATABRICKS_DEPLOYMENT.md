# Deploying Tuva EMPI to Databricks Apps

This guide covers deploying both the frontend and backend to Databricks Apps.

## Architecture

```
┌─────────────────────────────────────────┐
│         Databricks Apps                 │
│                                         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │   Frontend   │  │    Backend      │ │
│  │ Node.js/React│→ │  Python/Django  │ │
│  │  Port: 3000  │  │   Port: 8000    │ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────┘
```

## Prerequisites

1. **Databricks CLI** (v0.229.0+)
   ```bash
   pip install databricks-cli
   databricks configure
   ```

2. **Databricks Workspace** with serverless compute enabled

3. **Environment Configuration** for both apps

---

## Backend Deployment (Python/Django)

### 1. Configure Backend Environment

Edit `backend/app.yaml` and set your environment variables:

```yaml
env:
  - name: DATABASE_URL
    value: "postgresql://user:pass@host:5432/dbname"
  - name: SECRET_KEY
    value: "your-django-secret-key"
  - name: ALLOWED_HOSTS
    value: ".databricks.com,localhost"
  - name: CORS_ALLOWED_ORIGINS
    value: "https://your-frontend-url.databricks.com"
```

### 2. Deploy Backend

```bash
cd backend
databricks apps deploy tuva-empi-backend
```

### 3. Get Backend URL

```bash
databricks apps list
# Note the URL for your backend app
```

---

## Frontend Deployment (Node.js/React)

### 1. Configure Frontend Environment

Edit `frontend/app.yaml` and set the backend API URL:

```yaml
env:
  - name: VITE_API_BASE_URL
    value: "https://your-backend-url.databricks.com/api/"
```

### 2. Deploy Frontend

```bash
cd frontend
databricks apps deploy tuva-empi-frontend
```

### 3. Access Your Application

```bash
databricks apps list
# Get the URL for your frontend app
```

---

## What Databricks Does Automatically

### For Backend (Python):
1. ✅ Detects `requirements.txt`
2. ✅ Runs `pip install -r requirements.txt`
3. ✅ Executes command from `app.yaml` (starts gunicorn)

### For Frontend (Node.js):
1. ✅ Detects `package.json`
2. ✅ Runs `npm install`
3. ✅ Runs `npm run build` (Vite builds React app)
4. ✅ Runs `npm run start` (Express serves the app)

---

## File Structure

```
tuva_empi/
├── backend/
│   ├── app.yaml              ← Databricks config (CREATED)
│   ├── requirements.txt      ← Python deps (EXISTS)
│   ├── requirements-dev.txt  ← Dev deps (EXISTS)
│   ├── manage.py
│   └── tuva_empi/
│       └── wsgi.py
│
├── frontend/
│   ├── app.yaml              ← Databricks config (CREATED)
│   ├── package.json          ← Node.js deps (UPDATED)
│   ├── server.js             ← Express server (CREATED)
│   ├── vite.config.ts        ← Vite config (CREATED)
│   ├── index.html            ← Entry point (CREATED)
│   └── src/
│       ├── main.tsx          ← React root (CREATED)
│       ├── App.tsx           ← Main app (CREATED)
│       └── pages/
│           └── PersonMatchPage.tsx
│
└── DATABRICKS_DEPLOYMENT.md  ← This file
```

---

## Environment Variables Reference

### Backend Required Variables:
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/tuva_empi` |
| `SECRET_KEY` | Django secret key | `your-secret-key-here` |
| `ALLOWED_HOSTS` | Allowed host domains | `.databricks.com,localhost` |
| `CORS_ALLOWED_ORIGINS` | Frontend URLs for CORS | `https://frontend.databricks.com` |

### Frontend Required Variables:
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://backend.databricks.com/api/` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `production` |

---

## Monitoring & Troubleshooting

### View Logs

```bash
# Backend logs
databricks apps logs tuva-empi-backend

# Frontend logs
databricks apps logs tuva-empi-frontend
```

### Restart Apps

```bash
databricks apps restart tuva-empi-backend
databricks apps restart tuva-empi-frontend
```

### Update Apps

After making changes:

```bash
# Update backend
cd backend
databricks apps deploy tuva-empi-backend

# Update frontend
cd frontend
databricks apps deploy tuva-empi-frontend
```

---

## Key Differences from Docker Compose

| Feature | Docker Compose | Databricks Apps |
|---------|----------------|-----------------|
| Configuration | `docker-compose.yml` | `app.yaml` per service |
| Networking | Internal network | Public URLs |
| Scaling | Manual | Automatic (serverless) |
| Dependencies | Python: `requirements.txt`<br>Node: `package.json` | Same ✅ |
| Deployment | `docker-compose up` | `databricks apps deploy` |

---

## Production Checklist

- [ ] Set `SECRET_KEY` in backend environment
- [ ] Configure database connection (`DATABASE_URL`)
- [ ] Set `ALLOWED_HOSTS` to include your Databricks domain
- [ ] Configure CORS to allow frontend domain
- [ ] Set `VITE_API_BASE_URL` to backend URL
- [ ] Test backend API endpoints
- [ ] Test frontend can connect to backend
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy for database

---

## Common Issues

### Issue: Frontend can't connect to backend
**Solution**: Update `CORS_ALLOWED_ORIGINS` in backend to include frontend URL

### Issue: 502 Bad Gateway
**Solution**: Check backend logs, ensure database is accessible

### Issue: Environment variables not loading
**Solution**: Verify `app.yaml` syntax and redeploy

### Issue: Build fails
**Solution**: Check logs, ensure all dependencies are in requirements.txt/package.json

---

## Next Steps

1. Deploy backend first
2. Note backend URL
3. Update frontend configuration with backend URL
4. Deploy frontend
5. Test the application end-to-end

For more information, visit the [Databricks Apps documentation](https://docs.databricks.com/aws/en/dev-tools/databricks-apps).

