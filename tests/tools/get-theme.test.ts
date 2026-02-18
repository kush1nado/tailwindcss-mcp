import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getTheme } from '../../src/tools/get-theme.js';

describe('getTheme', () => {
  it('without section returns full theme', async () => {
    const theme = await getTheme(undefined, {});
    assert.ok(theme && typeof theme === 'object');
    assert.ok('colors' in theme);
    assert.ok('spacing' in theme);
  });

  it('with section colors returns object with colors key', async () => {
    const result = await getTheme('colors', {});
    assert.ok(result && typeof result === 'object');
    assert.ok('colors' in result);
    assert.ok(typeof (result as Record<string, unknown>).colors === 'object');
  });

  it('with section spacing returns object with spacing key', async () => {
    const result = await getTheme('spacing', {});
    assert.ok('spacing' in result);
  });
});
