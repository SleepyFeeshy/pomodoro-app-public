CREATE TABLE IF NOT EXISTS tasks ( 
    id TEXT PRIMARY KEY, 
    project_id TEXT NULL, -- FK project
    section_id TEXT NULL, -- FK section
    parent_id TEXT NULL, -- FK parent task
    added_by_uid TEXT NULL, -- FK user
    assigned_by_uid TEXT NULL, -- FK user
    responsible_uid TEXT NULL, -- FK user
    labels TEXT NULL, -- json list 
    deadline TEXT, -- json object
    duration TEXT, -- json object
    checked BOOLEAN,
    is_deleted BOOLEAN,
    added_at TEXT, -- datetime
    completed_at TEXT, -- datetime
    completed_by_uid TEXT NULL, -- FK
    updated_at TEXT, -- datetime
    due TEXT, -- json object
    priority_num INTEGER,
    child_order INTEGER,
    content TEXT,
    description_text TEXT,
    day_order INTEGER,
    is_collapsed BOOLEAN,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (section_id) REFERENCES sections(id)
    FOREIGN KEY (parent_id) REFERENCES tasks(id) DEFERRABLE INITIALLY DEFERRED,
    FOREIGN KEY (added_by_uid) REFERENCES users(id),
    FOREIGN KEY (assigned_by_uid) REFERENCES users(id),
    FOREIGN KEY (responsible_uid) REFERENCES users(id),
    FOREIGN KEY (completed_by_uid) REFERENCES users(id)
)