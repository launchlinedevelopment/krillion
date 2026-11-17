import { test } from "node:test";
import assert from "node:assert/strict";
import auth from "../api/auth.js";
import progress from "../api/progress.js";
import status from "../api/status.js";
import {
  passwordHash,
  verifyPassword,
  hashToken,
  sessionUser,
} from "../api/_db.js";
function response() {
  return {
    code: 0,
    body: null,
    headers: {},
    status(code) {
      this.code = code;
      return this;
    },
    setHeader(k, v) {
      this.headers[k] = v;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}
test("Password hashes are salted, and invalid passwords fail", () => {
  const salt = "0123456789abcdef0123456789abcdef",
    hash = passwordHash("correct-password", salt);
  assert.equal(verifyPassword("correct-password", salt, hash), true);
  assert.equal(verifyPassword("incorrect-password", salt, hash), false);
  assert.notEqual(
    hash,
    passwordHash("correct-password", "abcdef0123456789abcdef0123456789"),
  );
  assert.equal(hashToken("example").length, 64);
});
test("Invalid auth requests stop before querying the database", async () => {
  for (const body of [
    { mode: "delete" },
    { mode: "register", username: "x", password: "password" },
    { mode: "register", username: "valid_name", password: "short" },
  ]) {
    const res = response();
    await auth({ method: "POST", body }, res);
    assert.equal(res.code, 400);
    assert.equal(res.headers["Cache-Control"], "no-store");
  }
  const res = response();
  await auth({ method: "GET" }, res);
  assert.equal(res.code, 405);
});
test("Invalid bearer tokens do not query the database", async () => {
  assert.equal(
    await sessionUser({ headers: { authorization: "Bearer invalid" } }, () => {
      throw Error("must not query");
    }),
    null,
  );
});
test("Unconfigured cloud returns a useful error while availability stays nonsecret", async () => {
  const previous = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    let res = response();
    await auth(
      {
        method: "POST",
        body: {
          mode: "login",
          username: "test_player",
          password: "test-password",
        },
      },
      res,
    );
    assert.equal(res.code, 503);
    assert.match(res.body.error, /database setup/);
    res = response();
    await progress({ method: "GET", headers: {} }, res);
    assert.equal(res.code, 503);
    res = response();
    status({ method: "GET" }, res);
    assert.deepEqual(res.body, { accountsAvailable: false });
    assert.equal(res.code, 200);
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous;
  }
});
