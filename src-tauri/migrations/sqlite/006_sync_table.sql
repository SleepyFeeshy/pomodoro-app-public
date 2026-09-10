CREATE TABLE IF NOT EXISTS sync_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    last_tasks_sync TEXT,
    last_projects_sync TEXT,
    last_sections_sync TEXT
);