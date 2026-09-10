CREATE TABLE IF NOT EXISTS session_types (
    id TEXT PRIMARY KEY,
    label TEXT UNIQUE NOT NULL,
    default_duration INTEGER,

    -- Sync & Metadata
    is_default BOOLEAN DEFAULT 0,  -- 1 for the original 3, 0 for user-created
    created_at TEXT DEFAULT NULL,
    updated_at TEXT DEFAULT NULL,
    synced_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL  -- Use "Soft Deletes" for syncing
);

-- Pre-populating with fixed UUIDs
INSERT OR IGNORE INTO session_types (id, label, default_duration, is_default) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Work', 20, 1),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Short Break', 5, 1),
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Long Break', 15, 1);

CREATE TABLE IF NOT EXISTS sessions ( 
    id TEXT PRIMARY KEY, 
    finished_at TEXT, 
    duration REAL,
    synced_at TEXT,
    deleted_at TEXT,
    updated_at TEXT, 
    session_type_id TEXT, 
    FOREIGN KEY("session_type_id") REFERENCES "session_types"("id")
);