import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getPublicReadToolDefinitions } from "../src/catalog.js";
import { toolPublicMetadata } from "../src/tool-metadata.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "docs/reference/tools.md");

const tools = getPublicReadToolDefinitions().map(toolPublicMetadata);

const lines: string[] = [
  "# Tools",
  "",
  "Generated from the Celina SDK catalog with the public read-only filter (`families: [\"read\"]`, no server keys, no Self sessions, no `estimate_*`). Re-run `npm run docs:tools` after bumping `@andrewkimjoseph/celina-sdk`.",
  "",
  `Currently **${tools.length}** tools. Live list: \`GET /v1/tools\`. Invoke with \`POST /v1/tools/<name>\` using snake_case JSON keys.`,
  "",
];

for (const tool of tools) {
  lines.push(`## \`${tool.name}\``);
  lines.push("");
  lines.push(tool.title);
  lines.push("");
  lines.push(tool.description);
  lines.push("");
  if (tool.inputs.length === 0) {
    lines.push("No input fields. Send `{}` or an empty JSON object.");
    lines.push("");
    continue;
  }
  lines.push("| Field | Type | Required | Description |");
  lines.push("|-------|------|----------|-------------|");
  for (const input of tool.inputs) {
    const required = input.required ? "yes" : "no";
    const description = input.description.replace(/\|/g, "\\|");
    lines.push(`| \`${input.name}\` | ${input.type} | ${required} | ${description} |`);
  }
  lines.push("");
}

writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${tools.length} tools to ${outPath}`);
