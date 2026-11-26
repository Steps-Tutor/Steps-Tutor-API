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
    tutorResponse: str
    isPlanComplete: bool
    currentPhase: PlanningPhase


class EvaluationProblem(TypedDict):
    discipline: str
    title: str
    description: str
    statement: str


class EvaluateConversationRequest(TypedDict):
    problem: EvaluationProblem
    conversationHistory: list[ConversationMessage]


class CriterionEvaluation(TypedDict):
    level_achieved: int
    reasoning: str
    evidence: list[str]
    criteria_title: str
    criteria_number: int


class EvaluateConversationData(TypedDict):
    evaluation: list[CriterionEvaluation]


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


class EvaluateConversationResponse(TypedDict):
    success: bool
    status: int
    data: NotRequired[EvaluateConversationData]
    message: NotRequired[str | list[str]]
    statusCode: NotRequired[int]
    error: NotRequired[str]
