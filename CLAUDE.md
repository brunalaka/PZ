# Flix Prototyper

## Before starting any session

Read both reference files in full before doing any work:
- ./docs/honeycomb-design-system-reference.md
- ./docs/honeycomb-ux-guidelines.md

These are authoritative. Do not rely on prior knowledge of Honeycomb. Every component and token decision must be grounded in these files.

## Project setup

This is a React + Vite project using:
- `@flixbus/honeycomb-react` v17 — React components
- `@flixbus/honeycomb` — CSS and design tokens
- `@flixbus/honeycomb-icons-react` — Icons via `Icon` wrapper with `InlineIcon` prop
- `@flixbus/honeycomb-mcp-server` — Honeycomb MCP server (configured in `.mcp.json`)

`ThemeWrapper theme="flix"` and font CSS are already configured in `App.tsx`. New prototype components only need to import what they use.

## MCP tools

Use Honeycomb MCP tools before writing any component or token code:
- `honeycomb_search` — find components by name or description
- `honeycomb_lookup` — get full props and correct import path
- `honeycomb_search_tokens` — find the right design token by intent

## Prototyping

Invoke the `/flix-prototyper` skill whenever building a new prototype screen or flow.
