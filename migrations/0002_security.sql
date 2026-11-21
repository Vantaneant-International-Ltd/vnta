-- VNTA Personal: passkeys, session labels and a sign-in activity log.
-- A passkey row holds only the PUBLIC key. The private key never leaves the person's device.

CREATE TABLE passkeys (
	id           TEXT PRIMARY KEY,                -- credential id, base64url
	user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	public_key   TEXT NOT NULL,                   -- base64url of the COSE public key
	counter      INTEGER NOT NULL DEFAULT 0,
	transports   TEXT,                            -- JSON array, a hint for the browser
	name         TEXT NOT NULL,
	created_at   INTEGER NOT NULL,
	last_used_at INTEGER
);
CREATE INDEX passkeys_user ON passkeys(user_id);

-- One-time challenges for passkey ceremonies. Used once, valid five minutes.
CREATE TABLE webauthn_challenges (
	id         TEXT PRIMARY KEY,
	challenge  TEXT NOT NULL,
	purpose    TEXT NOT NULL CHECK (purpose IN ('register', 'signin')),
	user_id    TEXT REFERENCES users(id) ON DELETE CASCADE,
	expires_at INTEGER NOT NULL
);

ALTER TABLE sessions ADD COLUMN method TEXT NOT NULL DEFAULT 'code';  -- 'code' | 'passkey'
ALTER TABLE sessions ADD COLUMN device TEXT;                            -- coarse label, e.g. "Chrome on Mac". No IP address.

-- What happened to the account's security. Never holds IP addresses or document content.
CREATE TABLE security_events (
	id      TEXT PRIMARY KEY,
	user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	kind    TEXT NOT NULL,
	device  TEXT,
	at      INTEGER NOT NULL
);
CREATE INDEX security_events_user ON security_events(user_id, at);
