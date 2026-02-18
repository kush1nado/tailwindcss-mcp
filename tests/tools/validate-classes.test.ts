import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateClasses } from '../../src/tools/validate-classes.js';

describe('validateClasses', () => {
  it('validates known classes as valid with default theme', async () => {
    const result = await validateClasses('flex p-4 bg-red-500');
    assert.ok(Array.isArray(result.valid));
    assert.ok(Array.isArray(result.unknown));
    assert.ok(result.valid.includes('flex'));
    assert.ok(result.valid.includes('p-4'));
    assert.ok(result.valid.includes('bg-red-500'));
    assert.strictEqual(result.unknown.length, 0);
  });

  it('puts unknown class in unknown array', async () => {
    const result = await validateClasses('flex unknown-class');
    assert.ok(result.valid.includes('flex'));
    assert.ok(result.unknown.includes('unknown-class'));
  });

  it('accepts array input', async () => {
    const result = await validateClasses(['flex', 'p-4']);
    assert.ok(result.valid.includes('flex'));
    assert.ok(result.valid.includes('p-4'));
    assert.strictEqual(result.unknown.length, 0);
  });

  it('treats arbitrary value class as valid', async () => {
    const result = await validateClasses('w-[10px]');
    assert.ok(result.valid.includes('w-[10px]'));
    assert.ok(!result.unknown.includes('w-[10px]'));
  });
});
