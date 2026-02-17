import { loadTheme } from '../theme/loader.js';
import type { LoaderOptions } from '../types.js';

export async function getThemeResourceContent(
  uri: URL,
  options: LoaderOptions & { configPath?: string } = {}
): Promise<string> {
  const theme = await loadTheme({
    configPath: options.configPath,
    tailwindVersion: options.tailwindVersion,
  });

  const path = uri.pathname.replace(/^\/+/, '');
  const section = path && path !== 'theme' ? path.replace('theme/', '') : undefined;

  const data = section ? { [section]: theme[section] } : theme;
  return JSON.stringify(data, null, 2);
}

export function getThemeResourceUri(section?: string): string {
  if (section) return `tailwind://theme/${section}`;
  return 'tailwind://theme';
}
