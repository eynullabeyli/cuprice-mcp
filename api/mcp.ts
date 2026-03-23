import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "../src/tools.js";

export async function POST(req: Request): Promise<Response> {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  await server.connect(transport);

  const body = await req.json();
  const response = await new Promise<Response>((resolve) => {
    const res = {
      statusCode: 200,
      headers: {} as Record<string, string>,
      body: "",
      writeHead(code: number, headers: Record<string, string>) {
        this.statusCode = code;
        this.headers = headers;
        return this;
      },
      end(data: string) {
        this.body = data;
        resolve(new Response(this.body, {
          status: this.statusCode,
          headers: this.headers,
        }));
      },
    };
    transport.handleRequest(req as any, res as any, body);
  });

  return response;
}

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify({
    name: "cuprice-mcp",
    version: "1.0.0",
    description: "Cuprice MCP Server — manage pricing projects from AI tools",
    tools: [
      "list-projects", "get-project", "get-shared-project", "create-project",
      "update-project", "add-feature", "create-plan", "add-feature-to-plan",
      "publish-project", "get-embed-code", "get-receipt",
    ],
  }), {
    headers: { "Content-Type": "application/json" },
  });
}
