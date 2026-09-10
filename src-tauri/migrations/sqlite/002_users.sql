CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    email TEXT,
    created_at TEXT NOT NULL, 
    updated_at TEXT,
    is_active BOOLEAN DEFAULT 1
);

INSERT OR IGNORE INTO users (id, name, created_at, is_active) VALUES 
('24238246', 'Zachary Michael Romualdez', '', 1);

