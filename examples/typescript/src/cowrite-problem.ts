/**
 * Demo: POST /ai/cowrite-problem
 *
 * For integration, copy client.ts + types.ts into your project.
 * This file only loads a fixture and prints the result.
 *
 *   npm run cowrite-problem
 *   BASE_URL=http://localhost:3001 npx tsx src/cowrite-problem.ts
 */

import body from '../../fixtures/cowrite-problem.request.json' with { type: 'json' };

import { cowriteProblem } from './client.js';
import type { CowriteProblemRequest } from './types.js';

const baseUrl = (process.env.BASE_URL ?? 'http://localhost:3001').replace(
  /\/$/,
  '',
);

console.log(`POST ${baseUrl}/ai/cowrite-problem\n`);

try {
  const result = await cowriteProblem(
    baseUrl,
    body as CowriteProblemRequest,
  );

  if (result.success) {
    console.log(result.data);
    process.exit(0);
  }

  console.error(result);
  process.exit(1);
} catch (error) {
  console.error('Could not reach the API.', error);
  process.exit(2);
}
