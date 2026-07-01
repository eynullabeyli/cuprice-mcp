import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// The public API, the receipt endpoint, and embed.js all live on the app host.
const CUPRICE_BASE = process.env.CUPRICE_BASE || "https://app.cuprice.io";

type ToolResult = {
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

/** Fetch JSON from the Cuprice public API with clear errors on failure. */
async function cupriceAPI(path: string): Promise<unknown> {
  const res = await fetch(`${CUPRICE_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Cuprice API ${res.status} for ${path}${body ? `: ${body.slice(0, 200)}` : ""}`);
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`Cuprice API returned invalid JSON for ${path}`);
  }
}

function jsonResult(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function errorResult(err: unknown): ToolResult {
  const message = err instanceof Error ? err.message : String(err);
  return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
}

export function createServer(): McpServer {
  const server = new McpServer({ name: "cuprice", version: "1.0.0" });

  server.registerTool("get-pricing", {
    description: "Get public pricing data for a Cuprice project — plans, features, prices, and theme settings",
    inputSchema: { shareId: z.string().describe("The project's Share ID") },
  }, async ({ shareId }) => {
    try {
      const data = await cupriceAPI(`/api/share/${encodeURIComponent(shareId)}`);
      return jsonResult(data);
    } catch (err) {
      return errorResult(err);
    }
  });

  server.registerTool("get-embed-code", {
    description: "Get embed code for Cuprice pricing table or billing widget. Supports HTML, React, Next.js, and Vue.",
    inputSchema: {
      shareId: z.string().describe("The project's Share ID"),
      framework: z.enum(["html", "nextjs", "react", "vue"]).optional().describe("Target framework (default: html)"),
      widget: z.enum(["pricing", "billing"]).optional().describe("Widget type: pricing (default) or billing"),
    },
  }, async ({ shareId, framework, widget }) => {
    const base = CUPRICE_BASE;
    const attr = widget === "billing" ? "data-cuprice-billing" : "data-cuprice-id";
    const componentName = widget === "billing" ? "Billing" : "Pricing";
    let code: string;

    if (framework === "nextjs") {
      code = `import Script from "next/script";\n\nexport default function ${componentName}() {\n  return (\n    <section>\n      <div ${attr}="${shareId}"></div>\n      <Script src="${base}/embed.js" strategy="lazyOnload" />\n    </section>\n  );\n}`;
    } else if (framework === "react") {
      code = `import { useEffect } from "react";\n\nexport default function ${componentName}() {\n  useEffect(() => {\n    const s = document.createElement("script");\n    s.src = "${base}/embed.js";\n    s.async = true;\n    document.body.appendChild(s);\n    return () => {\n      document.body.removeChild(s);\n      if (window.Cuprice) window.Cuprice.destroy();\n    };\n  }, []);\n\n  return <div ${attr}="${shareId}" />;\n}`;
    } else if (framework === "vue") {
      code = `<template>\n  <div ${attr}="${shareId}"></div>\n</template>\n\n<script setup>\nimport { onMounted, onUnmounted } from "vue";\n\nlet script;\nonMounted(() => {\n  script = document.createElement("script");\n  script.src = "${base}/embed.js";\n  script.async = true;\n  document.body.appendChild(script);\n});\nonUnmounted(() => {\n  if (script) document.body.removeChild(script);\n  if (window.Cuprice) window.Cuprice.destroy();\n});\n</script>`;
    } else {
      code = `<!-- ${componentName} widget -->\n<div ${attr}="${shareId}"></div>\n<script src="${base}/embed.js" async></script>`;
    }

    if (widget === "billing") {
      code += `\n\n/* Listen for plan selection events */\ndocument.addEventListener("cuprice:plan-selected", function(e) {\n  console.log("Plan selected:", e.detail);\n  // e.detail = { planId, planName, billingInterval, shareId }\n});`;
    }

    return { content: [{ type: "text", text: code }] };
  });

  server.registerTool("get-receipt", {
    description: "Get purchase details from a Stripe checkout session — plan name, features purchased, amount, customer info",
    inputSchema: {
      sessionId: z.string().describe("Stripe Checkout session ID"),
      shareId: z.string().describe("The project's Share ID"),
    },
  }, async ({ sessionId, shareId }) => {
    try {
      const receipt = await cupriceAPI(
        `/api/stripe/receipt?session_id=${encodeURIComponent(sessionId)}&shareId=${encodeURIComponent(shareId)}`,
      );
      return jsonResult(receipt);
    } catch (err) {
      return errorResult(err);
    }
  });

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
      { selector: ".cuprice-custom-plan-feature-icon", description: "Feature checkmark icon" },
      { selector: ".cuprice-comparison-table", description: "Feature comparison table container" },
      { selector: ".cuprice-powered-by", description: "Powered by Cuprice footer" },
    ];
    return jsonResult(classes);
  });

  return server;
}
