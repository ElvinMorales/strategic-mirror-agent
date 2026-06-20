import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

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
    } else if (entry.isFile() && /\.(ya?ml)$/.test(entry.name)) {
      try {
        YAML.parse(await readFile(fullPath, "utf8"));
      } catch (error) {
        failures.push(`${path.relative(root, fullPath)}: ${error.message}`);
      }
    }
  }
}

await walk(root);

if (failures.length) {
  console.error("YAML validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("YAML validation passed.");
