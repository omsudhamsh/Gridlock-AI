from fastapi import APIRouter

from app.models.traffic import IntelligenceBriefing, Prediction, Recommendation
from app.services.mock_traffic import traffic_service
from app.services.nvidia_intelligence import nvidia_intelligence_service

router = APIRouter()


@router.get("/recommendations", response_model=list[Recommendation])
def get_recommendations() -> list[Recommendation]:
    return traffic_service.recommendations()


@router.get("/predictions", response_model=list[Prediction])
def get_predictions() -> list[Prediction]:
    return traffic_service.predictions()


@router.get("/briefing", response_model=IntelligenceBriefing)
def get_briefing() -> IntelligenceBriefing:
    return nvidia_intelligence_service.briefing()
