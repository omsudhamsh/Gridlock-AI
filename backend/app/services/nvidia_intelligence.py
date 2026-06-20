from datetime import datetime, timezone

import httpx

from app.core.config import get_settings
from app.models.traffic import IntelligenceBriefing
from app.services.mock_traffic import traffic_service


class NvidiaIntelligenceService:
    """Generate an operator briefing with NVIDIA NIM and fail safely to local data."""

    def briefing(self) -> IntelligenceBriefing:
        settings = get_settings()
        roads = traffic_service.road_segments()[:5]
        recommendations = traffic_service.recommendations()[:4]

        fallback = self._fallback_briefing(roads, recommendations)
        if settings.nvidia_api_key is None:
            return IntelligenceBriefing(
                briefing=fallback,
                provider="local",
                generated_at=datetime.now(timezone.utc),
                used_fallback=True,
            )

        traffic_context = "\n".join(
            f"- {road.name}: density {road.density_score}/100, speed "
            f"{road.average_speed} km/h, trend {road.trend}"
            for road in roads
        )
        action_context = "\n".join(
            f"- {item.priority.value} at {item.location}: {item.action}"
            for item in recommendations
        )
        prompt = (
            "You are an operations analyst for Bengaluru's traffic command center. "
            "Write a concise shift briefing of 90-130 words. Identify the most urgent "
            "corridors, explain the near-term risk, and give three concrete actions. "
            "Use only the supplied data, avoid markdown headings, and do not invent incidents.\n\n"
            f"Live corridors:\n{traffic_context}\n\nRecommended actions:\n{action_context}"
        )

        try:
            response = httpx.post(
                f"{settings.nvidia_base_url.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.nvidia_api_key.get_secret_value()}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.nvidia_model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "Be precise, operational, and grounded in the provided telemetry.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.2,
                    "top_p": 0.7,
                    "max_tokens": 220,
                    "stream": False,
                },
                timeout=settings.nvidia_timeout_seconds,
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"].strip()
            if not content:
                raise ValueError("NVIDIA NIM returned an empty briefing")
            return IntelligenceBriefing(
                briefing=content,
                provider="NVIDIA NIM",
                model=settings.nvidia_model,
                generated_at=datetime.now(timezone.utc),
            )
        except (httpx.HTTPError, KeyError, TypeError, ValueError):
            return IntelligenceBriefing(
                briefing=fallback,
                provider="local",
                model=settings.nvidia_model,
                generated_at=datetime.now(timezone.utc),
                used_fallback=True,
            )

    @staticmethod
    def _fallback_briefing(roads: list, recommendations: list) -> str:
        hottest = roads[:3]
        road_summary = ", ".join(
            f"{road.name} ({road.density_score}/100, {road.trend.lower()})"
            for road in hottest
        )
        actions = " ".join(
            f"{index + 1}) {item.location}: {item.action}"
            for index, item in enumerate(recommendations[:3])
        )
        return (
            f"Priority monitoring is required at {road_summary}. Conditions indicate elevated "
            "near-term queue and speed risk across these corridors. Recommended response: "
            f"{actions}"
        )


nvidia_intelligence_service = NvidiaIntelligenceService()
