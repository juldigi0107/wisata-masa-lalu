-- WISATA MASA LALU — social memory foundation
-- D1 schema for moderated Memory Wall + collective-memory voting.
-- No email, phone number, IP address, or other direct identifier is stored.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS memory_posts (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  nickname TEXT NOT NULL DEFAULT 'Anonim 90-an',
  city TEXT NOT NULL DEFAULT '',
  memory_year INTEGER,
  category TEXT NOT NULL,
  story TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  moderation_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_memory_posts_status_created ON memory_posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_posts_category_status ON memory_posts(category, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_posts_city_status ON memory_posts(city, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_posts_client_created ON memory_posts(client_id, created_at DESC);

CREATE TABLE IF NOT EXISTS memory_votes (
  post_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('yes','no')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  PRIMARY KEY (post_id, client_id),
  FOREIGN KEY (post_id) REFERENCES memory_posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_memory_votes_post ON memory_votes(post_id);

CREATE TABLE IF NOT EXISTS moderation_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approved','rejected','restored')),
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY (post_id) REFERENCES memory_posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_moderation_log_post ON moderation_log(post_id, created_at DESC);
