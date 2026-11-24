import { createCowriteProblemPrompt } from './generativePrompts';

describe('createCowriteProblemPrompt (ai module)', () => {
  const prompt = createCowriteProblemPrompt(
    'Test Title',
    'Test Description',
    'Chemistry',
    'Test Statement',
  );

  it('embeds the discipline, title, description and statement', () => {
    expect(prompt).toContain('expert of Chemistry discipline');
    expect(prompt).toContain('Title: Test Title');
    expect(prompt).toContain('Description: Test Description');
    expect(prompt).toContain('Problem Statement: Test Statement');
  });

  it('asks for all six components', () => {
    for (let i = 1; i <= 6; i++) {
      expect(prompt).toContain(`${i}. `);
    }
    expect(prompt).toContain('essential concepts');
    expect(prompt).toContain('assumptions and simplifications');
    expect(prompt).toContain('step-by-step plan');
  });

  it('does not leave unresolved template placeholders', () => {
    expect(prompt).not.toMatch(/\$\{[^}]*\}/);
  });

  it('inserts values verbatim, including special characters', () => {
    const p = createCowriteProblemPrompt('T', 'D', 'Math', 'Solve x² + $1 = 0 & "quote"');
    expect(p).toContain('Solve x² + $1 = 0 & "quote"');
  });
});
