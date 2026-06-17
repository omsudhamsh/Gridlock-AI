from fastapi import APIRouter

from app.models.traffic import DashboardSummary
from app.services.mock_traffic import traffic_service

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary() -> DashboardSummary:
    return traffic_service.dashboard_summary()

