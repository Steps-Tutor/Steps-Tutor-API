import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  CowriteProblemRequestDto,
  PlanningChatbotRequestDto,
  ProblemDetailsDto,
} from './ai.dto';

const validProblem = {
  id: 'prob-1',
  discipline: 'Physics',
  title: 'Free Fall',
  description: 'Gravity',
  statement: 'Drop a ball',
  essentialConcepts: 'a',
  conceptsConnection: 'b',
  assumptions: 'c',
  commonMistakes: 'd',
  additionalInformation: 'e',
  instructorPlan: 'f',
};

const propertiesWithErrors = (errors: { property: string }[]) =>
  errors.map((e) => e.property).sort();

describe('CowriteProblemRequestDto', () => {
  const valid = {
    title: 'T',
    description: 'D',
    discipline: 'Physics',
    statement: 'S',
  };

  it('accepts a valid payload', async () => {
    const dto = plainToInstance(CowriteProblemRequestDto, valid);
    expect(await validate(dto)).toHaveLength(0);
  });

  it.each(['title', 'description', 'discipline', 'statement'])(
    'rejects a missing %s',
    async (field) => {
      const dto = plainToInstance(CowriteProblemRequestDto, {
        ...valid,
        [field]: undefined,
      });
      expect(propertiesWithErrors(await validate(dto))).toEqual([field]);
    },
  );

  it('rejects non-string values', async () => {
    const dto = plainToInstance(CowriteProblemRequestDto, {
      ...valid,
      title: 123,
      statement: { a: 1 },
    });
    expect(propertiesWithErrors(await validate(dto))).toEqual([
      'statement',
      'title',
    ]);
  });
});

describe('ProblemDetailsDto', () => {
  it('accepts a full payload', async () => {
    const dto = plainToInstance(ProblemDetailsDto, validProblem);
    expect(await validate(dto)).toHaveLength(0);
  });

  it('treats id as optional', async () => {
    const { id, ...withoutId } = validProblem;
    const dto = plainToInstance(ProblemDetailsDto, withoutId);
    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a non-string id', async () => {
    const dto = plainToInstance(ProblemDetailsDto, { ...validProblem, id: 5 });
    expect(propertiesWithErrors(await validate(dto))).toEqual(['id']);
  });

  it.each([
    'discipline',
    'title',
    'description',
    'statement',
    'essentialConcepts',
    'conceptsConnection',
    'assumptions',
    'commonMistakes',
    'additionalInformation',
    'instructorPlan',
  ])('rejects a missing %s', async (field) => {
    const dto = plainToInstance(ProblemDetailsDto, {
      ...validProblem,
      [field]: undefined,
    });
    expect(propertiesWithErrors(await validate(dto))).toEqual([field]);
  });
});

describe('PlanningChatbotRequestDto', () => {
  const valid = {
    problem: validProblem,
    studentMessage: 'Help me',
    conversationHistory: [{ role: 'user', content: 'hi' }],
  };

  it('accepts a valid payload and transforms problem into ProblemDetailsDto', async () => {
    const dto = plainToInstance(PlanningChatbotRequestDto, valid);
    expect(await validate(dto)).toHaveLength(0);
    expect(dto.problem).toBeInstanceOf(ProblemDetailsDto);
  });

  it('treats conversationHistory as optional', async () => {
    const dto = plainToInstance(PlanningChatbotRequestDto, {
      problem: validProblem,
      studentMessage: 'Help me',
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a non-array conversationHistory', async () => {
    const dto = plainToInstance(PlanningChatbotRequestDto, {
      ...valid,
      conversationHistory: 'nope',
    });
    expect(propertiesWithErrors(await validate(dto))).toEqual([
      'conversationHistory',
    ]);
  });

  it('rejects a missing studentMessage', async () => {
    const dto = plainToInstance(PlanningChatbotRequestDto, {
      ...valid,
      studentMessage: undefined,
    });
    expect(propertiesWithErrors(await validate(dto))).toEqual([
      'studentMessage',
    ]);
  });

  // Documents current behaviour: @ValidateNested() alone skips undefined values,
  // so a missing `problem` passes validation. Adding @IsDefined() to
  // PlanningChatbotRequestDto.problem fixes this; then change this test to
  // expect ['problem'] errors.
  it('currently does not reject a missing problem (needs @IsDefined)', async () => {
    const dto = plainToInstance(PlanningChatbotRequestDto, {
      studentMessage: 'x',
    });
    expect(propertiesWithErrors(await validate(dto))).toEqual([]);
  });

  it('reports nested errors for an invalid problem', async () => {
    const dto = plainToInstance(PlanningChatbotRequestDto, {
      ...valid,
      problem: { ...validProblem, title: 42 },
    });
    const errors = await validate(dto);
    expect(propertiesWithErrors(errors)).toEqual(['problem']);
    expect(errors[0].children?.map((c) => c.property)).toEqual(['title']);
  });

  // Documents current behaviour: history entries are not validated individually.
  it('currently does not validate individual conversationHistory entries', async () => {
    const dto = plainToInstance(PlanningChatbotRequestDto, {
      ...valid,
      conversationHistory: [{ role: 'system', content: 123 }],
    });
    expect(await validate(dto)).toHaveLength(0);
  });
});
