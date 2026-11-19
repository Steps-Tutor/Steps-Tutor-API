export interface PlanningEvaluationResponse {
  planningEvaluation: Array<{
    level_achieved: number;
    reasoning: string;
    criteria_title: string;
    score: number;
    criteria_number: number;
  }>;
}
