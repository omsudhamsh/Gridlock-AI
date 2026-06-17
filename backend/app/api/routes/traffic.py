from fastapi import APIRouter, Query

from app.models.traffic import RoadSegment
from app.services.mock_traffic import traffic_service

router = APIRouter()


@router.get("/segments", response_model=list[RoadSegment])
def list_road_segments(
    min_density: int = Query(0, ge=0, le=100),
    search: str | None = Query(default=None, min_length=2),
) -> list[RoadSegment]:
    segments = [segment for segment in traffic_service.road_segments() if segment.density_score >= min_density]
    if search:
        needle = search.lower()
        segments = [
            segment
            for segment in segments
            if needle in segment.name.lower() or needle in segment.corridor.lower()
        ]
    return segments

