from fastapi import APIRouter

from app.api.routes import analytics, dashboard, intelligence, traffic, violations

api_router = APIRouter()
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(traffic.router, prefix="/traffic", tags=["Traffic Map"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["Decision Intelligence"])
api_router.include_router(violations.router, prefix="/violations", tags=["Violations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

