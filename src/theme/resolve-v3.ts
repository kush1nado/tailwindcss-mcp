import { createRequire } from 'node:module';
import type { Theme } from '../types.js';

const require = createRequire(import.meta.url);
const resolveConfig = require('tailwindcss/resolveConfig') as (config: Record<string, unknown>) => { theme?: Theme };

/**
 * Resolves Tailwind v3 config to a full theme (default + overrides).
 * Pass empty object to get default theme only.
 */
export function resolveThemeV3(config: Record<string, unknown> = {}): Theme {
  const resolved = resolveConfig(config);
  const theme = resolved?.theme;
  if (!theme || typeof theme !== 'object') {
    return {};
  }
  return theme;
}
