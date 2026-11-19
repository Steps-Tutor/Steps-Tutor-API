export interface RubricMetric {
  criteria: string;
  description?: string;
  levels: {
    order: number;
    score: number;
    requirement: string;
  }[];
}
