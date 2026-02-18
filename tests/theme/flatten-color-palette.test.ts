import { describe, it } from 'node:test';
import assert from 'node:assert';
import { flattenColorPalette } from '../../src/theme/flatten-color-palette.js';

describe('flattenColorPalette', () => {
  it('returns flat object for flat input', () => {
    const result = flattenColorPalette({ red: '#f00' });
    assert.deepStrictEqual(result, { red: '#f00' });
  });

  it('flattens nested object with numeric keys', () => {
    const result = flattenColorPalette({
      red: { 500: '#f00', DEFAULT: '#f00' },
    });
    assert.strictEqual(result['red-500'], '#f00');
    assert.strictEqual(result['red'], '#f00');
    assert.strictEqual(Object.keys(result).length, 2);
  });

  it('flattens two-level nesting', () => {
    const result = flattenColorPalette({
      red: {
        500: '#f00',
        600: { DEFAULT: '#b00' },
      },
    } as Record<string, string | Record<string, string>>);
    assert.strictEqual(result['red-500'], '#f00');
    assert.ok('red-600' in result);
  });

  it('returns empty object for empty input', () => {
    const result = flattenColorPalette({});
    assert.deepStrictEqual(result, {});
  });
});
