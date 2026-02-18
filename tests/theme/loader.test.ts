import { describe, it } from 'node:test';
import assert from 'node:assert';
import { loadTheme } from '../../src/theme/loader.js';
import { DEFAULT_THEME_V4 } from '../../src/theme/defaults-v4.js';

describe('loadTheme', () => {
  it('returns theme with colors and spacing for default options', async () => {
    const theme = await loadTheme({});
    assert.ok(theme && typeof theme === 'object');
    assert.ok('colors' in theme && typeof theme.colors === 'object');
    assert.ok('spacing' in theme && typeof theme.spacing === 'object');
  });

  it('tailwindVersion 4 returns theme with same structure as DEFAULT_THEME_V4', async () => {
    const theme = await loadTheme({ tailwindVersion: '4' });
    assert.ok(theme.colors && typeof theme.colors === 'object');
    assert.ok(theme.spacing && typeof theme.spacing === 'object');
    assert.ok(theme.screens && typeof theme.screens === 'object');
    assert.deepStrictEqual(Object.keys(theme).sort(), Object.keys(DEFAULT_THEME_V4).sort());
  });

  it('second call with same options returns same result (cache)', async () => {
    const a = await loadTheme({});
    const b = await loadTheme({});
    assert.strictEqual(a, b);
  });
});
