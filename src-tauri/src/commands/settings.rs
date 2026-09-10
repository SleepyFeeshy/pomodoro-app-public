use serde::{Deserialize, Serialize};
use tauri::{AppHandle};
use tauri_plugin_store::StoreExt;

// POMODORO SETTINGS
#[derive(Serialize, Deserialize, Debug)]
pub struct TimerSettings {
    work_time: i32,
    short_break_time: i32,
    long_break_time: i32,
    long_break_interval: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TrackerSettings {
    start_hour: i32,
    end_hour: i32,
    target_work_sessions: i32,
}

impl Default for TimerSettings {
    fn default() -> Self {
        Self {
            work_time: 20,
            short_break_time: 5,
            long_break_time: 15,
            long_break_interval: 4,
        }
    }
}

impl Default for TrackerSettings {
    fn default() -> Self {
        Self {
            start_hour: 6,
            end_hour: 21,
            target_work_sessions: 10,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Settings {
    timer_settings: TimerSettings,
    tracker_settings: TrackerSettings,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            timer_settings: TimerSettings::default(),
            tracker_settings: TrackerSettings::default(),
        }
    }
}

#[tauri::command]
pub fn update_stats(app: AppHandle) {
    let store = app.store("settings.json");
    let stats = store.expect("REASON").get("stats");
    println!("{}", serde_json::to_string_pretty(&stats).unwrap());
}
