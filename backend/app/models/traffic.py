from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class Priority(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    critical = "Critical"


class CongestionLevel(str, Enum):
    free = "Free Flow"
    moderate = "Moderate"
    heavy = "Heavy"
    severe = "Severe"


class DashboardSummary(BaseModel):
    traffic_score: int = Field(ge=0, le=100)
    average_speed: float
    active_incidents: int
    violations_today: int
    emergency_alerts: int
    active_vehicles: int
    live_cameras: int
    prediction_summary: str
    generated_at: datetime


class RoadSegment(BaseModel):
    id: str
    name: str
    corridor: str
    latitude: float
    longitude: float
    vehicle_count: int
    average_speed: float
    occupancy: float = Field(ge=0, le=1)
    density_score: int = Field(ge=0, le=100)
    congestion_level: CongestionLevel
    trend: str


class Violation(BaseModel):
    id: str
    type: str
    location: str
    camera_id: str
    confidence: float = Field(ge=0, le=1)
    count: int
    priority: Priority
    detected_at: datetime


class Prediction(BaseModel):
    location: str
    horizon_minutes: int
    predicted_density: int = Field(ge=0, le=100)
    hotspot_probability: float = Field(ge=0, le=1)
    expected_speed: float
    confidence: float = Field(ge=0, le=1)


class Recommendation(BaseModel):
    id: str
    type: str
    priority: Priority
    location: str
    action: str
    confidence_score: float = Field(ge=0, le=1)
    expected_improvement: str
    estimated_time_saved: str


class IntelligenceBriefing(BaseModel):
    briefing: str
    provider: str
    model: str | None = None
    generated_at: datetime
    used_fallback: bool = False


class AnalyticsPoint(BaseModel):
    label: str
    traffic_volume: int
    average_speed: float
    violations: int
    incidents: int
