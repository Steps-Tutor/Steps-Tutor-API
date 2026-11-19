/**
 * Typed HTTP client for the STEPS Public AI APIs.
 * Copy this file (with types.ts) into your project when integrating.
 */

import type {
  CowriteProblemRequest,
  CowriteProblemResponse,
  PlanningTutorRequest,
  PlanningTutorResponse,
} from './types.js';

async function postJson<TRequest, TResponse>(
  url: string,
  body: TRequest,
): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return (await response.json()) as TResponse;
}

/** POST /ai/cowrite-problem */
export function cowriteProblem(
  baseUrl: string,
  body: CowriteProblemRequest,
): Promise<CowriteProblemResponse> {
  return postJson(`${baseUrl}/ai/cowrite-problem`, body);
}

/** POST /ai/planning-response */
export function planningTutor(
  baseUrl: string,
  body: PlanningTutorRequest,
): Promise<PlanningTutorResponse> {
  return postJson(`${baseUrl}/ai/planning-response`, body);
}
