#!/usr/bin/env node
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { suggestClasses } from './tools/suggest-classes.js';
import { validateClasses } from './tools/validate-classes.js';
import { getTheme } from './tools/get-theme.js';
import { getThemeResourceContent, getThemeResourceUri } from './resources/theme-resource.js';
import type { ThemeSection } from './types.js';

const TAILWIND_CONFIG_PATH = process.env.TAILWIND_CONFIG_PATH;
const TAILWIND_VERSION = (process.env.TAILWIND_VERSION === '4' ? '4' : '3') as '3' | '4';

function getConfigPathFromArgs(): string | undefined {
  const arg = process.argv.find((a) => a.startsWith('--config='));
  if (arg) return arg.slice('--config='.length);
  return undefined;
}

const configPath = TAILWIND_CONFIG_PATH ?? getConfigPathFromArgs();

const server = new McpServer({
  name: 'tailwindcss-mcp',
  version: '1.0.1',
});

const loaderOptions = () => ({
  configPath,
  tailwindVersion: TAILWIND_VERSION,
});

server.registerTool(
  'suggest_classes',
  {
    description: 'Suggest Tailwind CSS utility classes from a natural language description (e.g. "red button with padding and rounded corners").',
    inputSchema: z.object({
      description: z.string().describe('Short description of the desired styling'),
      configPath: z.string().optional().describe('Optional path to project or tailwind.config file'),
    }),
  },
  async (args: { description: string; configPath?: string }) => {
    const theme = await suggestClasses(args.description, {
      configPath: args.configPath ?? configPath,
      tailwindVersion: TAILWIND_VERSION,
    });
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ classes: theme.classes, explanation: theme.explanation }, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  'validate_classes',
  {
    description: 'Validate a list of Tailwind CSS class names; returns valid and unknown classes.',
    inputSchema: z.object({
      classes: z.union([z.string(), z.array(z.string())]).describe('Class names as string (space-separated) or array'),
      configPath: z.string().optional().describe('Optional path to project or tailwind.config file'),
    }),
  },
  async (args: { classes: string | string[]; configPath?: string }) => {
    const result = await validateClasses(args.classes, {
      configPath: args.configPath ?? configPath,
      tailwindVersion: TAILWIND_VERSION,
    });
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

server.registerTool(
  'get_theme',
  {
    description: 'Get Tailwind theme (or a section: colors, spacing, screens, etc.) as JSON.',
    inputSchema: z.object({
      section: z
        .enum(['colors', 'spacing', 'screens', 'borderRadius', 'fontFamily', 'fontSize', 'boxShadow'])
        .optional()
        .describe('Optional theme section'),
      configPath: z.string().optional().describe('Optional path to project or tailwind.config file'),
    }),
  },
  async (args: { section?: ThemeSection; configPath?: string }) => {
    const theme = await getTheme(args.section, {
      configPath: args.configPath ?? configPath,
      tailwindVersion: TAILWIND_VERSION,
    });
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(theme, null, 2) }],
    };
  }
);

const themeUri = getThemeResourceUri();
server.registerResource(
  'tailwind-theme',
  themeUri,
  {
    title: 'Tailwind theme',
    description: 'Current theme (colors, spacing, screens, etc.) as JSON',
    mimeType: 'application/json',
  },
  async (uri: URL) => {
    const text = await getThemeResourceContent(uri, loaderOptions());
    return {
      contents: [{ uri: uri.href, mimeType: 'application/json', text }],
    };
  }
);

const transport = new StdioServerTransport();
try {
  await server.connect(transport);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`tailwindcss-mcp failed: ${message}\n`);
  if (err instanceof Error && err.stack) {
    process.stderr.write(err.stack);
  }
  process.exitCode = 1;
}
