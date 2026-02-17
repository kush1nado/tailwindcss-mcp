import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import type { Theme, LoaderOptions } from '../types.js';
import { resolveThemeV3 } from './resolve-v3.js';
import { DEFAULT_THEME_V4 } from './defaults-v4.js';

const CONFIG_NAMES = [
  'tailwind.config.js',
  'tailwind.config.cjs',
  'tailwind.config.mjs',
  'tailwind.config.ts',
] as const;

const cache = new Map<string, Theme>();

function getFromCache(key: string): Theme | undefined {
  return cache.get(key);
}

function setCache(key: string, theme: Theme): void {
  cache.set(key, theme);
}

async function findConfigInDir(dir: string): Promise<string | undefined> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const name of CONFIG_NAMES) {
      const found = entries.find((e) => e.isFile() && e.name === name);
      if (found) return join(dir, found.name);
    }
  } catch {
    // ignore
  }
  return undefined;
}

async function isFile(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isFile();
  } catch {
    return false;
  }
}

async function loadConfigFile(configPath: string): Promise<Record<string, unknown>> {
  const require = createRequire(import.meta.url);
  const ext = configPath.slice(configPath.lastIndexOf('.'));
  if (ext === '.ts') {
    try {
      const mod = await import(configPath);
      return (mod.default ?? mod) as Record<string, unknown>;
    } catch {
      const mod = require(configPath);
      return (mod.default ?? mod) as Record<string, unknown>;
    }
  }
  const mod = require(configPath);
  return (mod.default ?? mod) as Record<string, unknown>;
}

/**
 * Load theme: default v3, optional config path, or v4 static when version is 4.
 */
export async function loadTheme(options: LoaderOptions = {}): Promise<Theme> {
  const { configPath, tailwindVersion = '3' } = options;
  const cacheKey = configPath ?? '__default__' + tailwindVersion;

  const cached = getFromCache(cacheKey);
  if (cached !== undefined) return cached;

  if (tailwindVersion === '4') {
    setCache(cacheKey, DEFAULT_THEME_V4);
    return DEFAULT_THEME_V4;
  }

  let config: Record<string, unknown> = {};

  if (configPath) {
    const asFile = await isFile(configPath);
    const configFilePath = asFile ? configPath : await findConfigInDir(configPath);
    if (configFilePath) {
      try {
        config = await loadConfigFile(configFilePath);
      } catch {
        config = {};
      }
    }
  }

  const theme = resolveThemeV3(config);
  setCache(cacheKey, theme);
  return theme;
}

/**
 * Synchronous load for default theme only (v3). Used when async is not available at init.
 */
export function loadThemeSync(options: LoaderOptions = {}): Theme {
  const { tailwindVersion = '3' } = options;
  if (tailwindVersion === '4') return DEFAULT_THEME_V4;
  return resolveThemeV3({});
}
