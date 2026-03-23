import type { VercelRequest, VercelResponse } from "@vercel/node";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const CUPRICE_BASE = process.env.CUPRICE_BASE || "https://cuprice.io";
const AUTH_TOKEN = process.env.CUPRICE_AUTH_TOKEN || "";

async function cupriceAPI(path: string, options?: RequestInit) {
  const res = await fetch(`${CUPRICE_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(AUTH_TOKEN ? { Cookie: `next-auth.session-token=${AUTH_TOKEN}` } : {}),
      ...options?.headers,
    },
  });
  return res.json();
}

function createServer(): McpServer {
  const server = new McpServer({ name: "cuprice", version: "1.0.0" });

  server.registerTool("list-projects", { description: "List all Cuprice pricing projects", inputSchema: {} }, async () => {
    const projects = await cupriceAPI("/api/projects");
    if (Array.isArray(projects)) {
      const summary = projects.map((p: any) => ({ id: p.id, name: p.name, slug: p.slug, shareId: p.shareId, currency: p.currency, plans: p.pricingPlans?.length || 0, features: p.features?.length || 0 }));
      return { content: [{ type: "text" as const, text: JSON.stringify(summary, null, 2) }] };
    }
    return { content: [{ type: "text" as const, text: JSON.stringify(projects, null, 2) }] };
  });

  server.registerTool("get-project", { description: "Get full project details", inputSchema: { slug: z.string() } }, async ({ slug }) => {
    return { content: [{ type: "text" as const, text: JSON.stringify(await cupriceAPI(`/api/projects/${slug}`), null, 2) }] };
  });

  server.registerTool("get-shared-project", { description: "Get public pricing data by Share ID", inputSchema: { shareId: z.string() } }, async ({ shareId }) => {
    return { content: [{ type: "text" as const, text: JSON.stringify(await cupriceAPI(`/api/share/${shareId}`), null, 2) }] };
  });

  server.registerTool("create-project", { description: "Create a new project", inputSchema: { name: z.string(), description: z.string().optional(), pricingPageDescription: z.string().optional(), currency: z.string().optional() } }, async ({ name, description, pricingPageDescription, currency }) => {
    return { content: [{ type: "text" as const, text: JSON.stringify(await cupriceAPI("/api/projects", { method: "POST", body: JSON.stringify({ name, description, pricingPageDescription, currency: currency || "USD" }) }), null, 2) }] };
  });

  server.registerTool("update-project", { description: "Update project settings", inputSchema: { slug: z.string(), name: z.string().optional(), description: z.string().optional(), pricingPageDescription: z.string().optional(), currency: z.string().optional(), annualDiscount: z.number().optional(), annualDiscountEnabled: z.boolean().optional(), checkoutSuccessUrl: z.string().optional(), checkoutCancelUrl: z.string().optional() } }, async ({ slug, ...data }) => {
    return { content: [{ type: "text" as const, text: JSON.stringify(await cupriceAPI(`/api/projects/${slug}`, { method: "PUT", body: JSON.stringify(data) }), null, 2) }] };
  });

  server.registerTool("add-feature", { description: "Add a feature to a project's backlog", inputSchema: { projectId: z.number(), name: z.string(), description: z.string().optional(), featureType: z.enum(["Standart", "Limits", "Usage Based"]).optional(), basePrice: z.number().optional(), isCountable: z.boolean().optional() } }, async ({ projectId, ...data }) => {
    return { content: [{ type: "text" as const, text: JSON.stringify(await cupriceAPI(`/api/projects/${projectId}/backlog`, { method: "POST", body: JSON.stringify(data) }), null, 2) }] };
  });

  server.registerTool("create-plan", { description: "Create a pricing plan", inputSchema: { projectId: z.number(), name: z.string(), description: z.string().optional(), order: z.number().optional(), isPopular: z.boolean().optional() } }, async ({ projectId, ...data }) => {
    return { content: [{ type: "text" as const, text: JSON.stringify(await cupriceAPI(`/api/projects/${projectId}/plans`, { method: "POST", body: JSON.stringify(data) }), null, 2) }] };
  });

  server.registerTool("add-feature-to-plan", { description: "Add a feature to a plan", inputSchema: { projectId: z.number(), featureId: z.number(), planId: z.number() } }, async ({ projectId, featureId, planId }) => {
    return { content: [{ type: "text" as const, text: JSON.stringify(await cupriceAPI(`/api/projects/${projectId}/backlog/${featureId}/move`, { method: "POST", body: JSON.stringify({ planId }) }), null, 2) }] };
  });

  server.registerTool("publish-project", { description: "Publish a project to get a Share ID", inputSchema: { projectId: z.number() } }, async ({ projectId }) => {
    return { content: [{ type: "text" as const, text: JSON.stringify(await cupriceAPI(`/api/projects/${projectId}/publish`, { method: "POST", body: JSON.stringify({ regenerate: false }) }), null, 2) }] };
  });

  server.registerTool("get-embed-code", { description: "Get embed snippet", inputSchema: { shareId: z.string(), framework: z.enum(["html", "nextjs", "react"]).optional() } }, async ({ shareId, framework }) => {
    const base = CUPRICE_BASE;
    let code: string;
    if (framework === "nextjs") code = `import Script from "next/script";\n\nexport default function Pricing() {\n  return (\n    <section>\n      <div data-cuprice-id="${shareId}"></div>\n      <Script src="${base}/embed.js" strategy="lazyOnload" />\n    </section>\n  );\n}`;
    else if (framework === "react") code = `import { useEffect } from "react";\n\nexport default function Pricing() {\n  useEffect(() => {\n    const s = document.createElement("script");\n    s.src = "${base}/embed.js";\n    s.async = true;\n    document.body.appendChild(s);\n    return () => { document.body.removeChild(s); };\n  }, []);\n  return <div data-cuprice-id="${shareId}" />;\n}`;
    else code = `<div data-cuprice-id="${shareId}"></div>\n<script src="${base}/embed.js" async></script>`;
    return { content: [{ type: "text" as const, text: code }] };
  });

  server.registerTool("get-receipt", { description: "Get Stripe purchase details", inputSchema: { sessionId: z.string(), shareId: z.string() } }, async ({ sessionId, shareId }) => {
    return { content: [{ type: "text" as const, text: JSON.stringify(await cupriceAPI(`/api/stripe/receipt?session_id=${encodeURIComponent(sessionId)}&shareId=${shareId}`), null, 2) }] };
  });

  return server;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.json({
      name: "cuprice-mcp",
      version: "1.0.0",
      description: "Cuprice MCP Server — manage pricing projects from AI tools",
      endpoint: "POST /mcp",
      usage: "MCP protocol uses POST for JSON-RPC tool calls. GET returns this info.",
      tools: [
        { name: "list-projects", description: "List all Cuprice pricing projects" },
        { name: "get-project", description: "Get full project details" },
        { name: "get-shared-project", description: "Get public pricing data by Share ID" },
        { name: "create-project", description: "Create a new project" },
        { name: "update-project", description: "Update project settings" },
        { name: "add-feature", description: "Add a feature to a project's backlog" },
        { name: "create-plan", description: "Create a pricing plan" },
        { name: "add-feature-to-plan", description: "Add a feature to a plan" },
        { name: "publish-project", description: "Publish a project to get a Share ID" },
        { name: "get-embed-code", description: "Get embed snippet (HTML/Next.js/React)" },
        { name: "get-receipt", description: "Get Stripe purchase details" },
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
