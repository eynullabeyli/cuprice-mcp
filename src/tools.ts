import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const CUPRICE_BASE = process.env.CUPRICE_BASE || "http://localhost:3000";
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

export function createServer(): McpServer {
  const server = new McpServer({
    name: "cuprice",
    version: "1.0.0",
  });

  server.registerTool("list-projects", { description: "List all your Cuprice pricing projects", inputSchema: {} }, async () => {
    const projects = await cupriceAPI("/api/projects");
    if (Array.isArray(projects)) {
      const summary = projects.map((p: any) => ({ id: p.id, name: p.name, slug: p.slug, shareId: p.shareId, currency: p.currency, plans: p.pricingPlans?.length || 0, features: p.features?.length || 0 }));
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(projects, null, 2) }] };
  });

  server.registerTool("get-project", { description: "Get full details of a Cuprice project including plans, features, and theme", inputSchema: { slug: z.string().describe("Project slug or numeric ID") } }, async ({ slug }) => {
    const project = await cupriceAPI(`/api/projects/${slug}`);
    return { content: [{ type: "text", text: JSON.stringify(project, null, 2) }] };
  });

  server.registerTool("get-shared-project", { description: "Get public pricing data for a shared project (no auth needed)", inputSchema: { shareId: z.string().describe("The project's Share ID") } }, async ({ shareId }) => {
    const data = await cupriceAPI(`/api/share/${shareId}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("create-project", { description: "Create a new Cuprice pricing project", inputSchema: { name: z.string().describe("Project name"), description: z.string().optional().describe("Short description"), pricingPageDescription: z.string().optional().describe("Description shown on the pricing page"), currency: z.string().optional().describe("Currency code (default: USD)") } }, async ({ name, description, pricingPageDescription, currency }) => {
    const project = await cupriceAPI("/api/projects", { method: "POST", body: JSON.stringify({ name, description, pricingPageDescription, currency: currency || "USD" }) });
    return { content: [{ type: "text", text: JSON.stringify(project, null, 2) }] };
  });

  server.registerTool("update-project", { description: "Update a Cuprice project's settings", inputSchema: { slug: z.string().describe("Project slug or numeric ID"), name: z.string().optional(), description: z.string().optional(), pricingPageDescription: z.string().optional(), currency: z.string().optional(), annualDiscount: z.number().optional(), annualDiscountEnabled: z.boolean().optional(), checkoutSuccessUrl: z.string().optional(), checkoutCancelUrl: z.string().optional() } }, async ({ slug, ...data }) => {
    const project = await cupriceAPI(`/api/projects/${slug}`, { method: "PUT", body: JSON.stringify(data) });
    return { content: [{ type: "text", text: JSON.stringify(project, null, 2) }] };
  });

  server.registerTool("add-feature", { description: "Add a feature to a project's backlog", inputSchema: { projectId: z.number().describe("Project ID"), name: z.string().describe("Feature name"), description: z.string().optional(), featureType: z.enum(["Standart", "Limits", "Usage Based"]).optional(), basePrice: z.number().optional(), isCountable: z.boolean().optional(), usageCount: z.number().optional(), condition: z.string().optional(), countPrice: z.number().optional() } }, async ({ projectId, ...data }) => {
    const feature = await cupriceAPI(`/api/projects/${projectId}/backlog`, { method: "POST", body: JSON.stringify(data) });
    return { content: [{ type: "text", text: JSON.stringify(feature, null, 2) }] };
  });

  server.registerTool("create-plan", { description: "Create a new pricing plan in a project", inputSchema: { projectId: z.number().describe("Project ID"), name: z.string().describe("Plan name"), description: z.string().optional(), order: z.number().optional(), isPopular: z.boolean().optional() } }, async ({ projectId, ...data }) => {
    const plan = await cupriceAPI(`/api/projects/${projectId}/plans`, { method: "POST", body: JSON.stringify(data) });
    return { content: [{ type: "text", text: JSON.stringify(plan, null, 2) }] };
  });

  server.registerTool("add-feature-to-plan", { description: "Add a feature from the backlog to a pricing plan", inputSchema: { projectId: z.number().describe("Project ID"), featureId: z.number().describe("Feature ID"), planId: z.number().describe("Plan ID") } }, async ({ projectId, featureId, planId }) => {
    const result = await cupriceAPI(`/api/projects/${projectId}/backlog/${featureId}/move`, { method: "POST", body: JSON.stringify({ planId }) });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  server.registerTool("publish-project", { description: "Publish a project to get a Share ID for embedding", inputSchema: { projectId: z.number().describe("Project ID") } }, async ({ projectId }) => {
    const result = await cupriceAPI(`/api/projects/${projectId}/publish`, { method: "POST", body: JSON.stringify({ regenerate: false }) });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  server.registerTool("get-embed-code", { description: "Get the HTML embed snippet for a published project", inputSchema: { shareId: z.string().describe("Share ID"), framework: z.enum(["html", "nextjs", "react"]).optional() } }, async ({ shareId, framework }) => {
    const base = CUPRICE_BASE;
    let code: string;
    if (framework === "nextjs") {
      code = `import Script from "next/script";\n\nexport default function Pricing() {\n  return (\n    <section>\n      <div data-cuprice-id="${shareId}"></div>\n      <Script src="${base}/embed.js" strategy="lazyOnload" />\n    </section>\n  );\n}`;
    } else if (framework === "react") {
      code = `import { useEffect } from "react";\n\nexport default function Pricing() {\n  useEffect(() => {\n    const s = document.createElement("script");\n    s.src = "${base}/embed.js";\n    s.async = true;\n    document.body.appendChild(s);\n    return () => { document.body.removeChild(s); };\n  }, []);\n\n  return <div data-cuprice-id="${shareId}" />;\n}`;
    } else {
      code = `<div data-cuprice-id="${shareId}"></div>\n<script src="${base}/embed.js" async></script>`;
    }
    return { content: [{ type: "text", text: code }] };
  });

  server.registerTool("get-receipt", { description: "Get purchase details from a Stripe checkout session", inputSchema: { sessionId: z.string().describe("Stripe session ID"), shareId: z.string().describe("Share ID") } }, async ({ sessionId, shareId }) => {
    const receipt = await cupriceAPI(`/api/stripe/receipt?session_id=${encodeURIComponent(sessionId)}&shareId=${shareId}`);
    return { content: [{ type: "text", text: JSON.stringify(receipt, null, 2) }] };
  });

  return server;
}
