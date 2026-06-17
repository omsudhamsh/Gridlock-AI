# Gridlock AI

Bengaluru Traffic Intelligence Platform for Gridlock Hackathon 2.0.

Gridlock AI is a production-quality prototype for a traffic command center decision support system. It combines a FastAPI intelligence engine with a dark, responsive React dashboard for monitoring congestion, violations, predictions, emergency alerts, and recommended traffic interventions.

## Current Scope

- FastAPI backend with typed Pydantic contracts.
- Realistic Bengaluru mock traffic simulation.
- Decision recommendation endpoints with priority, confidence, expected improvement, and estimated time saved.
- React + Vite + TypeScript frontend with command center navigation.
- Dashboard, live traffic map, congestion analysis, violation monitoring, predictions, analytics, reports, settings, auth/profile placeholders, and 404 route.
- Chart.js analytics and responsive Tailwind UI.
- Lightweight test coverage for core API contracts.

## Folder Structure

```text
backend/
  app/
    api/              FastAPI routers grouped by feature
    core/             app factory and settings
    models/           Pydantic response models
    services/         mock simulation and decision logic
  tests/              backend API tests
frontend/
  src/
    components/       shell, metrics, map, charts
    pages/            routed command center views
    services/         API client and TypeScript contracts
    data/             frontend fallback data
ai/
  models/             lightweight model placeholders
  datasets/           dataset notes/placeholders
architecture/         architecture documentation
docs/                 setup, deployment, and feature docs
```

## Run Locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open `http://127.0.0.1:8000/docs` for Swagger documentation.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## API Highlights

- `GET /api/dashboard/summary`
- `GET /api/traffic/segments`
- `GET /api/intelligence/recommendations`
- `GET /api/intelligence/predictions`
- `GET /api/violations`
- `GET /api/analytics/traffic-trends`

## Future Scope

- Replace mock simulation with live feeds from camera, IoT, and incident systems.
- Add PostgreSQL/PostGIS persistence with Alembic migrations.
- Integrate YOLOv11 Nano inference for vehicle and violation detection.
- Add authenticated role-based workflows for command center operators.
- Add emergency route optimization using NetworkX and road graph data.
