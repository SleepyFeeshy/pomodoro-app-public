use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct DailyVisit {
    time: String,
    has_visited: bool,
}

impl Default for DailyVisit {
    fn default() -> Self {
        let now = chrono::Utc::now().to_rfc3339();
        Self {
            time: now,
            has_visited: false,
        }
    }
}
