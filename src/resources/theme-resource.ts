import { loadTheme } from '../theme/loader.js';
import type { LoaderOptions, Theme } from '../types.js';

export const THEME_SECTIONS = [
  'colors',
  'spacing',
  'screens',
  'borderRadius',
  'fontFamily',
  'fontSize',
  'boxShadow',
] as const;

export type ThemeSectionName = (typeof THEME_SECTIONS)[number];

/**
 * Load theme and return JSON string for a single section or full theme.
 * Used by both static resource (tailwind://theme) and template (tailwind://theme/{section}).
 * If section is provided but missing in theme, returns "{}".
 */
export async function getThemeResourceContentForSection(
  section: string | undefined,
  options: LoaderOptions & { configPath?: string } = {}
): Promise<string> {
  const theme = await loadTheme({
    configPath: options.configPath,
    tailwindVersion: options.tailwindVersion,
  });
  const data = section
    ? Object.prototype.hasOwnProperty.call(theme, section)
      ? { [section]: theme[section as keyof Theme] }
      : {}
    : theme;
  return JSON.stringify(data, null, 2);
}

export async function getThemeResourceContent(
  uri: URL,
  options: LoaderOptions & { configPath?: string } = {}
): Promise<string> {
  const path = uri.pathname.replace(/^\/+/, '');
  const section =
    path && path !== 'theme' ? path.replace(/^theme\/?/, '') : undefined;
  return getThemeResourceContentForSection(section, options);
}

export function getThemeResourceUri(section?: string): string {
  if (section) return `tailwind://theme/${section}`;
  return 'tailwind://theme';
}
