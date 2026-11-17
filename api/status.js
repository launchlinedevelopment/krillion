import { send } from "./_db.js";
export default function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Use GET." });
  return send(res, 200, {
    accountsAvailable: Boolean(process.env.DATABASE_URL),
  });
}
