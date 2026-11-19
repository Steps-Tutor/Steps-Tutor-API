"""
Demo: POST /ai/cowrite-problem

For integration, copy client.py + api_types.py into your project.
This file only loads a fixture and prints the result.

  python src/cowrite_problem.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import httpx

from api_types import CowriteProblemRequest
from client import cowrite_problem

FIXTURE_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "fixtures"
    / "cowrite-problem.request.json"
)

base_url = os.environ.get("BASE_URL", "http://localhost:3001").rstrip("/")

with FIXTURE_PATH.open(encoding="utf-8") as f:
    body: CowriteProblemRequest = json.load(f)

print(f"POST {base_url}/ai/cowrite-problem\n")

try:
    result = cowrite_problem(base_url, body)
except (httpx.HTTPError, OSError, json.JSONDecodeError) as exc:
    print("Could not reach the API.", file=sys.stderr)
    print(exc, file=sys.stderr)
    raise SystemExit(2) from exc

if result.get("success"):
    print(result["data"])
    raise SystemExit(0)

print(result, file=sys.stderr)
raise SystemExit(1)
