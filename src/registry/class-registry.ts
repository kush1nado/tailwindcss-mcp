import type { Theme } from '../types.js';
import { flattenColorPalette } from '../theme/flatten-color-palette.js';

const COLOR_PREFIXES = [
  'bg', 'text', 'border', 'ring', 'divide', 'placeholder', 'from', 'via', 'to',
  'ring-offset', 'outline', 'decoration', 'caret', 'accent', 'shadow', 'fill', 'stroke',
] as const;

const SPACING_PREFIXES = [
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'w', 'h', 'min-w', 'min-h', 'max-w', 'max-h',
  'gap', 'gap-x', 'gap-y',
  'space-x', 'space-y',
  'inset', 'top', 'right', 'bottom', 'left',
  'translate-x', 'translate-y',
  'scroll-m', 'scroll-mx', 'scroll-my', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml',
  'scroll-p', 'scroll-px', 'scroll-py', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl',
] as const;

const SCREEN_PREFIXES = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

/** Static utilities that do not depend on theme (layout, display, etc.) */
const STATIC_UTILITIES: string[] = [
  'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'hidden',
  'flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse', 'flex-wrap', 'flex-wrap-reverse', 'flex-nowrap',
  'items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch',
  'justify-start', 'justify-end', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly',
  'flex-1', 'flex-auto', 'flex-initial', 'flex-none', 'grow', 'grow-0', 'shrink', 'shrink-0',
  'overflow-auto', 'overflow-hidden', 'overflow-clip', 'overflow-visible', 'overflow-scroll', 'overflow-x-auto', 'overflow-y-auto', 'overflow-x-hidden', 'overflow-y-hidden',
  'rounded', 'rounded-none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
  'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none',
  'opacity-0', 'opacity-5', 'opacity-10', 'opacity-20', 'opacity-25', 'opacity-30', 'opacity-40', 'opacity-50', 'opacity-60', 'opacity-70', 'opacity-75', 'opacity-80', 'opacity-90', 'opacity-95', 'opacity-100',
  'border', 'border-0', 'border-2', 'border-4', 'border-8', 'border-t', 'border-r', 'border-b', 'border-l',
  'border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-none',
  'truncate', 'text-ellipsis', 'text-clip', 'break-normal', 'break-words', 'break-all', 'break-keep',
  'font-sans', 'font-serif', 'font-mono', 'font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black',
  'text-left', 'text-center', 'text-right', 'text-justify', 'underline', 'underline-offset-1', 'underline-offset-2', 'underline-offset-4', 'underline-offset-8', 'line-through', 'no-underline',
  'uppercase', 'lowercase', 'capitalize', 'normal-case', 'italic', 'not-italic',
  'antialiased', 'subpixel-antialiased', 'ordinal', 'tabular-nums', 'diagonal-fractions', 'stacked-fractions',
  'cursor-auto', 'cursor-default', 'cursor-pointer', 'cursor-wait', 'cursor-text', 'cursor-move', 'cursor-not-allowed',
  'pointer-events-none', 'pointer-events-auto', 'resize', 'resize-none', 'resize-y', 'resize-x', 'resize-both',
  'select-none', 'select-text', 'select-all', 'select-auto', 'appearance-none', 'appearance-auto',
  'sr-only', 'not-sr-only', 'static', 'fixed', 'absolute', 'relative', 'sticky',
  'visible', 'invisible', 'collapse',
  'object-contain', 'object-cover', 'object-fill', 'object-none', 'object-scale-down',
  'clear-left', 'clear-right', 'clear-both', 'clear-none', 'float-start', 'float-end', 'float-right', 'float-left', 'float-none',
  'isolate', 'isolation-auto', 'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50', 'z-auto',
  'col-auto', 'col-span-1', 'col-span-2', 'col-span-3', 'col-span-4', 'col-span-5', 'col-span-6', 'col-span-full',
  'row-auto', 'row-span-1', 'row-span-2', 'row-span-3', 'row-span-full',
  'aspect-auto', 'aspect-square', 'aspect-video',
];

function themeToClassSet(theme: Theme): Set<string> {
  const set = new Set<string>();

  const colors = theme.colors;
  if (colors && typeof colors === 'object') {
    const flat = flattenColorPalette(colors as Record<string, string | Record<string, string>>);
    for (const key of Object.keys(flat)) {
      for (const prefix of COLOR_PREFIXES) {
        set.add(`${prefix}-${key}`);
      }
    }
  }

  const spacing = theme.spacing;
  if (spacing && typeof spacing === 'object') {
    for (const key of Object.keys(spacing)) {
      for (const prefix of SPACING_PREFIXES) {
        set.add(`${prefix}-${key}`);
      }
    }
  }

  const borderRadius = theme.borderRadius;
  if (borderRadius && typeof borderRadius === 'object') {
    for (const key of Object.keys(borderRadius)) {
      const suffix = key === 'DEFAULT' ? '' : `-${key}`;
      set.add(`rounded${suffix}`);
    }
  }

  const screens = theme.screens;
  if (screens && typeof screens === 'object') {
    for (const _ of Object.keys(screens)) {
      // Screens are used as variants; we add variant-prefixed classes below
    }
  }

  const fontFamily = theme.fontFamily;
  if (fontFamily && typeof fontFamily === 'object') {
    for (const key of Object.keys(fontFamily)) {
      set.add(`font-${key}`);
    }
  }

  const fontSize = theme.fontSize;
  if (fontSize && typeof fontSize === 'object') {
    for (const key of Object.keys(fontSize)) {
      set.add(`text-${key}`);
    }
  }

  const boxShadow = theme.boxShadow;
  if (boxShadow && typeof boxShadow === 'object') {
    for (const key of Object.keys(boxShadow)) {
      const suffix = key === 'DEFAULT' ? '' : `-${key}`;
      set.add(`shadow${suffix}`);
    }
  }

  return set;
}

function addVariants(baseSet: Set<string>, screens: readonly string[]): Set<string> {
  const out = new Set<string>(baseSet);
  for (const screen of screens) {
    for (const cls of baseSet) {
      out.add(`${screen}:${cls}`);
    }
  }
  return out;
}

export function buildClassRegistry(theme: Theme, options: { includeVariants?: boolean } = {}): Set<string> {
  const base = new Set<string>([...STATIC_UTILITIES, ...themeToClassSet(theme)]);
  if (options.includeVariants !== false && theme.screens && typeof theme.screens === 'object') {
    return addVariants(base, SCREEN_PREFIXES);
  }
  return base;
}

export interface ClassRegistry {
  has(cls: string): boolean;
  all(): ReadonlySet<string>;
}

export function createClassRegistry(theme: Theme, options: { includeVariants?: boolean } = {}): ClassRegistry {
  const set = buildClassRegistry(theme, options);
  return {
    has(cls: string): boolean {
      return set.has(cls);
    },
    all(): ReadonlySet<string> {
      return set;
    },
  };
}
