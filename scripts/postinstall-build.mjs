/**
 * After `npm install`, compile if dist/ is missing (Render often skips a separate build step).
 * Set SKIP_POSTINSTALL_BUILD=true to opt out.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.SKIP_POSTINSTALL_BUILD === "true") {
  process.exit(0);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const distServer = path.join(root, "dist", "server.js");

if (fs.existsSync(distServer)) {
  process.exit(0);
}

const r = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: true,
  cwd: root,
  env: process.env,
});

process.exit(r.status ?? 1);
