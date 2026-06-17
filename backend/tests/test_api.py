from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.mock_traffic import traffic_service


def test_dashboard_summary_contract() -> None:
    payload = traffic_service.dashboard_summary().model_dump()
    assert 0 <= payload["traffic_score"] <= 100
    assert payload["active_vehicles"] > 0
    assert payload["prediction_summary"]


def test_recommendations_include_decision_fields() -> None:
    first = traffic_service.recommendations()[0].model_dump()
    assert {"priority", "confidence_score", "expected_improvement", "estimated_time_saved"} <= set(first)
