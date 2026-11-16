<p align="center"><img src="assets/social-preview.png" alt="tinilib" width="100%"></p>

<p align="center"><b>A repo & skill library that any AI can use.</b><br>
Save the GitHub repos and AI skills you collect, let AI summarize and sort them into branches, then export one file that Claude, ChatGPT, Cursor, Codex and others can read.</p>

<p align="center"><a href="README.vi.md">Tiếng Việt</a> · <a href="https://tvtinhofficial.github.io/tini-library/">Live demo</a></p>

---

## Why

If you use AI tools a lot, you end up with dozens of starred repos, skills and prompts scattered everywhere. Bookmarks save them, but your AI assistant never knows they exist. tinilib keeps them in one `library.json` and turns it into an `AGENTS.md` your AI reads before it starts building from scratch.

## Features

- **Paste a GitHub link, done.** The app fetches the README and stars through the GitHub API.
- **AI summary with your own key.** Works with OpenAI, Anthropic (Claude), Google Gemini, Ollama (fully local, free) or any OpenAI-compatible API (OpenRouter, Groq, LM Studio). No key? It still saves the repo with GitHub's own description.
- **Cards or branches.** See everything as cards, or as a tree: Library → Web dev / Marketing / Other → groups → tools.
- **Export for any AI.** `AGENTS.md`, `llms.txt` or `library.json`, to copy or download.
- **Your data stays with you.** No server, no account. Data and API keys live in your browser; the library is a plain JSON file you can commit.
- **Vietnamese and English** interface.

## Quick start

**Option A — use it online:** open the live demo, add repos, export.

**Option B — run it locally (recommended for your own library):**

```bash
git clone https://github.com/tvtinhofficial/tini-library
cd tini-library
npx serve .        # or: python3 -m http.server 8000
```

Open the address it prints. Opening `index.html` directly also works, but then the bundled `library.json` will not load (browsers block that on `file://`); use **Settings → Import file** instead.

To turn on AI summaries: **Settings → AI provider**, then paste your key and pick a model. For Ollama, start it with `OLLAMA_ORIGINS=*` so the browser may call it.

## Using your library with AI tools

| Tool | How |
| --- | --- |
| Cursor, Claude Code, Codex, Gemini CLI, Copilot | Export `AGENTS.md` and put it in the root of your project (Claude Code also reads it if you rename or copy it to `CLAUDE.md`). |
| ChatGPT, Claude (web/app), Gemini | Export and paste `AGENTS.md` into the chat, or add it to a Project / custom GPT as a file. |
| Anything else | `llms.txt` is a short list; `library.json` has every field. |
| **Live search (MCP)** | Run the [MCP server](mcp/) and Claude Desktop, Claude Code, Cursor or ChatGPT can search your library directly — no file pasting. |

Rebuild the files from the command line after editing `library.json`:

```bash
node scripts/build-agents.mjs            # writes AGENTS.md and llms.txt
node scripts/scan-skills.mjs             # adds your ~/.claude/skills to library.json
```

## Data format

```json
{ "version": 1, "items": [ {
  "id": "owner-repo", "type": "repo | skill", "name": "owner/repo",
  "url": "https://github.com/owner/repo", "cat": "web | mkt | other",
  "group": "Sub-group", "icon": "lucide-icon-name",
  "desc": "...", "points": ["..."], "when": "...", "install": "...", "prompt": "..."
} ] }
```

## Roadmap

- [x] MCP server so ChatGPT and Claude can search the library live
- [ ] Hosted MCP (no tunnel needed)
- [ ] Custom branches beyond Web dev / Marketing
- [ ] Import from GitHub stars

## Privacy

API keys are stored in your browser's localStorage and sent only to the provider you choose. On a shared computer, clear them in Settings after use.

## License

MIT · made by [tinihub](https://tinifb.net)
