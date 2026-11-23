import { Injectable, Logger } from '@nestjs/common';

import type { RubricMetric } from '@modules/ai/types/rubric.types';
import { createPlanningPrompt } from '../promptTexts/chatbot/planningPrompts';
import { createAnswerCheckingPrompt } from '../promptTexts/chatbot/answerCheckingPrompts';
import { createReflectionPrompt } from '../promptTexts/chatbot/reflectionPrompt';
import {
  createEvaluationWithRubricPrompt,
  createPlanningEvaluationPrompt,
} from '../promptTexts/generativePrompts';

/**
 * Simplified PromptsService for steps-public without database persistence.
 * This service manages prompt templates and provides methods to retrieve
 * and customize prompts for AI interactions.
 */
@Injectable()
export class PromptsService {
  private readonly logger = new Logger(PromptsService.name);

  /**
   * Get a planning prompt for problem solving guidance
   */
  async createPlanningPrompt(
    discipline: string,
    problemTitle: string,
    problemDescription: string,
    problemStatement: string,
    essentialConcepts: string,
    conceptsConnection: string,
    assumptions: string,
    commonMistakes: string,
    additionalInformation: string,
    instructorPlan: string,
  ): Promise<string> {
    return createPlanningPrompt(
      discipline,
      problemTitle,
      problemDescription,
      problemStatement,
      essentialConcepts,
      conceptsConnection,
      assumptions,
      commonMistakes,
      additionalInformation,
      instructorPlan,
    );
  }

  /**
   * Get an answer checking prompt for evaluating student responses
   */
  async createAnswerCheckingPrompt(
    discipline: string,
    problemTitle: string,
    problemDescription: string,
    problemStatement: string,
  ): Promise<string> {
    return createAnswerCheckingPrompt(
      discipline,
      problemTitle,
      problemDescription,
      problemStatement,
    );
  }

  /**
   * Get a reflection prompt for metacognitive analysis
   */
  async createReflectionPrompt(
    discipline: string,
    problemTitle: string,
    problemDescription: string,
    problemStatement: string,
    instructorSolution: string,
    studentSolution: string,
  ): Promise<string> {
    return createReflectionPrompt(
      discipline,
      problemTitle,
      problemDescription,
      problemStatement,
      instructorSolution,
      studentSolution,
    );
  }

  /**
   * Get a planning evaluation prompt
   */
  async createPlanningEvaluationPrompt(
    discipline: string,
    problemTitle: string,
    problemDescription: string,
    problemStatement: string,
    rubricString: string,
    levelsCount: number,
  ): Promise<string> {
    return createPlanningEvaluationPrompt(
      discipline,
      problemTitle,
      problemDescription,
      problemStatement,
      rubricString,
      levelsCount,
    );
  }

  /**
   * Get an evaluation prompt with rubric
   */
  async getEvaluationWithRubricPrompt(
    discipline: string,
    problemTitle: string,
    problemDescription: string,
    problemStatement: string,
    rubric: RubricMetric[],
  ): Promise<string> {
    return createEvaluationWithRubricPrompt(
      discipline,
      problemTitle,
      problemDescription,
      problemStatement,
      JSON.stringify(rubric),
      rubric[0]?.levels.length || 0,
      rubric.length || 0,
    );
  }

  /**
   * Replace prompt variables with actual values
   */
  private replacePromptVariables(
    promptText: string,
    variables: Record<string, string>,
  ): string {
    return Object.entries(variables).reduce(
      (text, [key, value]) => text.replaceAll(`\${${key}}`, value ?? ''),
      promptText,
    );
  }
}
