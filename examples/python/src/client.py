"""
Typed HTTP client for the STEPS Public AI APIs.
Copy this file (with api_types.py) into your project when integrating.
"""

from __future__ import annotations

import httpx

from api_types import (
    CowriteProblemRequest,
    CowriteProblemResponse,
    PlanningTutorRequest,
    PlanningTutorResponse,
)


def _post_json(url: str, body: object) -> object:
    with httpx.Client() as client:
        response = client.post(
            url,
            headers={"Content-Type": "application/json"},
            json=body,
        )
    return response.json()


def cowrite_problem(
    base_url: str, body: CowriteProblemRequest
) -> CowriteProblemResponse:
    """POST /ai/cowrite-problem"""
    return _post_json(f"{base_url}/ai/cowrite-problem", body)  # type: ignore[return-value]


def planning_tutor(
    base_url: str, body: PlanningTutorRequest
) -> PlanningTutorResponse:
    """POST /ai/planning-response"""
    return _post_json(f"{base_url}/ai/planning-response", body)  # type: ignore[return-value]
