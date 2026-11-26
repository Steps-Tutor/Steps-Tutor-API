/**
 * Demo: POST /ai/evaluate-conversation
 *
 * For integration, copy client.ts + types.ts into your project.
 * This file only loads a fixture and prints the result.
 *
 *   npm run evaluate-conversation
 *   BASE_URL=http://localhost:3001 npx tsx src/evaluate-conversation.ts
 */

import body from '../../fixtures/evaluate-conversation.request.json' with { type: 'json' };

import { evaluateConversation } from './client.js';
import type { EvaluateConversationRequest } from './types.js';

const baseUrl = (process.env.BASE_URL ?? 'http://localhost:3001').replace(
  /\/$/,
  '',
);

console.log(`POST ${baseUrl}/ai/evaluate-conversation\n`);

try {
  const result = await evaluateConversation(
    baseUrl,
    body as EvaluateConversationRequest,
  );

  if (result.success) {
    for (const criterion of result.data.evaluation) {
      console.log(
        `${criterion.criteria_number}. ${criterion.criteria_title}`,
      );
      console.log(`Level: ${criterion.level_achieved}`);
      console.log(criterion.reasoning);
      console.log('');
    }
    process.exit(0);
  }

  console.error(result);
  process.exit(1);
} catch (error) {
  console.error('Could not reach the API.', error);
  process.exit(2);
}
