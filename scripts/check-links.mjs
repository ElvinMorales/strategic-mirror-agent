import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules"]);
const failures = [];
const linkPattern = /!?\[[^\]]*]\(([^)]+)\)/g;

function isExternal(target) {
  return /^(https?:|mailto:|app:|#)/i.test(target);
}

function cleanTarget(target) {
  const withoutTitle = target.trim().split(/\s+["'][^"']*["']$/)[0];
  const withoutAnchor = withoutTitle.split("#")[0];
  return decodeURIComponent(withoutAnchor);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function checkFile(filePath) {
  const content = await readFile(filePath, "utf8");
  for (const match of content.matchAll(linkPattern)) {
    const rawTarget = match[1];
    if (isExternal(rawTarget)) continue;
    const target = cleanTarget(rawTarget);
    if (!target) continue;
    const resolved = path.resolve(path.dirname(filePath), target);
    if (!resolved.startsWith(root)) {
      failures.push(`${path.relative(root, filePath)} links outside repo: ${rawTarget}`);
      continue;
    }
    if (!(await exists(resolved))) {
      failures.push(`${path.relative(root, filePath)} has missing local link: ${rawTarget}`);
    }
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      await checkFile(fullPath);
    }
  }
}

await walk(root);

if (failures.length) {
  console.error("Local link check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Local link check passed.");
