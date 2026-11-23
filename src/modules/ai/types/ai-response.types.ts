export interface ConversationEvaluationResponse {
  evaluation: Array<{
    level_achieved: number;
    reasoning: string;
    evidence: string[];
    criteria_title: string;
    criteria_number: number;
  }>;
}

export interface PlanningEvaluationResponse {
  planningEvaluation: Array<{
    level_achieved: number;
    reasoning: string;
    criteria_title: string;
    score: number;
    criteria_number: number;
  }>;
}
