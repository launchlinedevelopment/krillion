CREATE TABLE IF NOT EXISTS arcade_users (
 id UUID PRIMARY KEY,
 username TEXT UNIQUE NOT NULL,
 password_salt TEXT NOT NULL,
 password_hash TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS arcade_sessions (
 token_hash TEXT PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES arcade_users(id) ON DELETE CASCADE,
 expires_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS arcade_progress (
 user_id UUID PRIMARY KEY REFERENCES arcade_users(id) ON DELETE CASCADE,
 progress JSONB NOT NULL DEFAULT '{}'::jsonb,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS arcade_sessions_expiry ON arcade_sessions(expires_at);
