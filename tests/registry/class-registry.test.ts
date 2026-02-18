import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  buildClassRegistry,
  createClassRegistry,
} from '../../src/registry/class-registry.js';
import type { Theme } from '../../src/types.js';

describe('buildClassRegistry / createClassRegistry', () => {
  it('theme with colors produces bg-* and text-* classes', () => {
    const theme: Theme = {
      colors: { red: { 500: '#f00' } },
    };
    const registry = createClassRegistry(theme);
    assert.strictEqual(registry.has('bg-red-500'), true);
    assert.strictEqual(registry.has('text-red-500'), true);
  });

  it('theme with spacing produces p-* and m-* classes', () => {
    const theme: Theme = {
      spacing: { '4': '1rem' },
    };
    const registry = createClassRegistry(theme);
    assert.strictEqual(registry.has('p-4'), true);
    assert.strictEqual(registry.has('m-4'), true);
  });

  it('theme with borderRadius produces rounded-* classes', () => {
    const theme: Theme = {
      borderRadius: { lg: '0.5rem' },
    };
    const registry = createClassRegistry(theme);
    assert.strictEqual(registry.has('rounded-lg'), true);
  });

  it('empty theme still has static utilities', () => {
    const theme: Theme = {};
    const registry = createClassRegistry(theme);
    assert.strictEqual(registry.has('flex'), true);
    assert.strictEqual(registry.has('hidden'), true);
    assert.strictEqual(registry.has('rounded'), true);
  });

  it('createClassRegistry(theme).all() returns non-empty Set', () => {
    const theme: Theme = {};
    const registry = createClassRegistry(theme);
    const all = registry.all();
    assert.strictEqual(all instanceof Set, true);
    assert.ok(all.size > 0);
  });

  it('with theme.screens and includeVariants:false, no screen-prefixed classes', () => {
    const theme: Theme = { screens: { sm: '640px' }, colors: { red: { 500: '#f00' } } };
    const withVariants = buildClassRegistry(theme, { includeVariants: true });
    const withoutVariants = buildClassRegistry(theme, { includeVariants: false });
    const hasSmWith = Array.from(withVariants).some((c) => c.startsWith('sm:'));
    const hasSmWithout = Array.from(withoutVariants).some((c) => c.startsWith('sm:'));
    assert.strictEqual(hasSmWith, true);
    assert.strictEqual(hasSmWithout, false);
  });
});
