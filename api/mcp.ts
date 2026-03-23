import type { VercelRequest, VercelResponse } from "@vercel/node";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const CUPRICE_BASE = process.env.CUPRICE_BASE || "https://cuprice.io";

async function cupriceAPI(path: string) {
  const res = await fetch(`${CUPRICE_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

function createServer(): McpServer {
  const server = new McpServer({ name: "cuprice", version: "1.0.0" });

  // ─── GET SHARED PROJECT (PUBLIC) ────────────────────────────────

  server.registerTool("get-pricing", {
    description: "Get public pricing data for a Cuprice project — plans, features, prices, and theme settings",
    inputSchema: {
      shareId: z.string().describe("The project's Share ID (e.g. 'nTZ7axXQHU')"),
    },
  }, async ({ shareId }) => {
    const data = await cupriceAPI(`/api/share/${shareId}`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  // ─── GET EMBED CODE ─────────────────────────────────────────────

  server.registerTool("get-embed-code", {
    description: "Get the embed code snippet to add a Cuprice pricing table to a website",
    inputSchema: {
      shareId: z.string().describe("The project's Share ID"),
      framework: z.enum(["html", "nextjs", "react"]).optional().describe("Target framework (default: html)"),
    },
  }, async ({ shareId, framework }) => {
    const base = CUPRICE_BASE;
    let code: string;
    if (framework === "nextjs") {
      code = `import Script from "next/script";

export default function Pricing() {
  return (
    <section>
      <div data-cuprice-id="${shareId}"></div>
      <Script src="${base}/embed.js" strategy="lazyOnload" />
    </section>
  );
}`;
    } else if (framework === "react") {
      code = `import { useEffect } from "react";

export default function Pricing() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "${base}/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return <div data-cuprice-id="${shareId}" />;
}`;
    } else {
      code = `<div data-cuprice-id="${shareId}"></div>
<script src="${base}/embed.js" async></script>`;
    }
    return { content: [{ type: "text" as const, text: code }] };
  });

  // ─── GET RECEIPT ────────────────────────────────────────────────

  server.registerTool("get-receipt", {
    description: "Get purchase details from a Stripe checkout session — plan name, features purchased, amount, customer info",
    inputSchema: {
      sessionId: z.string().describe("Stripe Checkout session ID (from the redirect URL)"),
      shareId: z.string().describe("The project's Share ID"),
    },
  }, async ({ sessionId, shareId }) => {
    const receipt = await cupriceAPI(`/api/stripe/receipt?session_id=${encodeURIComponent(sessionId)}&shareId=${shareId}`);
    return { content: [{ type: "text" as const, text: JSON.stringify(receipt, null, 2) }] };
  });

  // ─── GET CSS CLASS NAMES ────────────────────────────────────────

  server.registerTool("get-css-classes", {
    description: "Get all available CSS class names for customizing a Cuprice pricing widget",
    inputSchema: {},
  }, async () => {
    const classes = [
      { selector: ".cuprice-pricing-card", description: "Each plan card" },
      { selector: ".cuprice-pricing-button", description: "\"Choose Plan\" buttons" },
      { selector: ".cuprice-pricing-badge", description: "\"Most Popular\" badge" },
      { selector: ".cuprice-billing-toggle", description: "Monthly/Annual toggle" },
      { selector: ".cuprice-pricing-header", description: "Page title and description" },
      { selector: ".cuprice-custom-plan-card", description: "Custom plan card" },
      { selector: ".cuprice-custom-plan-button", description: "\"Create Now\" button" },
      { selector: ".cuprice-custom-plan-badge", description: "\"Custom\" badge" },
      { selector: ".cuprice-custom-plan-title", description: "Custom card title" },
      { selector: ".cuprice-custom-plan-feature-text", description: "Feature bullet text" },
    ];
    return { content: [{ type: "text" as const, text: JSON.stringify(classes, null, 2) }] };
  });

  return server;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.json({
      name: "cuprice-mcp",
      version: "1.0.0",
      description: "Cuprice MCP Server — public API tools for pricing widget integration",
      endpoint: "POST /mcp",
      tools: [
        { name: "get-pricing", description: "Get public pricing data (plans, features, theme) by Share ID" },
        { name: "get-embed-code", description: "Get embed snippet for HTML, Next.js, or React" },
        { name: "get-receipt", description: "Get Stripe purchase details from a checkout session" },
        { name: "get-css-classes", description: "Get CSS class names for widget customization" },
      ],
      docs: "https://docs.cuprice.io/mcp",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
