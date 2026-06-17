from fastapi import APIRouter

from app.models.traffic import Prediction, Recommendation
from app.services.mock_traffic import traffic_service

router = APIRouter()


@router.get("/recommendations", response_model=list[Recommendation])
def get_recommendations() -> list[Recommendation]:
    return traffic_service.recommendations()


@router.get("/predictions", response_model=list[Prediction])
def get_predictions() -> list[Prediction]:
    return traffic_service.predictions()

