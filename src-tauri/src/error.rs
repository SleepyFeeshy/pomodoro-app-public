use std::io;

#[derive(Debug, thiserror::Error)]
pub enum MyError {
    #[error("Failed to read file: {0}")]
    Io(#[from] io::Error),
    #[error("File is not valid utf8: {0}")]
    Utf8(#[from] std::string::FromUtf8Error),
    #[error("SQLx error: {0}")]
    Sqlx(#[from] sqlx::Error),
    #[error("Uuid error: {0}")]
    Uuid(#[from] uuid::Error),
    // #[error("Parse error: {0}")]
    // Parse(#[from] Parse),
    // #[error("Infallible error occurred")]
    // Infallible(#[from] Infallible),
    #[error("Parse error: {0}")]
    Parse(String),
    #[error("Parse error: {0}")]
    ParseError(#[from] time::error::Parse),
    #[error("Parse error: {0}")]
    ChronoParseError(#[from] chrono::ParseError),
    #[error("Intederminate offset error: {0}")]
    IndeterminateOffsetError(#[from] time::error::IndeterminateOffset),

    #[error("Serde JSON error: {0}")]
    SerdeJson(#[from] serde_json::Error), // <-- add this line

    #[error("HTTP error: {0}")]
    Reqwest(#[from] reqwest::Error),

    #[error("Remote database unavailable. App is currently offline.")]
    Offline,
}

impl From<String> for MyError {
    fn from(s: String) -> Self {
        MyError::Parse(s)
    }
}
