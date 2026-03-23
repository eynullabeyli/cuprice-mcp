import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const CUPRICE_BASE = process.env.CUPRICE_BASE || "http://localhost:3000";
const AUTH_TOKEN = process.env.CUPRICE_AUTH_TOKEN || "";
const server = new McpServer({
    name: "cuprice",
    version: "1.0.0",
});
// Helper to make authenticated API calls
async function cupriceAPI(path, options) {
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
// ─── LIST PROJECTS ──────────────────────────────────────────────
server.registerTool("list-projects", {
    description: "List all your Cuprice pricing projects",
    inputSchema: {},
}, async () => {
    const projects = await cupriceAPI("/api/projects");
    if (Array.isArray(projects)) {
        const summary = projects.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            shareId: p.shareId,
            currency: p.currency,
            plans: p.pricingPlans?.length || 0,
            features: p.features?.length || 0,
        }));
        return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(projects, null, 2) }] };
});
// ─── GET PROJECT ────────────────────────────────────────────────
server.registerTool("get-project", {
    description: "Get full details of a Cuprice project including plans, features, and theme",
    inputSchema: {
        slug: z.string().describe("Project slug or numeric ID"),
    },
}, async ({ slug }) => {
    const project = await cupriceAPI(`/api/projects/${slug}`);
    return { content: [{ type: "text", text: JSON.stringify(project, null, 2) }] };
});
// ─── GET SHARED PROJECT (PUBLIC) ────────────────────────────────
server.registerTool("get-shared-project", {
    description: "Get public pricing data for a shared project (no auth needed)",
    inputSchema: {
        shareId: z.string().describe("The project's Share ID"),
    },
}, async ({ shareId }) => {
    const data = await cupriceAPI(`/api/share/${shareId}`);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
});
// ─── CREATE PROJECT ─────────────────────────────────────────────
server.registerTool("create-project", {
    description: "Create a new Cuprice pricing project",
    inputSchema: {
        name: z.string().describe("Project name"),
        description: z.string().optional().describe("Short description"),
        pricingPageDescription: z.string().optional().describe("Description shown on the pricing page"),
        currency: z.string().optional().describe("Currency code (default: USD)"),
    },
}, async ({ name, description, pricingPageDescription, currency }) => {
    const project = await cupriceAPI("/api/projects", {
        method: "POST",
        body: JSON.stringify({ name, description, pricingPageDescription, currency: currency || "USD" }),
    });
    return { content: [{ type: "text", text: JSON.stringify(project, null, 2) }] };
});
// ─── UPDATE PROJECT ─────────────────────────────────────────────
server.registerTool("update-project", {
    description: "Update a Cuprice project's settings (name, description, theme, discount, etc.)",
    inputSchema: {
        slug: z.string().describe("Project slug or numeric ID"),
        name: z.string().optional().describe("New project name"),
        description: z.string().optional().describe("New description"),
        pricingPageDescription: z.string().optional().describe("New pricing page description"),
        currency: z.string().optional().describe("Currency code"),
        annualDiscount: z.number().optional().describe("Annual discount (0.2 = 20%)"),
        annualDiscountEnabled: z.boolean().optional().describe("Enable annual billing toggle"),
        checkoutSuccessUrl: z.string().optional().describe("Redirect URL after successful payment"),
        checkoutCancelUrl: z.string().optional().describe("Redirect URL after cancelled payment"),
    },
}, async ({ slug, ...data }) => {
    const project = await cupriceAPI(`/api/projects/${slug}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    return { content: [{ type: "text", text: JSON.stringify(project, null, 2) }] };
});
// ─── ADD FEATURE ────────────────────────────────────────────────
server.registerTool("add-feature", {
    description: "Add a feature to a project's backlog",
    inputSchema: {
        projectId: z.number().describe("Project ID"),
        name: z.string().describe("Feature name"),
        description: z.string().optional().describe("Feature description"),
        featureType: z.enum(["Standart", "Limits", "Usage Based"]).optional().describe("Feature type (default: Standart)"),
        basePrice: z.number().optional().describe("Base price"),
        isCountable: z.boolean().optional().describe("Is this a countable feature"),
        usageCount: z.number().optional().describe("Usage count for Limits type"),
        condition: z.string().optional().describe("Condition for Limits type (e.g. '1-100')"),
        countPrice: z.number().optional().describe("Price per unit for countable features"),
    },
}, async ({ projectId, ...data }) => {
    const feature = await cupriceAPI(`/api/projects/${projectId}/backlog`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return { content: [{ type: "text", text: JSON.stringify(feature, null, 2) }] };
});
// ─── CREATE PLAN ────────────────────────────────────────────────
server.registerTool("create-plan", {
    description: "Create a new pricing plan in a project",
    inputSchema: {
        projectId: z.number().describe("Project ID"),
        name: z.string().describe("Plan name (e.g. 'Pro')"),
        description: z.string().optional().describe("Plan description"),
        order: z.number().optional().describe("Display order (0-based)"),
        isPopular: z.boolean().optional().describe("Show 'Most Popular' badge"),
    },
}, async ({ projectId, ...data }) => {
    const plan = await cupriceAPI(`/api/projects/${projectId}/plans`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return { content: [{ type: "text", text: JSON.stringify(plan, null, 2) }] };
});
// ─── ADD FEATURE TO PLAN ────────────────────────────────────────
server.registerTool("add-feature-to-plan", {
    description: "Add a feature from the backlog to a pricing plan",
    inputSchema: {
        projectId: z.number().describe("Project ID"),
        featureId: z.number().describe("Feature ID to add"),
        planId: z.number().describe("Plan ID to add the feature to"),
    },
}, async ({ projectId, featureId, planId }) => {
    const result = await cupriceAPI(`/api/projects/${projectId}/backlog/${featureId}/move`, {
        method: "POST",
        body: JSON.stringify({ planId }),
    });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});
// ─── PUBLISH PROJECT ────────────────────────────────────────────
server.registerTool("publish-project", {
    description: "Publish a project to get a Share ID for embedding",
    inputSchema: {
        projectId: z.number().describe("Project ID"),
    },
}, async ({ projectId }) => {
    const result = await cupriceAPI(`/api/projects/${projectId}/publish`, {
        method: "POST",
        body: JSON.stringify({ regenerate: false }),
    });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});
// ─── GET EMBED CODE ─────────────────────────────────────────────
server.registerTool("get-embed-code", {
    description: "Get the HTML embed snippet for a published project",
    inputSchema: {
        shareId: z.string().describe("The project's Share ID"),
        framework: z.enum(["html", "nextjs", "react"]).optional().describe("Framework (default: html)"),
    },
}, async ({ shareId, framework }) => {
    const base = CUPRICE_BASE;
    let code;
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
    }
    else if (framework === "react") {
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
    }
    else {
        code = `<div data-cuprice-id="${shareId}"></div>
<script src="${base}/embed.js" async></script>`;
    }
    return { content: [{ type: "text", text: code }] };
});
// ─── GET RECEIPT ────────────────────────────────────────────────
server.registerTool("get-receipt", {
    description: "Get purchase details from a Stripe checkout session",
    inputSchema: {
        sessionId: z.string().describe("Stripe Checkout session ID"),
        shareId: z.string().describe("Project Share ID"),
    },
}, async ({ sessionId, shareId }) => {
    const receipt = await cupriceAPI(`/api/stripe/receipt?session_id=${encodeURIComponent(sessionId)}&shareId=${shareId}`);
    return { content: [{ type: "text", text: JSON.stringify(receipt, null, 2) }] };
});
// ─── CONNECT ────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
//# sourceMappingURL=index.js.map