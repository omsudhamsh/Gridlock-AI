# Gridlock AI Architecture

## Overview

Gridlock AI is a decision support platform for Bengaluru traffic operations. The prototype is intentionally lightweight for hackathon development, but the boundaries mirror a deployable Smart City solution.

```text
React Command Center
        |
        | REST / JSON
        v
FastAPI Intelligence Engine
        |
        +-- Traffic simulation and decision service
        +-- Future AI inference adapters
        +-- Future PostgreSQL/PostGIS repositories
```

## Runtime Layers

### Frontend

React, Vite, TypeScript, Tailwind CSS, Framer Motion, Chart.js, Lucide Icons, and Axios. The app is dark-mode first and organized into routed operational pages: dashboard, live map, congestion analysis, violations, predictions, analytics, reports, settings, auth, profile, and 404.

### Backend

FastAPI with an application factory, feature routers, Pydantic response models, and a deterministic mock traffic simulation service. The service emits road segments, dashboard metrics, violations, prediction horizons, analytics trends, and decision recommendations.

### AI Layer

The current AI layer is represented by lightweight deterministic services and documented extension points. Production integration should add:

- YOLOv11 Nano for vehicle and violation detection.
- OpenCV preprocessing for camera frames.
- Scikit-learn/XGBoost for short-horizon congestion prediction.
- NetworkX for emergency route prioritization.
- PostGIS for spatial filtering and hotspot persistence.

## API Flow

1. The frontend requests `/api/*` resources through Axios.
2. FastAPI validates query parameters and response contracts.
3. The domain service produces live-like Bengaluru traffic data.
4. The frontend renders metric cards, recommendations, road density layers, tables, and charts.

## Deployment Target

- Frontend: Vercel static build.
- Backend: Render web service running Uvicorn.
- Database: Supabase PostgreSQL/PostGIS when persistence is added.
- Storage: Cloudinary/Supabase Storage for camera snapshots and evidence media.

## Design Priorities

- Clear domain contracts before ML implementation.
- Modular API routes by feature.
- Mock data that preserves realistic operating behavior.
- Small dependency footprint for 8 GB RAM development machines.
- Frontend that starts as the operational product surface, not a landing page.
