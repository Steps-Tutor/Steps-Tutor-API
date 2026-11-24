import { InternalServerErrorException, Logger } from '@nestjs/common';

import { AIService } from './ai.service';

const problem = {
  discipline: 'Physics',
  title: 'Free Fall Motion',
  description: 'Objects falling under gravity',
  statement: 'A ball is dropped from 100 m. How long until it lands?',
  essentialConcepts: 'Kinematics',
  conceptsConnection: 'Free fall is uniformly accelerated motion',
  assumptions: 'No air resistance',
  commonMistakes: 'Forgetting the square root',
  additionalInformation: 'g = 9.8 m/s²',
  instructorPlan: '1. Identify knowns 2. Pick equation 3. Solve',
};

const buildToolCompletion = (args: unknown, overrides: object = {}) => ({
  choices: [
    {
      finish_reason: 'tool_calls',
      message: {
        tool_calls: [
          {
            type: 'function',
            function: {
              name: 'fn',
              arguments: typeof args === 'string' ? args : JSON.stringify(args),
            },
            ...overrides,
          },
        ],
      },
    },
  ],
});

describe('AIService', () => {
  let service: AIService;
  let create: jest.Mock;
  let getOrThrow: jest.Mock;
  let createPlanningPrompt: jest.Mock;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    create = jest.fn();
    getOrThrow = jest.fn().mockReturnValue('test-model');
    createPlanningPrompt = jest.fn().mockResolvedValue('PLANNING_PROMPT');

    service = new AIService(
      { chat: { completions: { create } } } as any,
      { getOrThrow } as any,
      { createPlanningPrompt } as any,
    );
  });

  afterEach(() => jest.restoreAllMocks());

  describe('cowriteProblem', () => {
    const components = {
      essentialConcepts: 'a',
      conceptsConnection: 'b',
      assumptions: 'c',
      commonMistakes: 'd',
      additionalInformation: 'e',
      instructorPlan: 'f',
    };

    it('returns the parsed tool-call arguments', async () => {
      create.mockResolvedValue(buildToolCompletion(components));

      const result = await service.cowriteProblem(
        'Title',
        'Desc',
        'Physics',
        'Statement',
      );

      expect(result).toEqual(components);
    });

    it('sends the prompt, configured model and a required tool call', async () => {
      create.mockResolvedValue(buildToolCompletion(components));

      await service.cowriteProblem('My Title', 'My Desc', 'Chemistry', 'My Stmt');

      expect(getOrThrow).toHaveBeenCalledWith('OPENAI_MODEL_NAME');
      expect(create).toHaveBeenCalledTimes(1);
      const params = create.mock.calls[0][0];
      expect(params.model).toBe('test-model');
      expect(params.tool_choice).toBe('required');
      expect(params.messages).toHaveLength(1);
      expect(params.messages[0].role).toBe('user');
      expect(params.messages[0].content).toContain('Chemistry');
      expect(params.messages[0].content).toContain('My Title');
      expect(params.messages[0].content).toContain('My Desc');
      expect(params.messages[0].content).toContain('My Stmt');
    });

    it('declares the generate_problem_components tool with all required fields', async () => {
      create.mockResolvedValue(buildToolCompletion(components));

      await service.cowriteProblem('t', 'd', 'x', 's');

      const tool = create.mock.calls[0][0].tools[0];
      expect(tool.type).toBe('function');
      expect(tool.function.name).toBe('generate_problem_components');
      expect(tool.function.parameters.required).toEqual([
        'essentialConcepts',
        'conceptsConnection',
        'assumptions',
        'commonMistakes',
        'additionalInformation',
        'instructorPlan',
      ]);
      expect(Object.keys(tool.function.parameters.properties)).toEqual(
        tool.function.parameters.required,
      );
    });

    it('throws InternalServerErrorException when there is no tool call', async () => {
      create.mockResolvedValue({
        choices: [{ finish_reason: 'stop', message: { content: 'hi' } }],
      });

      await expect(service.cowriteProblem('t', 'd', 'x', 's')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('throws when tool_calls is empty', async () => {
      create.mockResolvedValue({
        choices: [{ message: { tool_calls: [] } }],
      });

      await expect(service.cowriteProblem('t', 'd', 'x', 's')).rejects.toThrow(
        'No tool call response from OpenAI',
      );
    });

    it('throws when choices is empty', async () => {
      create.mockResolvedValue({ choices: [] });

      await expect(service.cowriteProblem('t', 'd', 'x', 's')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('throws when the tool call has empty arguments', async () => {
      create.mockResolvedValue(buildToolCompletion(''));

      await expect(service.cowriteProblem('t', 'd', 'x', 's')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('throws when the tool call is not of type function', async () => {
      create.mockResolvedValue(buildToolCompletion(components, { type: 'custom' }));

      await expect(service.cowriteProblem('t', 'd', 'x', 's')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('propagates malformed JSON in tool arguments as a SyntaxError', async () => {
      create.mockResolvedValue(buildToolCompletion('{not json'));

      await expect(service.cowriteProblem('t', 'd', 'x', 's')).rejects.toThrow(
        SyntaxError,
      );
    });

    it('re-throws OpenAI client errors unchanged', async () => {
      const apiError = new Error('rate limited');
      create.mockRejectedValue(apiError);

      await expect(service.cowriteProblem('t', 'd', 'x', 's')).rejects.toBe(
        apiError,
      );
      expect(Logger.prototype.error).toHaveBeenCalled();
    });

    it('propagates a missing OPENAI_MODEL_NAME configuration error', async () => {
      getOrThrow.mockImplementation(() => {
        throw new Error('OPENAI_MODEL_NAME is missing');
      });

      await expect(service.cowriteProblem('t', 'd', 'x', 's')).rejects.toThrow(
        'OPENAI_MODEL_NAME is missing',
      );
      expect(create).not.toHaveBeenCalled();
    });
  });

  describe('planningChatbotResponse', () => {
    const chatbotReply = {
      chatbotResponse: 'What do we know?',
      isPlanComplete: false,
      currentPhase: 'understanding',
      attemptCount: 0,
    };

    it('returns the parsed chatbot response', async () => {
      create.mockResolvedValue(buildToolCompletion(chatbotReply));

      const result = await service.planningChatbotResponse(problem, 'Help me');

      expect(result).toEqual(chatbotReply);
    });

    it('builds the planning prompt from every problem field in order', async () => {
      create.mockResolvedValue(buildToolCompletion(chatbotReply));

      await service.planningChatbotResponse(problem, 'Help me');

      expect(createPlanningPrompt).toHaveBeenCalledWith(
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
    });

    it('sends system prompt followed by the student message when there is no history', async () => {
      create.mockResolvedValue(buildToolCompletion(chatbotReply));

      await service.planningChatbotResponse(problem, 'Help me');

      expect(create.mock.calls[0][0].messages).toEqual([
        { role: 'system', content: 'PLANNING_PROMPT' },
        { role: 'user', content: 'Help me' },
      ]);
    });

    it('treats an empty history the same as no history', async () => {
      create.mockResolvedValue(buildToolCompletion(chatbotReply));

      await service.planningChatbotResponse(problem, 'Help me', []);

      expect(create.mock.calls[0][0].messages).toHaveLength(2);
    });

    it('places conversation history between the system prompt and the new message', async () => {
      create.mockResolvedValue(buildToolCompletion(chatbotReply));
      const history = [
        { role: 'assistant' as const, content: 'Let us begin' },
        { role: 'user' as const, content: 'OK' },
      ];

      await service.planningChatbotResponse(problem, 'Next step?', history);

      expect(create.mock.calls[0][0].messages).toEqual([
        { role: 'system', content: 'PLANNING_PROMPT' },
        ...history,
        { role: 'user', content: 'Next step?' },
      ]);
    });

    it('uses the configured model, requires a tool call and declares the expected tool', async () => {
      create.mockResolvedValue(buildToolCompletion(chatbotReply));

      await service.planningChatbotResponse(problem, 'Help me');

      const params = create.mock.calls[0][0];
      expect(params.model).toBe('test-model');
      expect(params.tool_choice).toBe('required');
      expect(params.tools[0].function.name).toBe(
        'generate_planning_chatbot_response',
      );
      expect(params.tools[0].function.parameters.required).toEqual([
        'chatbotResponse',
        'isPlanComplete',
        'currentPhase',
        'attemptCount',
      ]);
    });

    it('preserves isPlanComplete = true from the model', async () => {
      create.mockResolvedValue(
        buildToolCompletion({ ...chatbotReply, isPlanComplete: true }),
      );

      const result = await service.planningChatbotResponse(problem, 'Done');

      expect(result.isPlanComplete).toBe(true);
    });

    it('throws InternalServerErrorException when there is no tool call', async () => {
      create.mockResolvedValue({
        choices: [{ finish_reason: 'stop', message: { content: 'hi' } }],
      });

      await expect(
        service.planningChatbotResponse(problem, 'Help me'),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('throws when the tool call has empty arguments', async () => {
      create.mockResolvedValue(buildToolCompletion(''));

      await expect(
        service.planningChatbotResponse(problem, 'Help me'),
      ).rejects.toThrow('No tool call response from OpenAI');
    });

    it('propagates malformed JSON in tool arguments as a SyntaxError', async () => {
      create.mockResolvedValue(buildToolCompletion('oops'));

      await expect(
        service.planningChatbotResponse(problem, 'Help me'),
      ).rejects.toThrow(SyntaxError);
    });

    it('re-throws OpenAI client errors unchanged', async () => {
      const apiError = new Error('timeout');
      create.mockRejectedValue(apiError);

      await expect(
        service.planningChatbotResponse(problem, 'Help me'),
      ).rejects.toBe(apiError);
    });

    it('propagates prompt-building failures without calling OpenAI', async () => {
      createPlanningPrompt.mockRejectedValue(new Error('prompt failure'));

      await expect(
        service.planningChatbotResponse(problem, 'Help me'),
      ).rejects.toThrow('prompt failure');
      expect(create).not.toHaveBeenCalled();
    });
  });
});
