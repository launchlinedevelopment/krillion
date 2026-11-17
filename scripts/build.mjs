import fs from "node:fs";
import "./verify.mjs";
fs.mkdirSync("dist", { recursive: true });
for (const file of [
  "index.html",
  "style.css",
  "app.js",
  "arcade.js",
  "games.js",
  "logic.js",
  "data.js",
])
  fs.copyFileSync(file, "dist/" + file);
console.log("Production static assets prepared in dist/.");
