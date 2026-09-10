CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    can_assign_tasks BOOLEAN,
    child_order INTEGER,
    color TEXT,
    creator_uid TEXT, -- FK user
    created_at TEXT, -- datetime
    is_archived BOOLEAN,
    is_deleted BOOLEAN,
    is_favorite BOOLEAN,
    is_frozen BOOLEAN,
    name_text TEXT,
    updated_at TEXT, -- datetime
    view_style TEXT,
    default_order INTEGER,
    description_text TEXT,
    public_key TEXT,
    access TEXT, -- json object
    role_text TEXT,
    parent_id TEXT, -- FK
    inbox_project BOOLEAN,
    is_collapsed BOOLEAN,
    is_shared BOOLEAN,
    FOREIGN KEY (creator_uid) REFERENCES users(id)
)