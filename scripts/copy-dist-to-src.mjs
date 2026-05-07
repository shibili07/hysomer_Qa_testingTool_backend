/**
 * When Render uses `src` as root, `node dist/server.js` resolves to src/dist/server.js.
 * Mirror compiled output there after tsc.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const from = path.join(root, "dist");
const to = path.join(root, "src", "dist");
const mainFile = path.join(from, "server.js");

try {
  await fs.access(mainFile);
} catch {
  console.warn("copy-dist-to-src: dist/server.js missing, skipping copy");
  process.exit(0);
}

await fs.rm(to, { recursive: true, force: true });
await fs.cp(from, to, { recursive: true });
