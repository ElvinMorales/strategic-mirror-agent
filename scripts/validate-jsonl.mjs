import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules"]);
const failures = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".jsonl")) {
      const lines = (await readFile(fullPath, "utf8")).split(/\r?\n/);
      lines.forEach((line, index) => {
        if (!line.trim()) return;
        try {
          JSON.parse(line);
        } catch (error) {
          failures.push(`${path.relative(root, fullPath)}:${index + 1}: ${error.message}`);
        }
      });
    }
  }
}

await walk(root);

if (failures.length) {
  console.error("JSONL validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("JSONL validation passed.");
