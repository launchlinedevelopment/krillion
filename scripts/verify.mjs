import fs from "node:fs";
import { execFileSync } from "node:child_process";
for (const path of [
  "index.html",
  "style.css",
  "app.js",
  "arcade.js",
  "games.js",
  "logic.js",
  "data.js",
  "api/auth.js",
  "api/progress.js",
]) {
  if (!fs.existsSync(path)) throw Error("Missing " + path);
  if (path.endsWith(".js")) execFileSync(process.execPath, ["--check", path]);
}
execFileSync(
  process.execPath,
  ["--test", "scripts/logic.test.mjs", "scripts/api.test.mjs"],
  {
    stdio: "inherit",
  },
);
console.log("All game files and regression tests verified.");
