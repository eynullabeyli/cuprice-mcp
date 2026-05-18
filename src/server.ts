import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./tools.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5000;
const PUBLIC_DIR = path.resolve(__dirname, "..", "..", "public");

const TOOLS_INFO = [
  { name: "get-pricing", description: "Get public pricing data (plans, features, theme) by Share ID" },
  { name: "get-embed-code", description: "Get embed snippet for HTML, Next.js, React, or Vue" },
  { name: "get-receipt", description: "Get Stripe purchase details from a checkout session" },
  { name: "get-css-classes", description: "Get CSS class names for widget customization" },
];

const app = express();

app.set("trust proxy", true);
app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/mcp", (_req, res) => {
  res.json({
    name: "cuprice-mcp",
    version: "1.0.0",
    description: "Cuprice MCP Server — public API tools for pricing widget integration",
    endpoint: "POST /mcp",
    tools: TOOLS_INFO,
    docs: "https://docs.cuprice.io/mcp",
  });
});

app.post("/mcp", async (req, res) => {
  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("MCP request error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.use(express.static(PUBLIC_DIR, { extensions: ["html"], maxAge: "1h" }));

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`cuprice-mcp listening on :${PORT}`);
  console.log(`  public dir: ${PUBLIC_DIR}`);
});
