import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { RubricLevelDto, RubricMetricDto } from './rubric.dto';

const level = (order: number, score = order) => ({
  requirement: `Level ${order}`,
  score,
  order,
});

describe('RubricLevelDto', () => {
  it('accepts a valid level (including fractional scores)', async () => {
    const dto = plainToInstance(RubricLevelDto, {
      requirement: 'r',
      score: 2.5,
      order: 1,
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a non-integer order', async () => {
    const dto = plainToInstance(RubricLevelDto, {
      requirement: 'r',
      score: 1,
      order: 1.5,
    });
    expect((await validate(dto)).map((e) => e.property)).toEqual(['order']);
  });

  it('rejects a non-numeric score and a non-string requirement', async () => {
    const dto = plainToInstance(RubricLevelDto, {
      requirement: 5,
      score: 'high',
      order: 1,
    });
    expect((await validate(dto)).map((e) => e.property).sort()).toEqual([
      'requirement',
      'score',
    ]);
  });

  it('rejects NaN scores', async () => {
    const dto = plainToInstance(RubricLevelDto, {
      requirement: 'r',
      score: NaN,
      order: 1,
    });
    expect((await validate(dto)).map((e) => e.property)).toEqual(['score']);
  });
});

describe('RubricMetricDto', () => {
  it('accepts a valid metric with two levels', async () => {
    const dto = plainToInstance(RubricMetricDto, {
      criteria: 'Concepts',
      levels: [level(1), level(2)],
    });
    expect(await validate(dto)).toHaveLength(0);
    expect(dto.levels[0]).toBeInstanceOf(RubricLevelDto);
  });

  it('accepts an optional description', async () => {
    const dto = plainToInstance(RubricMetricDto, {
      criteria: 'Concepts',
      description: 'Identifies relevant concepts',
      levels: [level(1), level(2)],
    });
    expect(await validate(dto)).toHaveLength(0);
  });

  it('rejects a non-string description', async () => {
    const dto = plainToInstance(RubricMetricDto, {
      criteria: 'Concepts',
      description: 7,
      levels: [level(1), level(2)],
    });
    expect((await validate(dto)).map((e) => e.property)).toEqual([
      'description',
    ]);
  });

  it('requires at least two levels', async () => {
    const dto = plainToInstance(RubricMetricDto, {
      criteria: 'Concepts',
      levels: [level(1)],
    });
    expect((await validate(dto)).map((e) => e.property)).toEqual(['levels']);
  });

  it('rejects missing levels and missing criteria', async () => {
    const dto = plainToInstance(RubricMetricDto, {});
    expect((await validate(dto)).map((e) => e.property).sort()).toEqual([
      'criteria',
      'levels',
    ]);
  });

  it('validates nested levels', async () => {
    const dto = plainToInstance(RubricMetricDto, {
      criteria: 'Concepts',
      levels: [level(1), { requirement: 'x', score: 1, order: 'first' }],
    });
    const errors = await validate(dto);
    expect(errors.map((e) => e.property)).toEqual(['levels']);
    expect(errors[0].children).toHaveLength(1);
  });
});
