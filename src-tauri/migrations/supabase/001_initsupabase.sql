CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY, 
    finished_at TIMESTAMPTZ, 
    duration DOUBLE PRECISION,
    updated_at TIMESTAMPTZ
)