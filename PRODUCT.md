# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers and technical founders who already have a pricing page in Cuprice and want it inside their own site. They work in an AI coding tool (Cursor, Claude Code, Claude Desktop, VS Code, Windsurf) and want that tool to fetch their plans, write the embed code for their framework and style the widget, without copying values from the dashboard by hand. A second reader is the AI tool itself, which reads `llms.txt` and `llms-full.txt`.

## Product Purpose

mcp.cuprice.io is Cuprice's public MCP (Model Context Protocol) server. One URL, `https://mcp.cuprice.io/mcp`, gives an AI tool three working tools over the public Cuprice API. The landing page at `/` exists so a developer can connect their tool in under a minute and see what the tools return before they do. Success: the visitor copies the config for their tool, or runs a tool on the page and sees a real answer.

## Positioning

The pricing page a founder built in Cuprice reaches their codebase through their own AI assistant: the assistant reads the live plans by Share ID and writes the embed for the framework it is already working in. No API key is needed for the public tools; they only read what the published page already shows.

## Operating Context

- Transport: Streamable HTTP, stateless. `POST /mcp` takes JSON-RPC and answers as `text/event-stream` (`event: message` + `data: {...}`); `tools/list` and `tools/call` work without an `initialize` round. `GET /mcp` returns a JSON summary; `GET /healthz` returns `{status: "ok"}`.
- Self-host: `npm run build && npm start` (HTTP on `:5000`), `npm run start:stdio` for stdio. Docker compose on the Cuprice Azure VM serves production behind nginx.
- Open source: GitHub `eynullabeyli/cuprice-mcp` (public, MIT).
- Docs: `https://docs.cuprice.io` (the docs site's `/mcp` path is its own docs-search MCP server, so it shows JSON in a browser, not a page); machine-readable `/llms.txt` and `/llms-full.txt` on this host.
- The Share ID comes from publishing a project in Cuprice (`/share/<shareId>` link; `POST /api/v1/projects/{slug}/publish` returns it).

## Capabilities and Constraints

- `get-pricing` (`shareId`): plans, features, prices and theme from `GET {CUPRICE_BASE}/api/share/{shareId}`. An unknown ID returns a real 404 error inside the tool result.
- `get-embed-code` (`shareId`, `framework` html | nextjs | react | vue, `widget` pricing | billing): a snippet built locally that loads `https://app.cuprice.io/embed.js`. Works for any string.
- `get-css-classes` (no input): 13 `.cuprice-*` selectors for styling the widget.
- `get-receipt` is deprecated (Stripe checkout was removed). It stays on the server so existing setups do not break, and it is not shown on the landing page.
- The public tools are read-only. Creating or editing projects, plans and features is the authenticated REST API v1 (`Authorization: Bearer cpk_...`), not this MCP server.
- The page is plain static HTML/CSS/JS in `public/`, served by Express. No build step for the page.
- The live page carries Google Tag Manager `GTM-NF36H66K`, a favicon and `logo.png` social image; keep them.

## Brand Commitments

Cuprice brand book v1.1 (October 2026, https://cuprice-design-system-brand-book-v11.netlify.app/), chosen by Yusif for this page on 2026-10-23. Its twelve hard rules bind: no uppercase outside real acronyms (MCP, API, JSON), no tracked eyebrow labels, Degular only (Display for headlines at tracking 0 and never bold, Degular for UI, Degular Mono for numbers and code), green only, no emoji or borrowed icon sets (Cuprice stroke set only), never redraw the star mark, no left-border cards or icon-in-circle grids, no decorative data, hover changes colour or shadow only, sentence case and verbs first with no hype words, no stock/3D/meshes/textures, layout must hold. Voice: a sharp, calm operator; address the reader as "you".

The bundled Degular files are the demo cut (66 glyphs, no punctuation); missing glyphs fall back per glyph, the same accepted trade-off as app.cuprice.io and cuprice.io.

## Evidence on Hand

- Real tool schemas and outputs from the live server (`tools/list`, `tools/call`).
- Logo lockup and star SVGs: `app.cuprice.io/public/brand/`. DS stroke icons: `app.cuprice.io/src/app/components/icons/ds-icons.tsx`.
- No public demo Share ID exists (the old sample `nTZ7axXQHU` was removed); never invent one or show a customer's pricing. No usage numbers, customer logos or testimonials exist; never fabricate them.

## Product Principles

1. Connect first: the config for the visitor's tool is one click away from the first screen.
2. Show the real thing: every example on the page is what the server actually returns.
3. Claim only the three public tools; point anything else to the REST API docs.
4. The page serves two readers, the developer and their AI tool, so the plain-text references stay linked and current.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast 4.5:1, control edges 3:1, visible green-600 focus ring on every control, full keyboard use of tabs and the playground, `prefers-reduced-motion` honoured.
