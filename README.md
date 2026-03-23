# Cuprice MCP Server

MCP (Model Context Protocol) server for managing Cuprice pricing projects from AI tools like Cursor, Claude Desktop, and Claude Code.

## Tools

| Tool | Description |
|------|-------------|
| `list-projects` | List all your pricing projects |
| `get-project` | Get full project details (plans, features, theme) |
| `get-shared-project` | Get public pricing data by Share ID |
| `create-project` | Create a new project |
| `update-project` | Update project settings |
| `add-feature` | Add a feature to a project's backlog |
| `create-plan` | Create a pricing plan |
| `add-feature-to-plan` | Add a feature to a plan |
| `publish-project` | Publish a project to get a Share ID |
| `get-embed-code` | Get embed snippet (HTML, Next.js, or React) |
| `get-receipt` | Get purchase details from a Stripe session |

## Setup

```bash
npm install
npm run build
```

## Use with Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "cuprice": {
      "command": "node",
      "args": ["/path/to/cuprice-mcp/dist/index.js"],
      "env": {
        "CUPRICE_BASE": "http://localhost:3000",
        "CUPRICE_AUTH_TOKEN": "your-session-token"
      }
    }
  }
}
```

## Use with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cuprice": {
      "command": "node",
      "args": ["/absolute/path/to/cuprice-mcp/dist/index.js"],
      "env": {
        "CUPRICE_BASE": "http://localhost:3000",
        "CUPRICE_AUTH_TOKEN": "your-session-token"
      }
    }
  }
}
```

## Use with Claude Code

```bash
claude mcp add cuprice node /path/to/cuprice-mcp/dist/index.js \
  -e CUPRICE_BASE=http://localhost:3000 \
  -e CUPRICE_AUTH_TOKEN=your-session-token
```
