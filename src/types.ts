/**
 * Normalized theme shape used across the MCP server.
 * Extracted from Tailwind resolved config (v3) or static reference (v4).
 */
export interface Theme {
  colors?: Record<string, string | Record<string, string>>;
  spacing?: Record<string, string>;
  screens?: Record<string, string>;
  borderRadius?: Record<string, string>;
  fontFamily?: Record<string, string[]>;
  fontSize?: Record<string, [string, { lineHeight?: string }?]>;
  boxShadow?: Record<string, string>;
  [key: string]: unknown;
}

export type ThemeSection = keyof Theme;

export interface LoaderOptions {
  /** Path to project directory containing tailwind.config.* */
  configPath?: string;
  /** Use Tailwind v4 static reference when '4', else v3 resolveConfig. */
  tailwindVersion?: '3' | '4';
}

export interface ValidateClassesResult {
  valid: string[];
  unknown: string[];
}

export interface SuggestClassesResult {
  classes: string[];
  explanation: string;
}
