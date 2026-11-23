import {
  ChatCompletion,
  ChatCompletionTool,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from 'openai/resources';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import {
  createCowriteProblemPrompt,
  createCowriteProblemSolutionPrompt,
} from '../prompts/generativePrompts';
import { PromptsService } from '@modules/prompts/services/prompts.service';
import {
  ConversationEvaluationResponse,
} from '../types/ai-response.types';
import { RubricMetric } from '../types/rubric.types';

export interface CowriteProblemResponse {
  essentialConcepts: string;
  conceptsConnection: string;
  assumptions: string;
  commonMistakes: string;
  additionalInformation: string;
  instructorPlan: string;
}

export interface PlanningChatbotResponse {
  tutorResponse: string;
  isPlanComplete: boolean;
  currentPhase: string;
}

/**
 * Simplified AI Service for steps-public
 * Provides core AI capabilities for problem solving guidance and evaluation
 * without database persistence or institutional tracking
 */
@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private readonly openAiClient: OpenAI,
    private readonly configService: ConfigService,
    private readonly promptsService: PromptsService,
  ) {}

  /**
   * Single entry point for all OpenAI chat completion calls
   */
  private async createChatCompletion(
    params: ChatCompletionCreateParamsNonStreaming,
  ): Promise<ChatCompletion> {
    try {
      const response = await this.openAiClient.chat.completions.create(params);
      return response;
    } catch (error) {
      this.logger.error(
        `OpenAI API call failed: ${(error as Error)?.message}`,
        (error as Error)?.stack,
      );
      throw error;
    }
  }

  /**
   * Generate problem components using AI co-writing capability
   * Creates essential concepts, connections, assumptions, etc. for a problem
   */
  async cowriteProblem(
    title: string,
    description: string,
    discipline: string,
    statement: string,
  ): Promise<CowriteProblemResponse> {
    this.logger.log(
      `cowriteProblem called - title="${title}" discipline="${discipline}"`,
    );

    const cowritePrompt = createCowriteProblemPrompt(
      title,
      description,
      discipline,
      statement,
    );

    const toolFunction: ChatCompletionTool = {
      type: 'function',
      function: {
        name: 'generate_problem_components',
        description:
          'Generates essential components for a problem based on the input.',
        parameters: {
          type: 'object',
          properties: {
            essentialConcepts: {
              type: 'string',
              description: 'Essential concepts related to the problem.',
            },
            conceptsConnection: {
              type: 'string',
              description: 'Connection between the essential concepts.',
            },
            assumptions: {
              type: 'string',
              description:
                'Assumptions and simplifications needed to solve the problem.',
            },
            commonMistakes: {
              type: 'string',
              description:
                'Common mistakes students might make when solving the problem and feedback to address them.',
            },
            additionalInformation: {
              type: 'string',
              description:
                'Additional information that can help in solving the problem.',
            },
            instructorPlan: {
              type: 'string',
              description:
                'A detailed step-by-step plan to solve the problem as an instructor.',
            },
          },
          required: [
            'essentialConcepts',
            'conceptsConnection',
            'assumptions',
            'commonMistakes',
            'additionalInformation',
            'instructorPlan',
          ],
        },
      },
    };

    let response: ChatCompletion;
    try {
      response = await this.createChatCompletion({
        messages: [{ role: 'user', content: cowritePrompt }],
        model: this.configService.getOrThrow<string>('OPENAI_MODEL_NAME'),
        tools: [toolFunction],
        tool_choice: 'required',
      });

      this.logger.log(
        `cowriteProblem - OpenAI responded, finish_reason=${response.choices[0]?.finish_reason}`,
      );
    } catch (error) {
      this.logger.error(
        `cowriteProblem - OpenAI call failed: ${(error as Error)?.message}`,
      );
      throw error;
    }

    if (response?.choices[0]?.message?.tool_calls?.length) {
      const toolCall = response.choices[0].message.tool_calls[0];
      if (toolCall.type === 'function' && toolCall.function.arguments) {
        const toolResponse = JSON.parse(
          toolCall.function.arguments,
        ) as CowriteProblemResponse;
        this.logger.log('cowriteProblem - successfully parsed tool response');
        return toolResponse;
      }
    }

    this.logger.error('cowriteProblem - no tool call in OpenAI response');
    throw new InternalServerErrorException('No tool call response from OpenAI');
  }

  /**
   * Generate a solution key for a problem
   */
  async generateSolutionKey(
    title: string,
    description: string,
    discipline: string,
    statement: string,
    commonMistakes: string,
    additionalInformation: string,
    instructorPlan: string,
    assumptions?: string,
  ): Promise<string> {
    this.logger.log(
      `generateSolutionKey called - title="${title}" discipline="${discipline}"`,
    );

    const cowriteSolutionPrompt = createCowriteProblemSolutionPrompt(
      title,
      description,
      discipline,
      statement,
      commonMistakes,
      additionalInformation,
      instructorPlan,
      assumptions,
    );

    const toolFunction: ChatCompletionTool = {
      type: 'function',
      function: {
        name: 'generate_solution_key',
        description: 'Generates a detailed solution key for a problem.',
        parameters: {
          type: 'object',
          properties: {
            solutionKey: {
              type: 'string',
              description:
                'A detailed solution key for the problem in KaTeX format.',
            },
          },
          required: ['solutionKey'],
        },
      },
    };

    let response: ChatCompletion;
    try {
      response = await this.createChatCompletion({
        messages: [{ role: 'user', content: cowriteSolutionPrompt }],
        model: this.configService.getOrThrow<string>('OPENAI_MODEL_NAME'),
        tools: [toolFunction],
        tool_choice: 'required',
      });

      this.logger.log(
        `generateSolutionKey - OpenAI responded, finish_reason=${response.choices[0]?.finish_reason}`,
      );
    } catch (error) {
      this.logger.error(
        `generateSolutionKey - OpenAI call failed: ${(error as Error)?.message}`,
      );
      throw error;
    }

    if (response?.choices[0]?.message?.tool_calls?.length) {
      const toolCall = response.choices[0].message.tool_calls[0];
      if (toolCall.type === 'function' && toolCall.function.arguments) {
        const toolResponse = JSON.parse(toolCall.function.arguments);
        this.logger.log(
          'generateSolutionKey - successfully parsed solution key',
        );
        return toolResponse.solutionKey;
      }
    }

    this.logger.error('generateSolutionKey - no tool call in OpenAI response');
    throw new InternalServerErrorException(
      'No tool call response from OpenAI for solution key generation',
    );
  }

  /**
   * Generate a planning chatbot response for student guidance
   */
  async planningChatbotResponse(
    problem: {
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
    },
    studentMessage: string,
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
  ): Promise<PlanningChatbotResponse> {
    // this.logger.log(
    //   `planningChatbotResponse called - problemId=${problem.id}`,
    // );

    const chatbotPrompt = await this.promptsService.createPlanningPrompt(
      problem.discipline,
      problem.title,
      problem.description,
      problem.statement,
      problem.essentialConcepts,
      problem.conceptsConnection,
      problem.assumptions,
      problem.commonMistakes,
      problem.additionalInformation,
      problem.instructorPlan,
    );

    const toolFunction: ChatCompletionTool = {
      type: 'function',
      function: {
        name: 'generate_planning_chatbot_response',
        description:
          'Generates a response from the planning chatbot based on the problem details and conversation history.',
        parameters: {
          type: 'object',
          properties: {
            tutorResponse: {
              type: 'string',
              description:
                'The response from the planning chatbot to the student.',
            },
            isPlanComplete: {
              type: 'boolean',
              description:
                'Indicates whether the student has developed a complete and correct problem-solving plan.',
            },
            currentPhase: {
              type: 'string',
              description: 'The current phase of the problem-solving process.',
            },
          },
          required: [
            'tutorResponse',
            'isPlanComplete',
            'currentPhase',
          ],
        },
      },
    };

    const historyMessages: ChatCompletionMessageParam[] =
      conversationHistory || [];
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: chatbotPrompt },
      ...historyMessages,
      { role: 'user', content: studentMessage },
    ];

    this.logger.log(
      `planningChatbotResponse - sending request to OpenAI with ${messages.length} messages`,
    );

    let response: ChatCompletion;
    try {
      response = await this.createChatCompletion({
        messages,
        model: this.configService.getOrThrow<string>('OPENAI_MODEL_NAME'),
        tools: [toolFunction],
        tool_choice: 'required',
      });

      this.logger.log(
        `planningChatbotResponse - OpenAI responded, finish_reason=${response.choices[0]?.finish_reason}`,
      );
    } catch (error) {
      this.logger.error(
        `planningChatbotResponse - OpenAI call failed: ${(error as Error)?.message}`,
      );
      throw error;
    }

    if (response?.choices[0]?.message?.tool_calls?.length) {
      const toolCall = response.choices[0].message.tool_calls[0];
      if (toolCall.type === 'function' && toolCall.function.arguments) {
        const toolResponse = JSON.parse(
          toolCall.function.arguments,
        ) as PlanningChatbotResponse;
        this.logger.log(
          'planningChatbotResponse - successfully parsed tool response',
        );
        return toolResponse;
      }
    }

    this.logger.error(
      'planningChatbotResponse - no tool call in OpenAI response',
    );
    throw new InternalServerErrorException(
      'No tool call response from OpenAI',
    );
  }

  /**
   * Evaluate a student-tutor conversation against a rubric
   */
  async evaluateConversationWithRubric(
    problem: {
      discipline: string;
      title: string;
      description: string;
      statement: string;
    },
    conversationMessages: ChatCompletionMessageParam[],
    rubric: RubricMetric[],
  ): Promise<ConversationEvaluationResponse> {
    const evaluationPrompt =
      await this.promptsService.getEvaluationWithRubricPrompt(
        problem.discipline,
        problem.title,
        problem.description,
        problem.statement,
        rubric,
      );
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: evaluationPrompt },
      ...conversationMessages,
    ];
    const toolFunction: ChatCompletionTool = {
      type: 'function',
      function: {
        name: 'evaluate_conversation_with_rubric',
        description: 'Evaluate a conversation based on a rubric',
        parameters: {
          type: 'object',
          properties: {
            evaluation: {
              type: 'array',
              description:
                'Evaluation of the student for each rubric criterion',
              items: {
                type: 'object',
                properties: {
                  level_achieved: {
                    type: 'number',
                    description: 'Performance level achieved for the criterion',
                  },
                  reasoning: {
                    type: 'string',
                    description:
                      'Brief explanation of how the student followed or deviated from the specified rubric criterion',
                  },
                  evidence: {
                    type: 'array',
                    items: { type: 'string' },
                    description:
                      "Excerpts from the student's conversation supporting the evaluation",
                  },
                  criteria_title: {
                    type: 'string',
                  },
                  criteria_number: {
                    type: 'number',
                  },
                },
                required: [
                  'level_achieved',
                  'reasoning',
                  'evidence',
                  'criteria_title',
                  'criteria_number',
                ],
                additionalProperties: false,
              },
            },
          },
          required: ['evaluation'],
          additionalProperties: false,
        },
      },
    };

    let response: ChatCompletion;
    try {
      response = await this.createChatCompletion({
        messages,
        model: this.configService.getOrThrow<string>('OPENAI_MODEL_NAME'),
        tools: [toolFunction],
        tool_choice: 'required',
      });
    } catch (error) {
      this.logger.error(
        `evaluateConversationWithRubric - OpenAI call failed: ${(error as Error)?.message}`,
      );
      throw error;
    }

    if (response?.choices[0]?.message?.tool_calls?.length) {
      const toolCall = response.choices[0].message.tool_calls[0];
      if (toolCall.type === 'function' && toolCall.function.arguments) {
        const toolResponse = JSON.parse(
          toolCall.function.arguments,
        ) as ConversationEvaluationResponse;
        this.logger.log(
          'evaluateConversationWithRubric - successfully parsed tool response',
        );
        return { evaluation: toolResponse.evaluation };
      }
    }

    this.logger.error(
      'evaluateConversationWithRubric - no tool call in OpenAI response',
    );
    throw new InternalServerErrorException(
      'No tool call response from OpenAI for conversation evaluation with rubric',
    );
  }
}
