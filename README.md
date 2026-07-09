# Cuprice MCP Server

Public MCP (Model Context Protocol) server for integrating Cuprice pricing widgets from AI tools like Cursor, Claude Desktop, and Claude Code.

This repository is a Cuprice-specific MCP adapter. It exposes a small set of public tools for reading pricing data, generating embed snippets, and retrieving purchase details from Cuprice-backed Stripe checkouts.

## Tools

| Tool | Description |
|------|-------------|
| `get-pricing` | Get public pricing data (plans, features, theme) by Share ID |
| `get-embed-code` | Get embed snippet for HTML, Next.js, React, or Vue (pricing or billing widget) |
| `get-receipt` | Get Stripe purchase details from a checkout session |
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
claude mcp add cuprice --url https://mcp.cuprice.io/mcp
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

## Docker

```bash
docker compose up --build -d
```

## Development

```bash
npm run dev
npm test
```

## Security notes

`get-receipt` depends on a checkout `sessionId` and a Cuprice `shareId`. Before deploying this server in a new environment, review the upstream `/api/stripe/receipt` behavior and confirm the returned purchase data matches your privacy expectations.

## Links

- [Documentation](https://docs.cuprice.io/mcp)
- [llms.txt](https://mcp.cuprice.io/llms.txt)
- [llms-full.txt](https://mcp.cuprice.io/llms-full.txt)
