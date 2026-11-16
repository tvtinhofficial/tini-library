#!/usr/bin/env node
// Add the Claude skills installed on this machine (folders with a SKILL.md) to library.json.
// Usage: node scripts/scan-skills.mjs [skillsDir] [library.json]
// Default skillsDir: ~/.claude/skills
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const dir = process.argv[2] || join(homedir(), ".claude", "skills");
const libPath = process.argv[3] || "library.json";
if (!existsSync(dir)) { console.error(`Not found: ${dir}`); process.exit(1); }
const lib = existsSync(libPath) ? JSON.parse(readFileSync(libPath, "utf8")) : { version: 1, items: [] };
lib.items ||= [];

const field = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
};

let added = 0;
for (const name of readdirSync(dir)) {
  const f = join(dir, name, "SKILL.md");
  if (!existsSync(f)) continue;
  const text = readFileSync(f, "utf8");
  const fm = (text.match(/^---\n([\s\S]*?)\n---/) || [, ""])[1];
  const id = "skill-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (lib.items.some((i) => i.id === id)) continue;
  lib.items.push({
    id, type: "skill", name: field(fm, "name") || name,
    cat: "other", group: "Skills", icon: "sparkles",
    desc: field(fm, "description").slice(0, 300),
    prompt: `Use the ${field(fm, "name") || name} skill to …`,
  });
  added++;
}
writeFileSync(libPath, JSON.stringify(lib, null, 2));
console.log(`Added ${added} skills to ${libPath}. Open the app to sort them into branches.`);
