---
name: Cuprice MCP server
description: One surface of the Cuprice brand book v1.1, a docs reference that connects your AI tool before you finish reading it.
colors:
  green-900: "#033d26"
  green-800: "#055534"
  green-700: "#076c45"
  green-600: "#0a8f5c"
  green-500: "#12a86d"
  green-400: "#34c88a"
  green-300: "#6edaaa"
  green-200: "#a8eacc"
  green-100: "#d4f5e6"
  green-50: "#ecfaf2"
  neutral-900: "#151a17"
  neutral-800: "#252b28"
  neutral-700: "#3a4240"
  neutral-600: "#566058"
  neutral-300: "#c0c8c0"
  neutral-200: "#dce2dc"
  neutral-100: "#ecf0ec"
  bg-page: "#f0f4f1"
  bg-surface: "#ffffff"
  bg-elevated: "#f5f8f6"
  bg-muted: "#e4ebe6"
  bg-dark: "#0a0e0c"
  fg-1: "#0a0e0c"
  fg-2: "#252b28"
  fg-3: "#566058"
  fg-4: "#788078"
  fg-on-dark: "#f4f7f5"
  fg-on-dark-2: "rgba(244, 247, 245, 0.74)"
  fg-on-dark-3: "rgba(244, 247, 245, 0.58)"
  line-on-dark: "rgba(244, 247, 245, 0.09)"
  loss-on-dark: "#e8674f"
typography:
  display:
    fontFamily: "Degular Display, Degular, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(42px, 3.4vw + 14px, 64px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "0"
  headline:
    fontFamily: "Degular Display, Degular, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(30px, 1.6vw + 18px, 42px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0"
  lede:
    fontFamily: "Degular, Degular Display, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Degular, Degular Display, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Degular, Degular Display, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.35
  mono-display:
    fontFamily: "Degular Mono, SF Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "clamp(20px, 1.4vw + 12px, 30px)"
    fontWeight: 400
    lineHeight: 1.2
  mono-title:
    fontFamily: "Degular Mono, SF Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.3
  code:
    fontFamily: "Degular Mono, SF Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "28px"
  xl: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.green-700}"
    textColor: "{colors.bg-surface}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.green-800}"
  button-primary-lg:
    backgroundColor: "{colors.green-700}"
    textColor: "{colors.bg-surface}"
    rounded: "{rounded.lg}"
    padding: "12px 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-1}"
    rounded: "{rounded.lg}"
    padding: "7px 14px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.green-50}"
    textColor: "{colors.green-800}"
  button-on-green:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.green-800}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.lg}"
    padding: "28px"
  endpoint-card:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.xl}"
    padding: "18px 18px 18px 28px"
  code-block:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.fg-2}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
  tabs-track:
    backgroundColor: "{colors.bg-muted}"
    rounded: "{rounded.full}"
    padding: "4px"
  tab:
    textColor: "{colors.fg-3}"
    rounded: "{rounded.full}"
    padding: "9px 18px"
  tab-selected:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.fg-1}"
  chip:
    backgroundColor: "{colors.bg-muted}"
    textColor: "{colors.fg-2}"
    rounded: "{rounded.full}"
    padding: "4px 11px"
  toc-link-current:
    backgroundColor: "{colors.green-50}"
    textColor: "{colors.green-800}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  console:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.fg-on-dark}"
    rounded: "{rounded.2xl}"
    padding: "8px"
  console-pane:
    backgroundColor: "{colors.neutral-900}"
    rounded: "{rounded.lg}"
  console-input:
    backgroundColor: "{colors.neutral-900}"
    textColor: "{colors.fg-on-dark}"
    rounded: "{rounded.lg}"
    padding: "9px 14px"
    height: "42px"
  note:
    backgroundColor: "{colors.green-50}"
    textColor: "{colors.fg-2}"
    rounded: "{rounded.lg}"
    padding: "16px 20px"
---

# Design System: Cuprice MCP server

## Overview

**Creative North Star: "The Operator's Reference"**

This page is one surface of the Cuprice brand book v1.1 (https://cuprice-design-system-brand-book-v11.netlify.app/), not a new identity. Tokens mirror `app.cuprice.io/src/app/design-tokens.css` and the brand book, and the brand book's twelve hard rules (PRODUCT.md, Brand Commitments) bind every later surface here. The world is calm and exact: an off-white green page, white hairline cards, one green for every action, Degular Display at regular weight for headlines and Degular Mono wherever a value is something you would paste or count.

The page reads as a docs reference rather than a landing page. A sticky section index sits on the left. The main column puts the one thing you need, the server URL at display scale in mono with a single Copy action, inside the first viewport. Density is moderate. Cards are white on the green-tinted page, separated by a 1px neutral-200 hairline and a low green-black shadow. One dark instrument panel holds the live calls, and one green gradient card closes the page. Every other surface stays light.

Motion is small and has a purpose. Colour and shadow fade in 150ms on hover, tab panels fade in over 220ms, and the console has the page's one authored moment.

**Key Characteristics:**
- Green-tinted neutrals throughout; green is the only hue.
- Headlines in Degular Display 400 at tracking 0, never bold, never uppercase.
- Mono for URLs, tool names, parameters, numbers and code; body face for prose.
- White hairline cards at 16px radius; pills for segmented tabs and chips.
- One dark block (the live console) and one gradient block (the close) per page.
- One line-art scene, the brand's own asset, in the first viewport only.

## Colors

The palette is one green ramp on green-tinted neutrals. The page carries no second hue; red appears only as an error state.

### Primary
- **Cuprice Action Green** (green-700): every primary button fill, links, string tokens in light code, the current-state accent. Chosen over green-600 because white text on it reaches 6.48:1.
- **Deep Action Green** (green-800): hover for primary buttons and links, text on green-50 highlights (current TOC item, copied state).
- **Signal Green** (green-600): the 2px focus ring on light surfaces and the hover border of secondary buttons.
- **Mint Wash** (green-50): selected-index background, note callouts, step-number tiles, copied-state fill.
- **Bright Mint Ramp** (green-400, green-300, green-200): only inside the dark console. Green-400 is the focus ring and in-flight wire, green-300 colours strings and OK readouts, and green-200 colours numbers.
- **Deep Gradient** (`linear-gradient(135deg, green-900 0%, green-700 60%, green-600 100%)`, the brand's ai-gradient-deep): the closing card only.

### Neutral
- **Green Mist Page** (bg-page): the page background and the frosted top bar (88% opacity, 10px blur).
- **Surface White** (bg-surface): cards, tab panels, selected tab, endpoint card.
- **Elevated Wash** (bg-elevated): code blocks inside cards, copy pills, link-row hover.
- **Muted Sage** (bg-muted): the tab track, chips, inline code.
- **Ink** (fg-1): headlines, code keys, values. **Graphite** (fg-2): body text. **Moss Grey** (fg-3): ledes, labels, meta text, code punctuation. **Faint Moss** (fg-4): de-emphasised text only, never body copy.
- **Hairline** (neutral-200): every card border and table rule; neutral-100 divides rows inside a card; neutral-300 edges secondary buttons.
- **Instrument Black** (bg-dark) with **Pane Charcoal** (neutral-900): the console shell and its panes; neutral-700/800 for console borders and selected tool.

### Named Rules
**The Green Only Rule.** Green is the only hue. Status red (loss-on-dark on the console, error on light) appears only to report a failure.

**The One Ink, One Green Rule.** Syntax colouring uses ink plus one green. On light: keys fg-1, strings and flags green-700, punctuation and comments fg-3, numbers fg-1 at 500. On dark: keys fg-on-dark, strings green-300, numbers green-200, punctuation fg-on-dark-3. No rainbow themes.

**The Contrast-First Fill Rule.** Primary fills are green-700, never green-600. Green-600 is for rings and borders.

## Typography

**Display Font:** Degular Display (with Degular, then -apple-system / Segoe UI)
**Body Font:** Degular (with Degular Display, then -apple-system / Segoe UI)
**Label/Mono Font:** Degular Mono (with SF Mono, ui-monospace, Menlo, Consolas)

**Character:** A soft, open grotesque at regular weight carries the headlines. A matching mono carries every value a developer would paste or count. The page reads as calm, with no shouting.

The bundled Degular files are the demo cut (66 glyphs: letters, digits, space, comma, period). Other punctuation falls back per glyph: body text to -apple-system, mono to SF Mono / ui-monospace. This trade-off is accepted and shared with app.cuprice.io and cuprice.io, and the licensed files are an open item. Do not "fix" it by swapping faces.

### Hierarchy
- **Display** (400, clamp 42–64px, 1.04, max 14ch): the one page headline. 38–48px under 720px.
- **Headline** (400, clamp 30–42px, 1.1): section titles, sentence case. The close title uses the same face at clamp 32–50px, 1.06.
- **Lede** (19px, 1.55, max 54ch): hero lede. Section ledes are 17px, 1.6, fg-3, max 62ch.
- **Body** (16px, 1.62): prose. Tool descriptions run 16.5px at max 64ch, prompt rows 18px.
- **Label** (500, 13px): field labels, table heads, the "Server URL" label and the sidebar title. Sentence case, no tracking.
- **Mono display** (clamp 20–30px): the server URL, with the scheme in fg-3.
- **Mono title** (500, 21px): tool names in the reference.
- **Code** (14px, 1.7): code blocks. Console panes use 13.5px. Under 720px step code drops to 12px, and to 11px under 375px. Fact lines, chips and file names use 13px mono.

### Named Rules
**The Never Bold Display Rule.** Degular Display is set at 400 with letter-spacing 0. No bold headlines, no uppercase, no tracked eyebrow labels above them.

**The Mono Means Value Rule.** Mono is reserved for things that are literal: URLs, tool and parameter names, numbers, file paths, code. Prose never goes mono for style.

## Layout

A centred 1280px frame with 32px gutters holds a two-column grid: a 208px sticky section index and a main column capped at 880px, 72px apart (184px and 48px under 1120px). The sticky top bar is 68px tall (60px under 720px), and anchor scrolling is offset by its height plus 24px.

The hero is a grid of text plus a 236px scene column (200px under 1120px). The endpoint card and fact line span both columns under it. Sections are spaced 96px apart (72px under 720px). Inside cards the padding is 28px, and steps run on a 28px number column with a 16px gap.

**Responsive:**
- Under 980px the sidebar disappears and a compact strip of five links (Connect, Ask, Try it, Tools, Self-host) appears under the top bar as pill links. Console panes stack and the request pane caps at 220px.
- Under 720px the hero scene is hidden: the brand allows one 200–360px illustration per viewport, and here it would push Copy URL down. The endpoint card stacks with a full-width button. Tool tabs wrap inside a 20px-radius track. Step code blocks bleed to the full card width with square corners. Parameter tables turn into stacked rows, and close and run buttons go full width.
- Inline identifiers never break mid-token. Inline code is `nowrap`, and long paths carry `<wbr>` after each slash.

## Elevation & Depth

The system is a hybrid: hairline borders do most of the work, and low green-black shadows add a little lift. Shadows are tinted with the page's ink (rgba 10,14,12) and never go harsh or coloured.

### Shadow Vocabulary
- **Rest** (`0 1px 2px rgba(10,14,12,0.05)`): tab panels, tool cards, prompt list, link list, selected tab.
- **Raised** (`0 2px 6px -1px rgba(10,14,12,0.07), 0 4px 12px -2px rgba(10,14,12,0.05)`): the endpoint card, and the Run call button on hover.
- **Floating** (`0 4px 12px -2px rgba(10,14,12,0.08), 0 8px 24px -4px rgba(10,14,12,0.06)`): the dark console and the toast.

### Named Rules
**The One Dark Block Rule.** A page carries one dark surface, the live-call console. Everything else is light, except the single gradient close.

**The No Halo Rule.** No outer glows. In the console, state shows as an inset 1px green ring (rgba 52,200,138) and never as an outer glow.

**The Colour-or-Shadow Hover Rule.** Hover changes colour, background or shadow only. Nothing moves, scales or lifts on hover.

## Shapes

The radius scale is 8 / 12 / 16 / 20 / 24 / full.
- **16px** (lg): buttons, inputs, copy pills, cards, tab panels, notes and console panes. This is the owner's preference over the brand file's 8px for buttons and inputs.
- **12px** (md): code blocks, index links and console tool buttons.
- **20px** (xl): the endpoint card, plus the console and close card under 720px.
- **24px** (2xl): the console and the close card.
- **8px** (sm): step-number tiles and the focus outline on plain links.
- **Full pill**: segmented tab tracks and their tabs, chips, the compact page strip and the console's segmented control.

Borders are 1px hairlines. The system uses no left-border accent bars and no icons set in circles.

## Components

### Buttons
Buttons are calm and solid: one fill colour, a medium-weight label and an optional 17px stroke icon.
- **Shape:** gently rounded (16px), min height 42px (36px small, 48px large), font 500 15px.
- **Primary:** green-700 fill with white text. One per view does the main job: Copy URL, Add to Cursor, Run call.
- **Hover / Focus:** hover fills green-800. A 150ms colour transition uses ease-out (cubic-bezier(0.16, 1, 0.3, 1)). The focus ring is a 2px green-600 outline offset 2px; it is green-400 inside the console and white on the gradient card.
- **Secondary:** white, neutral-300 border and ink text. Hover turns it mint (green-50 fill, green-600 border, green-800 text).
- **Copied state:** the button stays in place, turns mint and swaps its icon to a check. A toast announces the copy.
- **On gradient:** a white button with green-800 text, beside a ghost button with a 55% white border.

### Chips
- **Style:** mono 13px, bg-muted pill, fg-2. They label which tool a prompt triggers.

### Cards / Containers
- **Corner Style:** 16px; the endpoint card uses 20px.
- **Background:** bg-surface on bg-page. Nested code blocks sit on bg-elevated.
- **Shadow Strategy:** Rest, except the endpoint card, which is Raised.
- **Border:** 1px neutral-200. Rows inside a card are divided by neutral-100.
- **Internal Padding:** 28px (20px / 18px under 720px).

### Code blocks
A figure with a 44px caption bar (13px mono file name in fg-3) and a ghost Copy button on the right. The body is 14px mono at 1.7 on bg-elevated, scrolls horizontally and never wraps.

### Inputs / Fields
These live inside the console only. They are neutral-900 with a neutral-700 border, 16px radius and 15px mono, and the caret is green-400. Focus adds a 2px green-400 outline and a green-500 border. Invalid fields take a loss-on-dark border with a 13.5px error line below.

### Navigation
- **Top bar:** sticky and frosted, with the logo lockup, a divider and the product name, plus text links and one small secondary button. Under 720px the text links hide.
- **Section index:** 15px fg-3 links. The current item is green-50 with green-800 text at 500. Sub-items are indented 22px, and tool names use mono.
- **Segmented tabs:** pill track on bg-muted. The selected tab is white with an ink label, Rest shadow and a 1px neutral-200 ring. Arrow keys move between tabs.

### Live console (signature)
A bg-dark shell (24px radius, 8px padding) holds a row of mono tool buttons; the selected one is neutral-800 with an inset green ring. Below sit an argument row and two neutral-900 panes, request and response, laid out 0.9fr / 1.1fr. The response bar carries a mono readout of status, time and size: OK in green-300, failures in loss-on-dark. The one authored moment works like this: while a call is in flight, a 2px green wire sweeps the bottom of the request pane (900ms, repeating) inside an inset ring, and when the answer lands, an inset ring fades from the response pane (900ms). Under reduced motion the wire is off.

### Endpoint card
The server URL is set in display-scale mono, with the scheme dimmed to fg-3 and Copy URL as the large primary button beside it. Under it runs a 13px mono line of real facts, each marked with a 5px green-500 dot.

### Note
A green-50 block at 16px radius with a 20px green-700 stroke info icon. It carries one fact the reader needs, such as where the Share ID comes from.

### Closing card
A ai-gradient-deep block at 24px radius with 56px padding. It holds a Degular Display title, white text, and a white plus ghost button pair. Only one per page, at the end.

## Do's and Don'ts

### Do:
- **Do** fill primary actions green-700 with white text and hover to green-800.
- **Do** use the 16px radius for buttons and inputs, and pills for segmented tabs and chips.
- **Do** set every literal value (URL, tool name, parameter, number, path) in Degular Mono.
- **Do** keep headlines Degular Display 400 at tracking 0, sentence case.
- **Do** separate surfaces with a 1px neutral-200 hairline plus the Rest shadow.
- **Do** use the brand's own illustration assets unedited (the hero scene is il_mcp_connection, including its shadow ellipse and filled star spot), one per viewport at 200–360px, hidden when it would push the primary action down.
- **Do** keep inline identifiers whole: `nowrap` plus `<wbr>` after slashes.
- **Do** show focus with a 2px ring: green-600 on light, green-400 on dark, white on the gradient.
- **Do** keep deprecated tools (get-receipt) off the page. Only the live tools/list readout may name it, labelled as deprecated.

### Don't:
- **Don't** use uppercase outside real acronyms (MCP, API, JSON), and don't put tracked eyebrow labels above headings.
- **Don't** bold Degular Display or switch the display face to a system font.
- **Don't** add a second hue, emoji, or icons from borrowed sets; use the Cuprice stroke set only (2px stroke, round caps).
- **Don't** add a second dark block or a second gradient card to a page.
- **Don't** use outer glows or halos, or hover effects that move, lift or scale.
- **Don't** use left-border accent cards or icon-in-circle grids.
- **Don't** show decorative data, invented Share IDs, usage numbers or customer pricing.
- **Don't** fill primary buttons with green-600; it fails white-text contrast.
