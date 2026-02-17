import type { Theme, ThemeSection } from '../types.js';
import { loadTheme } from '../theme/loader.js';
import type { LoaderOptions } from '../types.js';

const KNOWN_SECTIONS: ThemeSection[] = [
  'colors',
  'spacing',
  'screens',
  'borderRadius',
  'fontFamily',
  'fontSize',
  'boxShadow',
];

export async function getTheme(
  section: ThemeSection | undefined,
  options: LoaderOptions & { configPath?: string } = {}
): Promise<Theme | Record<string, unknown>> {
  const theme = await loadTheme({
    configPath: options.configPath,
    tailwindVersion: options.tailwindVersion,
  });

  if (!section) {
    return theme as Record<string, unknown>;
  }

  if (!KNOWN_SECTIONS.includes(section)) {
    const value = theme[section];
    return value !== undefined ? { [section]: value } : {};
  }

  const value = theme[section];
  return value !== undefined ? { [section]: value } : {};
}
