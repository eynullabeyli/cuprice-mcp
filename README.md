# Cuprice MCP Server

Public MCP (Model Context Protocol) server for integrating Cuprice pricing widgets from AI tools like Cursor, Claude Desktop, and Claude Code.

## Tools

| Tool | Description |
|------|-------------|
| `get-pricing` | Get public pricing data (plans, features, theme) by Share ID |
| `get-embed-code` | Get embed snippet for HTML, Next.js, or React |
| `get-receipt` | Get Stripe purchase details from a checkout session |
| `get-css-classes` | Get CSS class names for widget customization |

## Use with Cursor (remote — recommended)

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

## Use with Claude Code

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

## Deploy to Vercel

```bash
vercel deploy --prod
```

Set `CUPRICE_BASE` env var in Vercel project settings (default: `https://cuprice.io`).

## Links

- [Documentation](https://docs.cuprice.io/mcp)
- [llms.txt](https://mcp.cuprice.io/llms.txt)
- [llms-full.txt](https://mcp.cuprice.io/llms-full.txt)
