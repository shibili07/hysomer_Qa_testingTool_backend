/**
 * Render-safe entry: always runs dist/server.js next to package.json.
 * Avoids failures when the dashboard uses a wrong path like src/dist/server.js.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import fs from "node:fs";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const entry = path.join(pkgRoot, "dist", "server.js");

if (!fs.existsSync(entry)) {
  console.error(
    `Missing ${entry}. From the backend root, run: npm install --include=dev && npm run build`
  );
  process.exit(1);
}

const child = spawn(process.execPath, [entry], {
  stdio: "inherit",
  env: process.env,
  cwd: pkgRoot,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
