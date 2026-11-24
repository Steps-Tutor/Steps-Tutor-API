import { PromptsService } from './prompts.service';
import * as planning from '../promptTexts/chatbot/planningPrompts';
import * as answerChecking from '../promptTexts/chatbot/answerCheckingPrompts';
import * as reflection from '../promptTexts/chatbot/reflectionPrompt';
import * as generative from '../promptTexts/generativePrompts';

describe('PromptsService', () => {
  let service: PromptsService;

  beforeEach(() => {
    service = new PromptsService();
  });

  afterEach(() => jest.restoreAllMocks());

  describe('createPlanningPrompt', () => {
    it('returns the planning prompt built from all ten arguments', async () => {
      const result = await service.createPlanningPrompt(
        'Physics',
        'Title',
        'Desc',
        'Statement',
        'Concepts',
        'Connection',
        'Assumptions',
        'Mistakes',
        'Additional',
        'Plan',
      );

      expect(result).toBe(
        planning.createPlanningPrompt(
          'Physics',
          'Title',
          'Desc',
          'Statement',
          'Concepts',
          'Connection',
          'Assumptions',
          'Mistakes',
          'Additional',
          'Plan',
        ),
      );
      expect(result).toContain('Physics');
      expect(result).toContain('Plan');
    });
  });

  describe('createAnswerCheckingPrompt', () => {
    it('returns the answer-checking prompt', async () => {
      const result = await service.createAnswerCheckingPrompt('Math', 'T', 'D', 'S');

      expect(result).toBe(answerChecking.createAnswerCheckingPrompt('Math', 'T', 'D', 'S'));
      expect(result).toContain('Math');
    });
  });

  describe('createReflectionPrompt', () => {
    it('returns the reflection prompt including both solutions', async () => {
      const result = await service.createReflectionPrompt(
        'Math',
        'T',
        'D',
        'S',
        'INSTRUCTOR',
        'STUDENT',
      );

      expect(result).toBe(
        reflection.createReflectionPrompt('Math', 'T', 'D', 'S', 'INSTRUCTOR', 'STUDENT'),
      );
      expect(result).toContain('INSTRUCTOR');
      expect(result).toContain('STUDENT');
    });
  });

  describe('createPlanningEvaluationPrompt', () => {
    it('delegates with the rubric string and level count', async () => {
      const spy = jest.spyOn(generative, 'createPlanningEvaluationPrompt');

      const result = await service.createPlanningEvaluationPrompt(
        'Bio',
        'T',
        'D',
        'S',
        'RUBRIC',
        4,
      );

      expect(spy).toHaveBeenCalledWith('Bio', 'T', 'D', 'S', 'RUBRIC', 4);
      expect(result).toContain('RUBRIC');
    });
  });

  describe('getEvaluationWithRubricPrompt', () => {
    it('delegates with level and metric counts', async () => {
      const spy = jest.spyOn(generative, 'createEvaluationWithRubricPrompt');

      const result = await service.getEvaluationWithRubricPrompt(
        'Bio',
        'T',
        'D',
        'S',
        'RUBRIC',
        5,
        3,
      );

      expect(spy).toHaveBeenCalledWith('Bio', 'T', 'D', 'S', 'RUBRIC', 5, 3);
      expect(result).toContain('RUBRIC');
    });
  });

  describe('replacePromptVariables (private)', () => {
    const replace = (text: string, vars: Record<string, string>) =>
      (service as any).replacePromptVariables(text, vars);

    it('replaces ${key} placeholders with values', () => {
      expect(replace('Hello ${name}!', { name: 'World' })).toBe('Hello World!');
    });

    it('replaces every occurrence of a placeholder', () => {
      expect(replace('${a}-${a}-${a}', { a: 'x' })).toBe('x-x-x');
    });

    it('replaces multiple different placeholders', () => {
      expect(replace('${a} ${b}', { a: '1', b: '2' })).toBe('1 2');
    });

    it('substitutes an empty string for null/undefined values', () => {
      expect(replace('[${a}]', { a: undefined as unknown as string })).toBe('[]');
      expect(replace('[${a}]', { a: null as unknown as string })).toBe('[]');
    });

    it('leaves unknown placeholders untouched', () => {
      expect(replace('${known} ${unknown}', { known: 'k' })).toBe('k ${unknown}');
    });

    it('returns the text unchanged when no variables are given', () => {
      expect(replace('no vars ${x}', {})).toBe('no vars ${x}');
    });
  });
});
