# Cuprice MCP Server

Public MCP (Model Context Protocol) server for integrating Cuprice pricing widgets from AI tools like Cursor, Claude Desktop, and Claude Code.

This repository is a Cuprice-specific MCP adapter. It exposes a small set of read-only public tools for reading pricing data, generating embed snippets, and listing the widget's CSS classes. No API key is needed.

## Tools

| Tool | Description |
|------|-------------|
| `get-pricing` | Get public pricing data (plans, features, theme) by Share ID |
| `get-embed-code` | Get embed snippet for HTML, Next.js, React, or Vue (pricing or billing widget) |
| `get-receipt` | Deprecated. Stripe checkout was removed; it returns a deprecation notice |
| `get-css-classes` | Get CSS class names for widget customization |

## Remote usage

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cuprice": {
      "url": "https://mcp.cuprice.io/mcp"
    }
  }
}
```

### Claude Code

```bash
claude mcp add --transport http cuprice https://mcp.cuprice.io/mcp
```

## Self-host

```bash
git clone https://github.com/eynullabeyli/cuprice-mcp.git
cd cuprice-mcp
npm install
npm run build
npm start
```

The HTTP server listens on `:5000` by default and exposes `POST /mcp`. For local stdio usage, run:

```bash
npm run start:stdio
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Port for the HTTP server |
| `CUPRICE_BASE` | `https://app.cuprice.io` | Base URL for the Cuprice app host and public API |

Copy `.env.example` to `.env` if you want to override defaults locally.

## Landing page

`public/index.html` is the page served at `/`, styled by `public/assets/site.css` and `public/assets/site.js`. It follows the Cuprice brand book; `DESIGN.md` records the system and `PRODUCT.md` the product facts it relies on.

The brand font (Degular) is licensed to Cuprice and is not in this repository. `public/fonts/` is git-ignored: without it the page falls back to system fonts. For a production build, copy these files from the Cuprice app (`public/fonts/cuprice/`) into `public/fonts/` first: `DegularDisplay-Regular.otf`, `DegularDisplay-Medium.otf`, `Degular-Regular.otf`, `Degular-Medium.otf`, `Degular-Semibold.otf`, `DegularMono-Regular.otf`, `DegularMono-Medium.otf`.

## Docker

```bash
docker compose up --build -d
```

## Development

```bash
npm run dev
npm test
```

## Links

- [Documentation](https://docs.cuprice.io)
- [llms.txt](https://mcp.cuprice.io/llms.txt)
- [llms-full.txt](https://mcp.cuprice.io/llms-full.txt)
