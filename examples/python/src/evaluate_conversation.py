"""
Demo: POST /ai/evaluate-conversation

For integration, copy client.py + api_types.py into your project.
This file only loads a fixture and prints the result.

  python src/evaluate_conversation.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import httpx

from api_types import EvaluateConversationRequest
from client import evaluate_conversation

FIXTURE_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "fixtures"
    / "evaluate-conversation.request.json"
)

base_url = os.environ.get("BASE_URL", "http://localhost:3001").rstrip("/")

with FIXTURE_PATH.open(encoding="utf-8") as f:
    body: EvaluateConversationRequest = json.load(f)

print(f"POST {base_url}/ai/evaluate-conversation\n")

try:
    result = evaluate_conversation(base_url, body)
except (httpx.HTTPError, OSError, json.JSONDecodeError) as exc:
    print("Could not reach the API.", file=sys.stderr)
    print(exc, file=sys.stderr)
    raise SystemExit(2) from exc

if result.get("success"):
    data = result["data"]  # type: ignore[typeddict-item]
    for criterion in data["evaluation"]:
        print(f"{criterion['criteria_number']}. {criterion['criteria_title']}")
        print(f"Level: {criterion['level_achieved']}")
        print(criterion["reasoning"])
        print()
    raise SystemExit(0)

print(result, file=sys.stderr)
raise SystemExit(1)
