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
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const content = await readFile(fullPath, "utf8");
      if (!content.trim()) {
        failures.push(`${path.relative(root, fullPath)} is empty`);
      }
      if (content.includes("\t")) {
        failures.push(`${path.relative(root, fullPath)} contains tab characters`);
      }
      if (content.includes("—")) {
        failures.push(`${path.relative(root, fullPath)} contains an em dash`);
      }
    }
  }
}

await walk(root);

if (failures.length) {
  console.error("Markdown validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Markdown validation passed.");
