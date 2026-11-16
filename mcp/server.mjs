#!/usr/bin/env node
// tinilib MCP server — lets Claude, ChatGPT, Cursor and other MCP clients search your library.
//
//   node server.mjs                      stdio (Claude Desktop, Claude Code, Cursor)
//   node server.mjs --http 3333          Streamable HTTP at http://localhost:3333/mcp (ChatGPT, remote clients)
//
// Library source (first match wins):
//   TINILIB_SOURCE=/path/to/library.json   or   TINILIB_SOURCE=https://raw.githubusercontent.com/you/repo/main/library.json
//   otherwise ../library.json next to this folder.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { z } from "zod";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = process.env.TINILIB_SOURCE || join(here, "..", "library.json");
let BR = [];
const brOf = (i) => BR.find((b) => b.id === i.cat) || BR.find((b) => b.id === "other") || BR.at(-1) || { id: "other", name: "Other" };

// Re-read on every call (cheap) so edits to library.json show up without a restart.
async function load() {
  const raw = /^https?:\/\//.test(SOURCE)
    ? await (await fetch(SOURCE, { cache: "no-store" })).text()
    : await readFile(SOURCE, "utf8");
  const lib = JSON.parse(raw);
  BR = (!Array.isArray(lib) && lib.branches?.length) ? lib.branches : [{ id: "web", name: "Web dev" }, { id: "mkt", name: "Marketing" }, { id: "other", name: "Other" }];
  return Array.isArray(lib) ? lib : lib.items || [];
}

const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
function score(item, q) {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return 1;
  const fields = [
    [item.name, 5], [item.group, 3], [item.desc, 2], [item.when, 2],
    [(item.points || []).join(" "), 1], [(item.topics || []).join(" "), 2], [brOf(item).name, 1],
  ].map(([v, w]) => [norm(v), w]);
  let s = 0;
  for (const w of words) for (const [v, wt] of fields) if (v.includes(w)) s += wt;
  return s;
}
function asText(i) {
  return [
    `${i.name} (${i.type || "repo"}) — ${brOf(i).name} / ${i.group || "—"}`,
    i.url && `URL: ${i.url}`,
    i.desc && `What: ${i.desc}`,
    i.when && `When: ${i.when}`,
    i.install && `Install: ${i.install}`,
    ...(i.points || []).map((p) => `- ${p}`),
    i.prompt && `Example request: ${i.prompt}`,
    i.body && `\n--- Skill instructions (follow these to perform the skill) ---\n${i.body}`,
  ].filter(Boolean).join("\n");
}
const json = (o) => ({ content: [{ type: "text", text: JSON.stringify(o, null, 2) }] });

function build() {
  const server = new McpServer({ name: "tinilib", version: "0.1.0" });

  // `search` + `fetch` follow the shape ChatGPT connectors / deep research expect.
  server.registerTool("search", {
    title: "Search the tool library",
    description: "Search the user's saved GitHub repos, AI skills and tools, organized by field of work. Use this before building something from scratch, to find a tool the user already keeps for the job. Returns matching items with id, title, url and a short summary.",
    inputSchema: { query: z.string().describe("What the user wants to do or the tool name, e.g. 'landing page', 'video subtitles', 'graphify'") },
  }, async ({ query }) => {
    const items = await load();
    const results = items.map((i) => [score(i, query), i]).filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0]).slice(0, 10)
      .map(([, i]) => ({ id: i.id, title: i.name, url: i.url || "", text: [i.desc, i.when && `When: ${i.when}`].filter(Boolean).join(" ") }));
    return json({ results });
  });

  server.registerTool("fetch", {
    title: "Get one library item",
    description: "Get the full entry for one item from the tool library by its id (from search): description, key points, when to use it, install command, an example request, and for skills the full skill instructions you can follow.",
    inputSchema: { id: z.string().describe("Item id from search, or the repo name like owner/repo") },
  }, async ({ id }) => {
    const items = await load();
    const i = items.find((x) => x.id === id || x.name === id);
    if (!i) return { isError: true, content: [{ type: "text", text: `No item with id "${id}". Use search first.` }] };
    return json({ id: i.id, title: i.name, url: i.url || "", text: asText(i), metadata: { branch: brOf(i).name, group: i.group, type: i.type || "repo" } });
  });

  server.registerTool("list_library", {
    title: "List the whole library",
    description: "List every item in the tool library grouped by branch (field of work) and group. Use when the user asks what tools they have.",
    inputSchema: { branch: z.string().optional().describe("Limit to one branch id or name; omit for all") },
  }, async ({ branch = "all" }) => {
    const all = await load();
    const items = all.filter((i) => branch === "all" || brOf(i).id === branch || brOf(i).name.toLowerCase() === String(branch).toLowerCase());
    const tree = {};
    for (const i of items) ((tree[brOf(i).name] ||= {})[i.group || "—"] ||= []).push({ id: i.id, name: i.name, type: i.type || "repo", desc: i.desc || "" });
    return json({ count: items.length, branches: BR.map((b) => ({ id: b.id, name: b.name })), tree });
  });

  return server;
}

const httpIdx = process.argv.indexOf("--http");
if (httpIdx === -1) {
  await build().connect(new StdioServerTransport());
} else {
  const port = Number(process.argv[httpIdx + 1] || process.env.PORT || 3333);
  createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    if (req.method === "OPTIONS") return res.writeHead(204).end();
    if (!req.url.startsWith("/mcp")) return res.writeHead(404).end("tinilib MCP: use /mcp");
    // Stateless: a fresh server + transport per request.
    const server = build();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on("close", () => { transport.close(); server.close(); });
    let body;
    if (req.method === "POST") { let d = ""; for await (const c of req) d += c; body = d ? JSON.parse(d) : undefined; }
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  }).listen(port, () => console.error(`tinilib MCP on http://localhost:${port}/mcp  (source: ${SOURCE})`));
}
