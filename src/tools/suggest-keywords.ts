/**
 * Keyword and scenario mappings for suggest_classes.
 * Single token -> classes.
 */
export const KEYWORD_MAP: Record<string, string[]> = {
  red: ['bg-red-500', 'text-red-500', 'border-red-500'],
  blue: ['bg-blue-500', 'text-blue-500', 'border-blue-500'],
  green: ['bg-green-500', 'text-green-500', 'border-green-500'],
  gray: ['bg-gray-500', 'text-gray-500', 'border-gray-500'],
  white: ['bg-white', 'text-white'],
  black: ['bg-black', 'text-black'],
  amber: ['bg-amber-500', 'text-amber-500', 'border-amber-500'],
  slate: ['bg-slate-500', 'text-slate-500', 'border-slate-500'],
  zinc: ['bg-zinc-500', 'text-zinc-500', 'border-zinc-500'],
  indigo: ['bg-indigo-500', 'text-indigo-500', 'border-indigo-500'],
  violet: ['bg-violet-500', 'text-violet-500', 'border-violet-500'],
  purple: ['bg-purple-500', 'text-purple-500', 'border-purple-500'],
  pink: ['bg-pink-500', 'text-pink-500', 'border-pink-500'],
  rose: ['bg-rose-500', 'text-rose-500', 'border-rose-500'],
  orange: ['bg-orange-500', 'text-orange-500', 'border-orange-500'],
  yellow: ['bg-yellow-500', 'text-yellow-500', 'border-yellow-500'],
  lime: ['bg-lime-500', 'text-lime-500', 'border-lime-500'],
  emerald: ['bg-emerald-500', 'text-emerald-500', 'border-emerald-500'],
  teal: ['bg-teal-500', 'text-teal-500', 'border-teal-500'],
  cyan: ['bg-cyan-500', 'text-cyan-500', 'border-cyan-500'],
  sky: ['bg-sky-500', 'text-sky-500', 'border-sky-500'],
  neutral: ['bg-neutral-500', 'text-neutral-500', 'border-neutral-500'],
  stone: ['bg-stone-500', 'text-stone-500', 'border-stone-500'],
  fuchsia: ['bg-fuchsia-500', 'text-fuchsia-500', 'border-fuchsia-500'],
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
  tiny: ['p-1', 'text-xs'],
  huge: ['p-6', 'text-2xl'],
  subtle: ['shadow-sm', 'opacity-90'],
  strong: ['font-bold', 'shadow-md'],
  card: ['rounded-lg', 'border', 'bg-white', 'shadow', 'p-4'],
  badge: ['rounded-full', 'px-2', 'py-0.5', 'text-xs', 'font-medium'],
  input: ['border', 'rounded', 'px-3', 'py-2'],
  header: ['flex', 'items-center', 'justify-between', 'p-4', 'border-b'],
  footer: ['flex', 'items-center', 'p-4', 'border-t'],
  link: ['text-blue-500', 'underline', 'cursor-pointer'],
  alert: ['p-4', 'rounded', 'border'],
};

/**
 * Normalized phrase (2–3 words) -> classes. Higher priority than single keywords.
 */
export const SCENARIO_MAP: Record<string, string[]> = {
  'red button': ['bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded', 'font-medium', 'cursor-pointer'],
  'blue button': ['bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded', 'font-medium', 'cursor-pointer'],
  'green button': ['bg-green-500', 'text-white', 'px-4', 'py-2', 'rounded', 'font-medium', 'cursor-pointer'],
  'centered card': ['flex', 'items-center', 'justify-center', 'rounded-lg', 'border', 'bg-white', 'shadow', 'p-4'],
  'small rounded badge': ['text-xs', 'rounded-full', 'px-2', 'py-0.5', 'font-medium'],
  'rounded corners': ['rounded', 'rounded-lg', 'rounded-md'],
  'dark background': ['bg-gray-900', 'bg-gray-800'],
  'light background': ['bg-gray-50', 'bg-white'],
  'full width': ['w-full'],
  'full height': ['h-full'],
  'flex center': ['flex', 'items-center', 'justify-center'],
  'text center': ['text-center'],
  'space between': ['flex', 'justify-between'],
  'gap small': ['gap-2', 'gap-1'],
  'gap large': ['gap-6', 'gap-8'],
};

/**
 * Color synonym -> canonical Tailwind color name (for KEYWORD_MAP / registry lookup).
 */
export const COLOR_SYNONYMS: Record<string, string> = {
  crimson: 'red',
  scarlet: 'red',
  navy: 'blue',
  aqua: 'cyan',
  lime: 'lime',
  forest: 'green',
  olive: 'green',
  lemon: 'yellow',
  gold: 'amber',
  coral: 'orange',
  salmon: 'pink',
  plum: 'violet',
  lavender: 'violet',
  mint: 'emerald',
  charcoal: 'gray',
  silver: 'gray',
};

/**
 * Shade modifier + color token (normalized) -> theme shade suffix. Applied after synonym.
 */
export const SHADE_MODIFIERS: Record<string, string> = {
  dark: '700',
  darker: '800',
  light: '300',
  lighter: '200',
  bright: '400',
  pale: '100',
};

/**
 * Description phrase -> tokens to add before tokenize (preprocess).
 */
export const PHRASE_PREPROCESS: Record<string, string> = {
  'rounded corners': 'rounded',
  'rounded corner': 'rounded',
  centered: 'center',
  'small text': 'small text',
  'large text': 'large text',
  'dark red': 'dark red',
  'light blue': 'light blue',
  'light gray': 'light gray',
  'dark gray': 'dark gray',
};

/**
 * Class prefix or pattern -> category label for grouped explanation.
 */
export const CATEGORY_BY_PREFIX: Array<{ pattern: RegExp | string; category: string }> = [
  { pattern: /^(flex|grid|block|inline|hidden|visible|overflow|object-|float|clear|isolate)/, category: 'Layout' },
  { pattern: /^(col-|row-|gap|space-)/, category: 'Layout' },
  { pattern: /^(bg-|text-|border-|ring-|from-|via-|to-|fill-|stroke-|placeholder-|decoration-|caret-|accent-)/, category: 'Color' },
  { pattern: /^(p-|px-|py-|pt-|pr-|pb-|pl-|m-|mx-|my-|mt-|mr-|mb-|ml-)/, category: 'Spacing' },
  { pattern: /^(w-|h-|min-|max-|inset|top-|right-|bottom-|left-)/, category: 'Sizing' },
  { pattern: /^(font-|text-|leading-|tracking-|underline|line-through|antialiased|italic)/, category: 'Typography' },
  { pattern: /^(rounded|border|ring|shadow|opacity)/, category: 'Border & Shadow' },
  { pattern: /^(cursor-|pointer-events|select-|resize|appearance)/, category: 'Interaction' },
  { pattern: /^(static|fixed|absolute|relative|sticky|z-)/, category: 'Position' },
];

export function getCategory(cls: string): string {
  for (const { pattern, category } of CATEGORY_BY_PREFIX) {
    if (typeof pattern === 'string') {
      if (cls.startsWith(pattern)) return category;
    } else if (pattern.test(cls)) {
      return category;
    }
  }
  return 'Other';
}
