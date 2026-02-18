import type { SuggestClassesResult } from '../types.js';
import { loadTheme } from '../theme/loader.js';
import { createClassRegistry } from '../registry/class-registry.js';
import type { LoaderOptions } from '../types.js';
import {
  KEYWORD_MAP,
  SCENARIO_MAP,
  COLOR_SYNONYMS,
  SHADE_MODIFIERS,
  PHRASE_PREPROCESS,
  getCategory,
} from './suggest-keywords.js';

const TOP_N = 80;
const RANK_SCENARIO = 1;
const RANK_EXACT_KEYWORD = 2;
const RANK_PARTIAL_KEYWORD = 3;
const RANK_REGISTRY = 4;

function preprocessDescription(description: string): string {
  let s = description.toLowerCase().trim();
  for (const [phrase, replacement] of Object.entries(PHRASE_PREPROCESS)) {
    const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    s = s.replace(re, replacement);
  }
  return s;
}

function tokenize(description: string): string[] {
  return description
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeTokens(tokens: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const next = tokens[i + 1];
    const lower = t.toLowerCase();
    const synonym = COLOR_SYNONYMS[lower];
    const shadeMod = SHADE_MODIFIERS[lower];
    if (synonym) {
      out.push(synonym);
    } else if (shadeMod && next && COLOR_SYNONYMS[next?.toLowerCase()]) {
      const color = COLOR_SYNONYMS[next.toLowerCase()];
      out.push(`${color}-${shadeMod}`);
      i++;
    } else if (shadeMod && next) {
      const color = next.toLowerCase();
      if (Object.keys(KEYWORD_MAP).includes(color)) {
        out.push(`${color}-${shadeMod}`);
        i++;
      } else {
        out.push(lower);
      }
    } else {
      out.push(lower);
    }
  }
  return out;
}

function bigrams(tokens: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    out.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return out;
}

function trigrams(tokens: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < tokens.length - 2; i++) {
    out.push(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
  }
  return out;
}

interface RankedClass {
  cls: string;
  rank: number;
}

export async function suggestClasses(
  description: string,
  options: LoaderOptions & { configPath?: string } = {}
): Promise<SuggestClassesResult> {
  const theme = await loadTheme({ configPath: options.configPath, tailwindVersion: options.tailwindVersion });
  const registry = createClassRegistry(theme);
  const preprocessed = preprocessDescription(description);
  const rawTokens = tokenize(preprocessed);
  const tokens = normalizeTokens(rawTokens);
  const candidateRanks = new Map<string, number>();

  function addWithRank(classes: string[], rank: number): void {
    for (const c of classes) {
      if (registry.has(c) && (!candidateRanks.has(c) || candidateRanks.get(c)! > rank)) {
        candidateRanks.set(c, rank);
      }
    }
  }

  const phrases = [...bigrams(tokens), ...trigrams(tokens)];
  for (const phrase of phrases) {
    const scenarioClasses = SCENARIO_MAP[phrase];
    if (scenarioClasses) addWithRank(scenarioClasses, RANK_SCENARIO);
  }

  for (const token of tokens) {
    const exact = KEYWORD_MAP[token];
    if (exact) addWithRank(exact, RANK_EXACT_KEYWORD);
    for (const [keyword, classes] of Object.entries(KEYWORD_MAP)) {
      if (token !== keyword && (token.includes(keyword) || keyword.includes(token))) {
        addWithRank(classes, RANK_PARTIAL_KEYWORD);
      }
    }
  }

  const fromRegistry = Array.from(registry.all()).filter((cls) =>
    tokens.some((t) => cls.includes(t) || cls.startsWith(t))
  );
  for (const c of fromRegistry) {
    if (!candidateRanks.has(c)) candidateRanks.set(c, RANK_REGISTRY);
  }

  const ranked: RankedClass[] = Array.from(candidateRanks.entries()).map(([cls, rank]) => ({ cls, rank }));
  ranked.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.cls.localeCompare(b.cls);
  });
  const classes = ranked.slice(0, TOP_N).map((r) => r.cls);

  const byCategory = new Map<string, string[]>();
  for (const cls of classes) {
    const cat = getCategory(cls);
    const list = byCategory.get(cat) ?? [];
    list.push(cls);
    byCategory.set(cat, list);
  }
  const groupLines = Array.from(byCategory.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([cat, list]) => `${cat}: ${list.join(', ')}`)
    .join('. ');

  const explanation =
    classes.length > 0
      ? `Suggested ${classes.length} class(es) based on: ${tokens.join(', ')}. ${groupLines}`
      : `No matching classes for: ${description}. Try common terms (e.g. red, button, padding, rounded).`;

  return { classes, explanation };
}
