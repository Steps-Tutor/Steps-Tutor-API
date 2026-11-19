"""
Request and response types for the STEPS Public AI APIs.
Copy this file into your project when integrating.
"""

from __future__ import annotations

from typing import Literal, NotRequired, TypedDict


class CowriteProblemRequest(TypedDict):
    title: str
    description: str
    discipline: str
    statement: str


class CowriteProblemData(TypedDict):
    essentialConcepts: str
    conceptsConnection: str
    assumptions: str
    commonMistakes: str
    additionalInformation: str
    instructorPlan: str


class ConversationMessage(TypedDict):
    role: Literal["user", "assistant"]
    content: str


class ProblemDetails(TypedDict):
    discipline: str
    title: str
    description: str
    statement: str
    essentialConcepts: str
    conceptsConnection: str
    assumptions: str
    commonMistakes: str
    additionalInformation: str
    instructorPlan: str
    id: NotRequired[str]


class PlanningTutorRequest(TypedDict):
    problem: ProblemDetails
    studentMessage: str
    conversationHistory: NotRequired[list[ConversationMessage]]


PlanningPhase = Literal[
    "understanding",
    "concepts",
    "connections",
    "assumptions",
    "information",
    "planning",
    "complete",
]


class PlanningTutorData(TypedDict):
    chatbotResponse: str
    isPlanComplete: bool
    currentPhase: PlanningPhase
    attemptCount: int


class CowriteProblemResponse(TypedDict):
    success: bool
    status: int
    data: NotRequired[CowriteProblemData]
    message: NotRequired[str | list[str]]
    statusCode: NotRequired[int]
    error: NotRequired[str]


class PlanningTutorResponse(TypedDict):
    success: bool
    status: int
    data: NotRequired[PlanningTutorData]
    message: NotRequired[str | list[str]]
    statusCode: NotRequired[int]
    error: NotRequired[str]
