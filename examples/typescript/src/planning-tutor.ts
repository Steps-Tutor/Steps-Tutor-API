/**
 * Demo: POST /ai/planning-response (Planning Tutor)
 *
 * For integration, copy client.ts + types.ts into your project.
 * This file only loads a fixture and prints the result.
 *
 *   npm run planning-tutor
 *   BASE_URL=http://localhost:3001 npx tsx src/planning-tutor.ts
 */

import body from '../../fixtures/planning-tutor.request.json' with { type: 'json' };

import { planningTutor } from './client.js';
import type { PlanningTutorRequest } from './types.js';

const baseUrl = (process.env.BASE_URL ?? 'http://localhost:3001').replace(
  /\/$/,
  '',
);

console.log(`POST ${baseUrl}/ai/planning-response\n`);

try {
  const result = await planningTutor(baseUrl, body as PlanningTutorRequest);

  if (result.success) {
    console.log(`Phase:     ${result.data.currentPhase}`);
    console.log(`Plan done: ${result.data.isPlanComplete}`);
    console.log(`Attempts:  ${result.data.attemptCount}`);
    console.log('\nTutor reply:');
    console.log(result.data.chatbotResponse);
    process.exit(0);
  }

  console.error(result);
  process.exit(1);
} catch (error) {
  console.error('Could not reach the API.', error);
  process.exit(2);
}
