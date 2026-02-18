import { describe, it } from 'node:test';
import assert from 'node:assert';
import { suggestClasses } from '../../src/tools/suggest-classes.js';

describe('suggestClasses', () => {
  it('"red button" returns red-related and button-related classes', async () => {
    const result = await suggestClasses('red button');
    assert.ok(Array.isArray(result.classes));
    assert.ok(typeof result.explanation === 'string' && result.explanation.length > 0);
    const hasRed = result.classes.some(
      (c) => c.includes('red') || c === 'bg-red-500' || c === 'text-red-500'
    );
    const hasButton = result.classes.some(
      (c) => ['rounded', 'px-4', 'py-2', 'font-medium', 'cursor-pointer'].includes(c)
    );
    assert.ok(hasRed, `expected some red-related class, got: ${result.classes.slice(0, 10).join(', ')}`);
    assert.ok(hasButton, `expected some button-related class, got: ${result.classes.slice(0, 10).join(', ')}`);
  });

  it('"rounded padding" returns rounded and p-* classes', async () => {
    const result = await suggestClasses('rounded padding');
    assert.ok(result.classes.includes('rounded') || result.classes.some((c) => c.startsWith('rounded')));
    const hasPadding = result.classes.some((c) => c.startsWith('p-') || c === 'p-4' || c === 'px-4');
    assert.ok(hasPadding, `expected some padding class, got: ${result.classes.slice(0, 15).join(', ')}`);
  });

  it('returns explanation string', async () => {
    const result = await suggestClasses('xyzzz');
    assert.ok(typeof result.explanation === 'string');
    assert.ok(result.explanation.length > 0);
  });
});
