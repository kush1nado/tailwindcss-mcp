import { describe, it } from 'node:test';
import assert from 'node:assert';
import { resolveThemeV3 } from '../../src/theme/resolve-v3.js';

describe('resolveThemeV3', () => {
  it('returns theme with colors, spacing, screens for empty config', () => {
    const theme = resolveThemeV3({});
    assert.ok(theme && typeof theme === 'object');
    assert.ok('colors' in theme && typeof theme.colors === 'object');
    assert.ok('spacing' in theme && typeof theme.spacing === 'object');
    assert.ok('screens' in theme && typeof theme.screens === 'object');
  });

  it('merges theme.extend into resolved theme', () => {
    const theme = resolveThemeV3({
      theme: {
        extend: {
          colors: {
            brand: '#abc',
          },
        },
      },
    } as Record<string, unknown>);
    assert.ok(theme.colors && typeof theme.colors === 'object');
    const colors = theme.colors as Record<string, unknown>;
    assert.ok('brand' in colors);
    assert.strictEqual(colors['brand'], '#abc');
  });
});
