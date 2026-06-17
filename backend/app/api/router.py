from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.api.routes import analytics, auth, dashboard, intelligence, traffic, violations

api_router = APIRouter()
protected_dependencies = [Depends(get_current_user)]

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"], dependencies=protected_dependencies)
api_router.include_router(traffic.router, prefix="/traffic", tags=["Traffic Map"], dependencies=protected_dependencies)
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["Decision Intelligence"], dependencies=protected_dependencies)
api_router.include_router(violations.router, prefix="/violations", tags=["Violations"], dependencies=protected_dependencies)
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"], dependencies=protected_dependencies)
