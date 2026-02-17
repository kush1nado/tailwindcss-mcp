import type { ValidateClassesResult } from '../types.js';
import { loadTheme } from '../theme/loader.js';
import { createClassRegistry } from '../registry/class-registry.js';
import type { LoaderOptions } from '../types.js';

const ARBITRARY_PATTERN = /^[\w-]+:?\[[\s\S]*\]$/;

function parseClassInput(classes: string | string[]): string[] {
  if (Array.isArray(classes)) {
    return classes.flatMap((s) => s.trim().split(/\s+/)).filter(Boolean);
  }
  return String(classes)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function isArbitraryValue(cls: string): boolean {
  return ARBITRARY_PATTERN.test(cls);
}

export async function validateClasses(
  classes: string | string[],
  options: LoaderOptions & { configPath?: string } = {}
): Promise<ValidateClassesResult> {
  const theme = await loadTheme({ configPath: options.configPath, tailwindVersion: options.tailwindVersion });
  const registry = createClassRegistry(theme);
  const list = parseClassInput(classes);
  const valid: string[] = [];
  const unknown: string[] = [];

  for (const cls of list) {
    if (registry.has(cls) || isArbitraryValue(cls)) {
      valid.push(cls);
    } else {
      unknown.push(cls);
    }
  }

  return { valid, unknown };
}
