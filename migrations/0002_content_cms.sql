-- WISATA MASA LALU — production CMS registry
-- Structured JSON payloads let the static SSOT stay stable while editors stage D1 overrides.

CREATE TABLE IF NOT EXISTS cms_records (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('object','story','year','visual','source','event','location','easter-egg')),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  revision INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  published_at TEXT,
  UNIQUE(entity_type, slug)
);

CREATE INDEX IF NOT EXISTS idx_cms_records_public ON cms_records(entity_type,status,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_records_slug ON cms_records(entity_type,slug);

CREATE TABLE IF NOT EXISTS cms_change_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  record_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created','updated','published','archived','restored')),
  revision INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY (record_id) REFERENCES cms_records(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cms_change_record ON cms_change_log(record_id,created_at DESC);
