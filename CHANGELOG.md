# Changelog

## 0.3.0 — 2026-11-16

- **AI summaries no longer hang.** Each request stops after 90 seconds with a clear message instead of waiting forever.
- **Elapsed timer and Cancel button** next to "AI is summarizing…".
- **Faster Gemini 3.x:** the app asks the model for low thinking effort (Gemini 2.5: thinking off). Summarizing a README needs no deep reasoning, so replies usually take a few seconds instead of 30–90. If a model rejects the setting, the app retries without it.
- **Less text sent:** only the first 24,000 characters of a README go to the AI (was 60,000). The useful part of a README is almost always at the top.

## 0.2.0 — 2026-11-16

- tinifb-style app layout: branches sidebar, compact list, detail panel, map view.
- Custom branches for any field; AI picks a branch or proposes a new one.
- Add skills (paste or upload `SKILL.md`) and any other tool link.
- MCP server and scripts read custom branches.

## 0.1.0 — 2026-11-16

- First release: add GitHub repos by link, AI summaries (OpenAI, Anthropic, Gemini, Ollama, OpenAI-compatible), export `AGENTS.md` / `llms.txt` / `library.json`, MCP server, tinihub-style logo.
