from fastapi import APIRouter

from app.models.traffic import Violation
from app.services.mock_traffic import traffic_service

router = APIRouter()


@router.get("", response_model=list[Violation])
def list_violations() -> list[Violation]:
    return traffic_service.violations()

