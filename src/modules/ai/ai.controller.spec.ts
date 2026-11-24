import { HttpStatus } from '@nestjs/common';
import { HTTP_CODE_METADATA, METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';

import { AIController } from './ai.controller';

describe('AIController', () => {
  let controller: AIController;
  let aiService: { cowriteProblem: jest.Mock; planningChatbotResponse: jest.Mock };

  beforeEach(() => {
    aiService = {
      cowriteProblem: jest.fn(),
      planningChatbotResponse: jest.fn(),
    };
    controller = new AIController(aiService as any);
  });

  describe('cowriteProblem', () => {
    const request = {
      title: 'Free Fall',
      description: 'Gravity',
      discipline: 'Physics',
      statement: 'Drop a ball',
    };

    it('delegates to AIService with the request fields in order', async () => {
      const expected = { essentialConcepts: 'x' };
      aiService.cowriteProblem.mockResolvedValue(expected);

      const result = await controller.cowriteProblem(request as any);

      expect(aiService.cowriteProblem).toHaveBeenCalledWith(
        'Free Fall',
        'Gravity',
        'Physics',
        'Drop a ball',
      );
      expect(result).toBe(expected);
    });

    it('propagates service errors', async () => {
      aiService.cowriteProblem.mockRejectedValue(new Error('boom'));

      await expect(controller.cowriteProblem(request as any)).rejects.toThrow(
        'boom',
      );
    });
  });

  describe('planningChatbotResponse', () => {
    const problem = { discipline: 'Physics', title: 'T' };

    it('delegates to AIService with problem, message and history', async () => {
      const expected = { chatbotResponse: 'hi' };
      const history = [{ role: 'user', content: 'hello' }];
      aiService.planningChatbotResponse.mockResolvedValue(expected);

      const result = await controller.planningChatbotResponse({
        problem,
        studentMessage: 'Help',
        conversationHistory: history,
      } as any);

      expect(aiService.planningChatbotResponse).toHaveBeenCalledWith(
        problem,
        'Help',
        history,
      );
      expect(result).toBe(expected);
    });

    it('passes undefined history through when it is omitted', async () => {
      aiService.planningChatbotResponse.mockResolvedValue({});

      await controller.planningChatbotResponse({
        problem,
        studentMessage: 'Help',
      } as any);

      expect(aiService.planningChatbotResponse).toHaveBeenCalledWith(
        problem,
        'Help',
        undefined,
      );
    });

    it('propagates service errors', async () => {
      aiService.planningChatbotResponse.mockRejectedValue(new Error('fail'));

      await expect(
        controller.planningChatbotResponse({ problem, studentMessage: 'x' } as any),
      ).rejects.toThrow('fail');
    });
  });

  describe('route metadata', () => {
    it('mounts the controller at /ai', () => {
      expect(Reflect.getMetadata(PATH_METADATA, AIController)).toBe('ai');
    });

    it.each([
      ['cowriteProblem', 'cowrite-problem'],
      ['planningChatbotResponse', 'planning-response'],
    ])('%s is a POST on %s returning 200', (method, path) => {
      const handler = AIController.prototype[method as keyof AIController];
      expect(Reflect.getMetadata(PATH_METADATA, handler)).toBe(path);
      expect(Reflect.getMetadata(METHOD_METADATA, handler)).toBe(RequestMethod.POST);
      expect(Reflect.getMetadata(HTTP_CODE_METADATA, handler)).toBe(HttpStatus.OK);
    });
  });
});
