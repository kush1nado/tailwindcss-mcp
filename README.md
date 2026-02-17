# TailwindCSS MCP Server

An [MCP](https://modelcontextprotocol.io) (Model Context Protocol) server for Tailwind CSS. It gives AI assistants context and tools to suggest and validate utility classes and to read the current theme, so you don’t have to look up or paste classes manually.

## Features

- **suggest_classes** – Suggest Tailwind utility classes from a short description (e.g. “red button with padding and rounded corners”).
- **validate_classes** – Check a list of class names and get back which are valid and which are unknown.
- **get_theme** – Return the Tailwind theme (or a section like `colors`, `spacing`, `screens`) as JSON.
- **Resource: tailwind://theme** – Read the current theme as a JSON resource for context.

Theme and class set are built from the default Tailwind v3 config, or from a project’s `tailwind.config.*` when a path is provided. Optional support for Tailwind v4 via a static theme reference (`TAILWIND_VERSION=4`).

## Installation

```bash
npm install -g tailwindcss-mcp
# or
pnpm add -g tailwindcss-mcp
```

If you get **EACCES** (permission denied) when installing globally, npm is trying to write to a system directory. Use one of these approaches:

1. **User-owned global directory (recommended)** – install globals without sudo:
   ```bash
   mkdir -p ~/.npm-global
   npm config set prefix ~/.npm-global
   ```
   Add to your `~/.zshrc` (or `~/.bashrc`): `export PATH="$HOME/.npm-global/bin:$PATH"`, then run `source ~/.zshrc`. After that, `npm install -g tailwindcss-mcp` will work.

2. **No global install** – clone or install the package somewhere (e.g. `~/dev/tailwindcss-mcp`), run `npm install && npm run build`, and in Cursor point to that path:
   ```json
   "command": "node",
   "args": ["/Users/you/dev/tailwindcss-mcp/dist/index.js"]
   ```

From source:

```bash
git clone https://github.com/kush1nado/tailwindcss-mcp.git
cd tailwindcss-mcp
npm install
npm run build
```

## Configuration

### Cursor

Add the server in Cursor MCP settings (e.g. **Settings → MCP** or `.cursor/mcp.json`).

If installed globally:

```json
{
  "mcpServers": {
    "tailwindcss": {
      "command": "tailwindcss-mcp"
    }
  }
}
```

Or run the built file directly:

```json
{
  "mcpServers": {
    "tailwindcss": {
      "command": "node",
      "args": ["/path/to/tailwindcss-mcp/dist/index.js"]
    }
  }
}
```

With optional project config path (directory or path to `tailwind.config.js`):

```json
{
  "mcpServers": {
    "tailwindcss": {
      "command": "node",
      "args": ["/path/to/tailwindcss-mcp/dist/index.js", "--config=/path/to/your/project"]
    }
  }
}
```

Or via environment:

```json
{
  "mcpServers": {
    "tailwindcss": {
      "command": "node",
      "args": ["/path/to/tailwindcss-mcp/dist/index.js"],
      "env": {
        "TAILWIND_CONFIG_PATH": "/path/to/your/project"
      }
    }
  }
}
```

### Claude Desktop

In Claude Desktop config (e.g. `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "tailwindcss": {
      "command": "node",
      "args": ["/path/to/tailwindcss-mcp/dist/index.js"]
    }
  }
}
```

### Optional environment variables

- **TAILWIND_CONFIG_PATH** – Path to project directory or to `tailwind.config.js` / `tailwind.config.mjs` / etc. Used when no per-call `configPath` is passed.
- **TAILWIND_VERSION** – `3` (default) or `4`. Use `4` for Tailwind v4 static theme reference when `resolveConfig` is not available.

You can also pass `--config=/path` as a single argument when starting the server.

## Tool examples

- **suggest_classes**  
  - `description`: e.g. `"red button with padding and rounded corners"`  
  - Optional `configPath` for this call.

- **validate_classes**  
  - `classes`: space-separated string or array of class names.  
  - Optional `configPath`.

- **get_theme**  
  - Optional `section`: `colors`, `spacing`, `screens`, `borderRadius`, `fontFamily`, `fontSize`, `boxShadow`.  
  - Optional `configPath`.

## Troubleshooting

**"Connection closed" / "No server info found" in Cursor** – The MCP process exits before the handshake. Common causes:

1. **Global install from npm** – Older tarballs might not include the built `dist/` folder. Reinstall the latest version, or run the server by path instead of the `tailwindcss-mcp` command:
   ```json
   "tailwindcss": {
     "command": "node",
     "args": ["/absolute/path/to/tailwindcss-mcp/dist/index.js"]
   }
   ```
   (Use the path where the repo is cloned or the package is installed; run `npm run build` there first.)

2. **Crash on startup** – Run in a terminal to see the error:
   ```bash
   tailwindcss-mcp
   ```
   or `node /path/to/tailwindcss-mcp/dist/index.js`. Any message printed to stderr will point to the cause.

## License

MIT
