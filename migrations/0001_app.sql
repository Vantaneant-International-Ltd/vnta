-- VNTA Personal: app data. Cloudflare D1 (SQLite).
-- Every row that belongs to a person carries user_id, and every query filters on it.
-- Document text and original files live in R2 under u/<user_id>/, not here.

CREATE TABLE users (
	id             TEXT PRIMARY KEY,
	email          TEXT NOT NULL UNIQUE,
	created_at     INTEGER NOT NULL,
	retention_days INTEGER NOT NULL DEFAULT 365, -- 0 = keep until I delete it
	ai_consent_at  INTEGER                        -- null: no consent. No AI provider exists yet.
);

-- One sign-in code per email at a time. Only a hash of the code is stored.
CREATE TABLE login_codes (
	email      TEXT PRIMARY KEY,
	code_hash  TEXT NOT NULL,
	expires_at INTEGER NOT NULL,
	attempts   INTEGER NOT NULL DEFAULT 0,
	sent_at    INTEGER NOT NULL
);

-- Only a hash of the session token is stored.
CREATE TABLE sessions (
	token_hash TEXT PRIMARY KEY,
	user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	created_at INTEGER NOT NULL,
	expires_at INTEGER NOT NULL
);
CREATE INDEX sessions_user ON sessions(user_id);

CREATE TABLE documents (
	id          TEXT PRIMARY KEY,
	user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	name        TEXT NOT NULL,
	kind        TEXT NOT NULL CHECK (kind IN ('pdf', 'text')),
	size        INTEGER NOT NULL,
	fingerprint TEXT NOT NULL,                 -- sha-256 of the normalised text
	text_state  TEXT NOT NULL CHECK (text_state IN ('ok', 'no_text', 'nothing_found')),
	char_count  INTEGER NOT NULL,
	created_at  INTEGER NOT NULL,
	UNIQUE (user_id, fingerprint)
);
CREATE INDEX documents_user ON documents(user_id, created_at);

CREATE TABLE findings (
	id               TEXT PRIMARY KEY,
	user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	document_id      TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
	kind             TEXT NOT NULL,
	title            TEXT NOT NULL,
	date_raw         TEXT,
	date_iso         TEXT,                       -- only when the text reads one way
	date_ambiguous   INTEGER NOT NULL DEFAULT 0,
	date_candidates  TEXT NOT NULL DEFAULT '[]', -- JSON array of YYYY-MM-DD
	relative         TEXT,
	time             TEXT,
	amount_raw       TEXT,
	amount_value     REAL,
	amount_currency  TEXT,
	confidence       TEXT NOT NULL,
	notes            TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
	quote            TEXT NOT NULL,              -- the exact sentence in the document
	q_start          INTEGER NOT NULL,
	q_end            INTEGER NOT NULL,
	line             INTEGER NOT NULL,
	status           TEXT NOT NULL DEFAULT 'needs_review'
	                 CHECK (status IN ('needs_review','ready_for_approval','in_progress','completed','unable_to_verify','dismissed')),
	user_date_iso    TEXT,                       -- a date the person confirmed or corrected
	created_at       INTEGER NOT NULL,
	updated_at       INTEGER NOT NULL
);
CREATE INDEX findings_user ON findings(user_id, status);
CREATE INDEX findings_doc ON findings(document_id);

-- A draft is text for the person to copy. There is no "sent" column on purpose:
-- VNTA never sends anything.
CREATE TABLE drafts (
	id         TEXT PRIMARY KEY,
	user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	finding_id TEXT NOT NULL REFERENCES findings(id) ON DELETE CASCADE,
	body       TEXT NOT NULL,
	created_at INTEGER NOT NULL
);
CREATE INDEX drafts_finding ON drafts(user_id, finding_id);
