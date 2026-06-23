from datetime import datetime, timedelta, timezone
from random import Random

from app.models.traffic import (
    AnalyticsPoint,
    CongestionLevel,
    DashboardSummary,
    Prediction,
    Priority,
    Recommendation,
    RoadSegment,
    Violation,
)


class TrafficSimulationService:
    """Deterministic mock traffic feed for hackathon demos and tests."""

    def __init__(self) -> None:
        self._roads = [
            ("silk-board", "Silk Board Junction", "ORR - Hosur Road", 12.9177, 77.6238),
            ("hebbal", "Hebbal Flyover", "Airport Corridor", 13.0358, 77.5970),
            ("tin-factory", "Tin Factory", "Old Madras Road", 12.9960, 77.6692),
            ("marathahalli", "Marathahalli Bridge", "Outer Ring Road", 12.9569, 77.7011),
            ("kr-puram", "KR Puram Junction", "Whitefield Corridor", 13.0070, 77.6950),
            ("majestic", "Kempegowda Bus Station", "Central Bengaluru", 12.9767, 77.5713),
            ("koramangala", "Koramangala 100 ft Road", "Inner Ring Road", 12.9352, 77.6245),
            ("banashankari", "Banashankari TTMC", "South Bengaluru", 12.9182, 77.5736),
        ]

    def _rng(self) -> Random:
        bucket = int(datetime.now(timezone.utc).timestamp() // 30)
        return Random(bucket)

    @staticmethod
    def _level(score: int) -> CongestionLevel:
        if score >= 85:
            return CongestionLevel.severe
        if score >= 68:
            return CongestionLevel.heavy
        if score >= 42:
            return CongestionLevel.moderate
        return CongestionLevel.free

    def road_segments(self) -> list[RoadSegment]:
        rng = self._rng()
        segments: list[RoadSegment] = []
        for road_id, name, corridor, lat, lng in self._roads:
            density = rng.randint(35, 96)
            speed = max(7, round(52 - density * 0.42 + rng.uniform(-4, 5), 1))
            segments.append(
                RoadSegment(
                    id=road_id,
                    name=name,
                    corridor=corridor,
                    latitude=lat,
                    longitude=lng,
                    vehicle_count=rng.randint(180, 1800),
                    average_speed=speed,
                    occupancy=round(density / 100, 2),
                    density_score=density,
                    congestion_level=self._level(density),
                    trend=rng.choice(["Rising", "Stable", "Easing"]),
                )
            )
        return sorted(segments, key=lambda segment: segment.density_score, reverse=True)

    def dashboard_summary(self) -> DashboardSummary:
        roads = self.road_segments()
        average_density = round(sum(road.density_score for road in roads) / len(roads))
        average_speed = round(sum(road.average_speed for road in roads) / len(roads), 1)
        severe_roads = sum(1 for road in roads if road.congestion_level == CongestionLevel.severe)
        return DashboardSummary(
            traffic_score=max(0, 100 - average_density),
            average_speed=average_speed,
            active_incidents=severe_roads + 4,
            violations_today=1180 + average_density * 8,
            emergency_alerts=1 if severe_roads else 0,
            active_vehicles=sum(road.vehicle_count for road in roads),
            live_cameras=142,
            prediction_summary=f"{severe_roads or 2} corridors need intervention in the next 30 minutes",
            generated_at=datetime.now(timezone.utc),
        )

    def recommendations(self) -> list[Recommendation]:
        roads = self.road_segments()[:4]
        templates = [
            ("Signal Optimization", "Increase green duration by 18 seconds for outbound flow."),
            ("Diversion", "Activate diversion boards and route traffic via parallel arterial roads."),
            ("Officer Deployment", "Deploy two traffic officers for manual lane discipline."),
            ("Emergency Prioritization", "Hold cross traffic and clear the left emergency lane."),
        ]
        recommendations: list[Recommendation] = []
        for index, road in enumerate(roads):
            rec_type, action = templates[index]
            priority = Priority.critical if road.density_score > 86 else Priority.high
            recommendations.append(
                Recommendation(
                    id=f"rec-{road.id}",
                    type=rec_type,
                    priority=priority,
                    location=road.name,
                    action=action,
                    confidence_score=round(0.78 + road.density_score / 500, 2),
                    expected_improvement=f"{min(28, 8 + road.density_score // 6)}% reduction in queue length",
                    estimated_time_saved=f"{max(4, road.density_score // 9)} mins/vehicle",
                )
            )
        return recommendations

    def violations(self) -> list[Violation]:
        rng = self._rng()
        types = ["Helmet", "Wrong Lane", "Signal Jump", "Illegal Parking", "No Seatbelt"]
        now = datetime.now(timezone.utc)
        return [
            Violation(
                id=f"vio-{index + 1}",
                type=types[index % len(types)],
                location=road.name,
                camera_id=f"BLR-CAM-{rng.randint(100, 999)}",
                confidence=round(rng.uniform(0.78, 0.98), 2),
                count=rng.randint(8, 76),
                priority=rng.choice([Priority.medium, Priority.high, Priority.critical]),
                detected_at=now - timedelta(minutes=rng.randint(2, 80)),
            )
            for index, road in enumerate(self.road_segments()[:6])
        ]

    def predictions(self) -> list[Prediction]:
        predictions: list[Prediction] = []
        for road in self.road_segments()[:5]:
            for horizon in (15, 30, 60):
                projected = min(100, road.density_score + horizon // 8)
                predictions.append(
                    Prediction(
                        location=road.name,
                        horizon_minutes=horizon,
                        predicted_density=projected,
                        hotspot_probability=round(projected / 110, 2),
                        expected_speed=max(6, round(road.average_speed - horizon * 0.05, 1)),
                        confidence=0.86 if horizon <= 30 else 0.74,
                    )
                )
        return predictions

    def analytics(self) -> list[AnalyticsPoint]:
        rng = self._rng()
        labels = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]
        return [
            AnalyticsPoint(
                label=label,
                traffic_volume=rng.randint(18_000, 54_000),
                average_speed=round(rng.uniform(14, 38), 1),
                violations=rng.randint(120, 520),
                incidents=rng.randint(3, 18),
            )
            for label in labels
        ]


traffic_service = TrafficSimulationService()

