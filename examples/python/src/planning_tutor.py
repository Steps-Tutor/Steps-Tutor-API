"""
Demo: POST /ai/planning-response (Planning Tutor)

For integration, copy client.py + api_types.py into your project.
This file only loads a fixture and prints the result.

  python src/planning_tutor.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import httpx

from api_types import PlanningTutorRequest
from client import planning_tutor

FIXTURE_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "fixtures"
    / "planning-tutor.request.json"
)

base_url = os.environ.get("BASE_URL", "http://localhost:3001").rstrip("/")

with FIXTURE_PATH.open(encoding="utf-8") as f:
    body: PlanningTutorRequest = json.load(f)

print(f"POST {base_url}/ai/planning-response\n")

try:
    result = planning_tutor(base_url, body)
except (httpx.HTTPError, OSError, json.JSONDecodeError) as exc:
    print("Could not reach the API.", file=sys.stderr)
    print(exc, file=sys.stderr)
    raise SystemExit(2) from exc

if result.get("success"):
    data = result["data"]  # type: ignore[typeddict-item]
    print(f"Phase:     {data['currentPhase']}")
    print(f"Plan done: {data['isPlanComplete']}")
    print("\nTutor reply:")
    print(data["tutorResponse"])
    raise SystemExit(0)

print(result, file=sys.stderr)
raise SystemExit(1)
