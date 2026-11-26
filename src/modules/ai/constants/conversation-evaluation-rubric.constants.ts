import { RubricMetric } from '../types/rubric.types';

/**
 * Rubric applied by POST /ai/evaluate-conversation.
 * Callers do not send a rubric. level_achieved in the response is the level
 * order (1–4). Each level's score stays 0–3 and is not returned.
 */
export const CONVERSATION_EVALUATION_RUBRIC: RubricMetric[] = [
  {
    levels: [
      {
        order: 1,
        score: 0,
        requirement: 'Criterion not demonstrated or response is incorrect.',
      },
      {
        order: 2,
        score: 1,
        requirement:
          'Partial understanding; identifies some relevant elements but with major omissions or inaccuracies.',
      },
      {
        order: 3,
        score: 2,
        requirement:
          'Correctly addresses the criterion with minor omissions or limited explanation.',
      },
      {
        order: 4,
        score: 3,
        requirement:
          'Complete, accurate, and well-justified understanding; demonstrates deeper reasoning and connections.',
      },
    ],
    criteria: 'Concept Identification Accuracy',
  },
  {
    levels: [
      {
        order: 1,
        score: 0,
        requirement: 'Criterion not demonstrated or response is incorrect.',
      },
      {
        order: 2,
        score: 1,
        requirement:
          'Partial understanding; identifies some relevant elements but with major omissions or inaccuracies.',
      },
      {
        order: 3,
        score: 2,
        requirement:
          'Correctly addresses the criterion with minor omissions or limited explanation.',
      },
      {
        order: 4,
        score: 3,
        requirement:
          'Complete, accurate, and well-justified understanding; demonstrates deeper reasoning and connections.',
      },
    ],
    criteria: 'Concept-to-Problem Justification',
  },
  {
    levels: [
      {
        order: 1,
        score: 0,
        requirement: 'Criterion not demonstrated or response is incorrect.',
      },
      {
        order: 2,
        score: 1,
        requirement:
          'Partial understanding; identifies some relevant elements but with major omissions or inaccuracies.',
      },
      {
        order: 3,
        score: 2,
        requirement:
          'Correctly addresses the criterion with minor omissions or limited explanation.',
      },
      {
        order: 4,
        score: 3,
        requirement:
          'Complete, accurate, and well-justified understanding; demonstrates deeper reasoning and connections.',
      },
    ],
    criteria: 'Understanding of Concept Relationships',
  },
  {
    levels: [
      {
        order: 1,
        score: 0,
        requirement: 'Criterion not demonstrated or response is incorrect.',
      },
      {
        order: 2,
        score: 1,
        requirement:
          'Partial understanding; identifies some relevant elements but with major omissions or inaccuracies.',
      },
      {
        order: 3,
        score: 2,
        requirement:
          'Correctly addresses the criterion with minor omissions or limited explanation.',
      },
      {
        order: 4,
        score: 3,
        requirement:
          'Complete, accurate, and well-justified understanding; demonstrates deeper reasoning and connections.',
      },
    ],
    criteria: 'Assumption Identification',
  },
  {
    levels: [
      {
        order: 1,
        score: 0,
        requirement: 'Criterion not demonstrated or response is incorrect.',
      },
      {
        order: 2,
        score: 1,
        requirement:
          'Partial understanding; identifies some relevant elements but with major omissions or inaccuracies.',
      },
      {
        order: 3,
        score: 2,
        requirement:
          'Correctly addresses the criterion with minor omissions or limited explanation.',
      },
      {
        order: 4,
        score: 3,
        requirement:
          'Complete, accurate, and well-justified understanding; demonstrates deeper reasoning and connections.',
      },
    ],
    criteria: 'Condition Recognition',
  },
  {
    levels: [
      {
        order: 1,
        score: 0,
        requirement: 'Criterion not demonstrated or response is incorrect.',
      },
      {
        order: 2,
        score: 1,
        requirement:
          'Partial understanding; identifies some relevant elements but with major omissions or inaccuracies.',
      },
      {
        order: 3,
        score: 2,
        requirement:
          'Correctly addresses the criterion with minor omissions or limited explanation.',
      },
      {
        order: 4,
        score: 3,
        requirement:
          'Complete, accurate, and well-justified understanding; demonstrates deeper reasoning and connections.',
      },
    ],
    criteria: 'Information Requirement Analysis',
  },
  {
    levels: [
      {
        order: 1,
        score: 0,
        requirement: 'Criterion not demonstrated or response is incorrect.',
      },
      {
        order: 2,
        score: 1,
        requirement:
          'Partial understanding; identifies some relevant elements but with major omissions or inaccuracies.',
      },
      {
        order: 3,
        score: 2,
        requirement:
          'Correctly addresses the criterion with minor omissions or limited explanation.',
      },
      {
        order: 4,
        score: 3,
        requirement:
          'Complete, accurate, and well-justified understanding; demonstrates deeper reasoning and connections.',
      },
    ],
    criteria: 'Information Utilization Planning',
  },
];
