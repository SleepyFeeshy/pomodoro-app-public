CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    project_id TEXT, 
    added_at TEXT, -- datetime
    updated_at TEXT, -- datetime
    archived_at TEXT, -- datetime
    name_text TEXT,
    section_order INTEGER, 
    is_archived BOOLEAN,
    is_deleted BOOLEAN,
    is_collapsed BOOLEAN,
    FOREIGN KEY (project_id) REFERENCES projects(id)
)