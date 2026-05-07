/**
 * Production entry: runs dist/server.js from package root.
 * If the app was not built (no dist/), runs `npm run build` once.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let entry = path.join(pkgRoot, "dist", "server.js");

if (!fs.existsSync(entry)) {
  console.error("dist/server.js missing; running npm run build …");
  const r = spawnSync("npm", ["run", "build"], {
    stdio: "inherit",
    shell: true,
    cwd: pkgRoot,
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (!fs.existsSync(entry)) {
  const underSrc = path.join(pkgRoot, "src", "dist", "server.js");
  if (fs.existsSync(underSrc)) {
    entry = underSrc;
  } else {
    console.error(
      `Missing compiled app. From the backend root run: npm install && npm run build`
    );
    process.exit(1);
  }
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
