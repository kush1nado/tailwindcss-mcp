import type { SuggestClassesResult } from '../types.js';
import { loadTheme } from '../theme/loader.js';
import { createClassRegistry } from '../registry/class-registry.js';
import type { LoaderOptions } from '../types.js';

const KEYWORD_MAP: Record<string, string[]> = {
  red: ['bg-red-500', 'text-red-500', 'border-red-500'],
  blue: ['bg-blue-500', 'text-blue-500', 'border-blue-500'],
  green: ['bg-green-500', 'text-green-500', 'border-green-500'],
  gray: ['bg-gray-500', 'text-gray-500', 'border-gray-500'],
  white: ['bg-white', 'text-white'],
  black: ['bg-black', 'text-black'],
  button: ['px-4', 'py-2', 'rounded', 'font-medium', 'cursor-pointer'],
  padding: ['p-4', 'px-4', 'py-2', 'p-2'],
  margin: ['m-4', 'mx-4', 'my-2', 'mt-4'],
  rounded: ['rounded', 'rounded-lg', 'rounded-md', 'rounded-xl'],
  center: ['flex', 'items-center', 'justify-center', 'text-center'],
  flex: ['flex', 'flex-col', 'flex-row', 'items-center', 'justify-between'],
  grid: ['grid', 'grid-cols-2', 'grid-cols-3', 'gap-4'],
  hidden: ['hidden', 'invisible'],
  visible: ['block', 'flex', 'visible'],
  shadow: ['shadow', 'shadow-md', 'shadow-lg'],
  border: ['border', 'border-2', 'border-gray-200'],
  text: ['text-sm', 'text-base', 'text-lg', 'text-xl', 'font-medium'],
  small: ['text-sm', 'p-2'],
  large: ['text-lg', 'p-4'],
};

function tokenize(description: string): string[] {
  return description
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export async function suggestClasses(
  description: string,
  options: LoaderOptions & { configPath?: string } = {}
): Promise<SuggestClassesResult> {
  const theme = await loadTheme({ configPath: options.configPath, tailwindVersion: options.tailwindVersion });
  const registry = createClassRegistry(theme);
  const tokens = tokenize(description);
  const suggested = new Set<string>();

  for (const token of tokens) {
    const mapped = KEYWORD_MAP[token];
    if (mapped) {
      mapped.forEach((c) => {
        if (registry.has(c)) suggested.add(c);
      });
    }
    for (const [keyword, classes] of Object.entries(KEYWORD_MAP)) {
      if (token.includes(keyword) || keyword.includes(token)) {
        classes.forEach((c) => {
          if (registry.has(c)) suggested.add(c);
        });
      }
    }
  }

  const fromRegistry = Array.from(registry.all()).filter((cls) => {
    return tokens.some((t) => cls.includes(t) || cls.startsWith(t));
  });
  fromRegistry.slice(0, 30).forEach((c) => suggested.add(c));

  const classes = Array.from(suggested);
  const explanation =
    classes.length > 0
      ? `Suggested ${classes.length} class(es) based on keywords: ${tokens.join(', ')}.`
      : `No matching classes for: ${description}. Try more common terms (e.g. red, button, padding, rounded).`;

  return { classes, explanation };
}
