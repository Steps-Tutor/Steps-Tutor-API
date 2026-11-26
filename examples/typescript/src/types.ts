/**
 * Request and response types for the STEPS Public AI APIs.
 * Copy this file into your project when integrating.
 */

export type CowriteProblemRequest = {
  title: string;
  description: string;
  discipline: string;
  statement: string;
};

export type CowriteProblemData = {
  essentialConcepts: string;
  conceptsConnection: string;
  assumptions: string;
  commonMistakes: string;
  additionalInformation: string;
  instructorPlan: string;
};

export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ProblemDetails = {
  id?: string;
  discipline: string;
  title: string;
  description: string;
  statement: string;
  essentialConcepts: string;
  conceptsConnection: string;
  assumptions: string;
  commonMistakes: string;
  additionalInformation: string;
  instructorPlan: string;
};

export type PlanningTutorRequest = {
  problem: ProblemDetails;
  studentMessage: string;
  conversationHistory?: ConversationMessage[];
};

export type PlanningPhase =
  | 'understanding'
  | 'concepts'
  | 'connections'
  | 'assumptions'
  | 'information'
  | 'planning'
  | 'complete';

export type PlanningTutorData = {
  tutorResponse: string;
  isPlanComplete: boolean;
  currentPhase: PlanningPhase;
};

export type EvaluationProblem = {
  discipline: string;
  title: string;
  description: string;
  statement: string;
};

export type EvaluateConversationRequest = {
  problem: EvaluationProblem;
  conversationHistory: ConversationMessage[];
};

export type CriterionEvaluation = {
  level_achieved: number;
  reasoning: string;
  evidence: string[];
  criteria_title: string;
  criteria_number: number;
};

export type EvaluateConversationData = {
  evaluation: CriterionEvaluation[];
};

export type ApiSuccess<T> = {
  success: true;
  status: number;
  data: T;
};

export type ApiFailure = {
  success?: false;
  status?: number;
  statusCode?: number;
  message: string | string[];
  error?: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type CowriteProblemResponse = ApiResponse<CowriteProblemData>;
export type PlanningTutorResponse = ApiResponse<PlanningTutorData>;
export type EvaluateConversationResponse =
  ApiResponse<EvaluateConversationData>;
