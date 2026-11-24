import { createPlanningPrompt } from './chatbot/planningPrompts';
import { createAnswerCheckingPrompt } from './chatbot/answerCheckingPrompts';
import { createReflectionPrompt } from './chatbot/reflectionPrompt';
import {
  createCowriteProblemPrompt,
  createPlanningEvaluationPrompt,
  createEvaluationWithRubricPrompt,
} from './generativePrompts';

const unresolved = /\$\{[A-Za-z]+\}/;

describe('createPlanningPrompt', () => {
  const prompt = createPlanningPrompt(
    'DISC',
    'TITLE',
    'DESCRIPTION',
    'STATEMENT',
    'CONCEPTS',
    'CONNECTION',
    'ASSUMPTIONS',
    'MISTAKES',
    'ADDITIONAL',
    'PLAN',
  );

  it.each([
    'DISC',
    'TITLE',
    'DESCRIPTION',
    'STATEMENT',
    'CONCEPTS',
    'CONNECTION',
    'ASSUMPTIONS',
    'MISTAKES',
    'ADDITIONAL',
    'PLAN',
  ])('includes %s in the prompt', (value) => {
    expect(prompt).toContain(value);
  });

  it('places each value under its matching label', () => {
    expect(prompt).toContain('Title: TITLE');
    expect(prompt).toContain('Description: DESCRIPTION');
    expect(prompt).toContain('Statement: STATEMENT');
    expect(prompt).toContain('Instructor reference concepts: CONCEPTS');
    expect(prompt).toContain('Instructor reference connections: CONNECTION');
    expect(prompt).toContain('Instructor reference assumptions: ASSUMPTIONS');
    expect(prompt).toContain('Instructor reference additional information: ADDITIONAL');
    expect(prompt).toContain('Instructor reference full plan: PLAN');
    expect(prompt).toContain('Instructor reference common mistakes: MISTAKES');
  });

  it('uses the discipline in the role description', () => {
    expect(prompt).toContain('specialized DISC problem-solving coach');
  });

  it('is wrapped in <prompt> tags and has no unresolved placeholders', () => {
    expect(prompt).toContain('<prompt>');
    expect(prompt).toContain('</prompt>');
    expect(prompt).not.toMatch(unresolved);
  });
});

describe('createAnswerCheckingPrompt', () => {
  const prompt = createAnswerCheckingPrompt('DISC', 'TITLE', 'DESCRIPTION', 'STATEMENT');

  it('includes all problem details', () => {
    expect(prompt).toContain('specialized DISC problem-solving coach');
    expect(prompt).toContain('Title: TITLE');
    expect(prompt).toContain('Description: DESCRIPTION');
    expect(prompt).toContain('Statement: STATEMENT');
  });

  it('has no unresolved placeholders', () => {
    expect(prompt).not.toMatch(unresolved);
  });
});

describe('createReflectionPrompt', () => {
  const prompt = createReflectionPrompt(
    'DISC',
    'TITLE',
    'DESCRIPTION',
    'STATEMENT',
    'INSTRUCTOR_SOLUTION',
    'STUDENT_SOLUTION',
  );

  it('includes all problem details and both solutions', () => {
    expect(prompt).toContain('specialized DISC learning coach');
    expect(prompt).toContain('Title: TITLE');
    expect(prompt).toContain('Description: DESCRIPTION');
    expect(prompt).toContain('Statement: STATEMENT');
    expect(prompt).toContain('INSTRUCTOR_SOLUTION');
    expect(prompt).toContain('STUDENT_SOLUTION');
  });

  it('has no unresolved placeholders', () => {
    expect(prompt).not.toMatch(unresolved);
  });
});

describe('createCowriteProblemPrompt (prompts module)', () => {
  it('includes all inputs', () => {
    const prompt = createCowriteProblemPrompt('TITLE', 'DESCRIPTION', 'DISC', 'STATEMENT');
    expect(prompt).toContain('expert of DISC discipline');
    expect(prompt).toContain('Title: TITLE');
    expect(prompt).toContain('Description: DESCRIPTION');
    expect(prompt).toContain('Problem Statement: STATEMENT');
    expect(prompt).not.toMatch(unresolved);
  });
});

describe('createPlanningEvaluationPrompt', () => {
  const prompt = createPlanningEvaluationPrompt(
    'DISC',
    'TITLE',
    'DESCRIPTION',
    'STATEMENT',
    'RUBRIC_TEXT',
    4,
  );

  it('includes problem details and the rubric', () => {
    expect(prompt).toContain('expert of DISC discipline');
    expect(prompt).toContain('Title: TITLE');
    expect(prompt).toContain('Description: DESCRIPTION');
    expect(prompt).toContain('Problem Statement: STATEMENT');
    expect(prompt).toContain('RUBRIC_TEXT');
  });

  it('has no unresolved placeholders', () => {
    expect(prompt).not.toMatch(unresolved);
  });
});

describe('createEvaluationWithRubricPrompt', () => {
  const prompt = createEvaluationWithRubricPrompt(
    'DISC',
    'TITLE',
    'DESCRIPTION',
    'STATEMENT',
    'RUBRIC_TEXT',
    5,
    3,
  );

  it('includes problem details and the rubric', () => {
    expect(prompt).toContain('expert of DISC discipline');
    expect(prompt).toContain('Title: TITLE');
    expect(prompt).toContain('Problem Statement: STATEMENT');
    expect(prompt).toContain('RUBRIC_TEXT');
  });

  it('states the number of levels and criteria', () => {
    expect(prompt).toContain('out of 5 levels');
    expect(prompt).toContain('all 3 criteria');
  });

  it('has no unresolved placeholders', () => {
    expect(prompt).not.toMatch(unresolved);
  });
});
