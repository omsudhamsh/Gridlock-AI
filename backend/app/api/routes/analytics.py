from fastapi import APIRouter

from app.models.traffic import AnalyticsPoint
from app.services.mock_traffic import traffic_service

router = APIRouter()


@router.get("/traffic-trends", response_model=list[AnalyticsPoint])
def traffic_trends() -> list[AnalyticsPoint]:
    return traffic_service.analytics()

