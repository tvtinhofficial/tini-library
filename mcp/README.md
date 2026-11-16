# tinilib MCP server

Lets any MCP client search your tinilib library live: Claude Desktop, Claude Code, Cursor, ChatGPT (developer mode / connectors) and others.

Tools: `search` (find tools for a job), `fetch` (full entry by id), `list_library` (everything, by branch).

## Install

```bash
cd tini-library/mcp
npm install
```

The server reads `../library.json` by default. Point it elsewhere with `TINILIB_SOURCE` — a file path or a raw URL, e.g. your own fork:
`https://raw.githubusercontent.com/<you>/tini-library/main/library.json`

## Claude Desktop / Cursor (stdio)

Add to `claude_desktop_config.json` (Claude Desktop) or `.cursor/mcp.json` (Cursor):

```json
{
  "mcpServers": {
    "tinilib": {
      "command": "node",
      "args": ["/absolute/path/to/tini-library/mcp/server.mjs"]
    }
  }
}
```

Claude Code: `claude mcp add tinilib -- node /absolute/path/to/tini-library/mcp/server.mjs`

## ChatGPT and other remote clients (HTTP)

```bash
npm run http          # http://localhost:3333/mcp
```

ChatGPT needs a public HTTPS URL. Expose the port with a tunnel (for example `npx cloudflared tunnel --url http://localhost:3333` or ngrok), then in ChatGPT go to **Settings → Connectors → Advanced → Developer mode**, add a connector and paste `https://<your-tunnel>/mcp`.

The HTTP server has no login: anyone with the URL can read your library. Only expose it while you use it, and don't put secrets in `library.json`.

## Try it

Ask your AI: *"Search my tool library for something to make subtitles for a video."*
