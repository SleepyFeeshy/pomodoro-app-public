// modules;
use crate::util::database_auth::AppData; 
mod util;
pub mod error;
use crate::commands::local_storage::DailyVisit;
use crate::commands::auth::LocalUserData;
use crate::commands::auth::LocalUserToken;
use crate::error::MyError;
mod commands;
use tauri_plugin_google_auth;
// pub use commands::get_sessions::{
pub use commands::pomodoro_logs::{
    get_data, get_data_for_logs, get_data_past_three_days, get_data_today, get_weekly_heatmap
};
pub use commands::logs::{create_log, delete_log, upload_log_to_remote};
pub use commands::projects::{get_all_projects, sync_projects_to_local};
pub use commands::sections::{get_all_sections, sync_sections_to_local};
pub use commands::settings::{update_stats, Settings};
pub use commands::sync::{sync_databases, sync_db_remote_to_local};
pub use commands::todoist_tasklist::{
    full_sync_tasks_to_local, get_all_tasks_from_local, get_all_tasks_from_remote, get_tasks_today,
    get_tasks_today_from_local, partial_sync_tasks_to_local,
};
pub use commands::tasks::{complete_task_in_remote, complete_task_in_local, delete_task_in_local, delete_task_in_remote};

pub use commands::auth::{
    sign_in_or_create_user
};

use serde_json::json;
// use std::sync::Mutex;
// use tauri_plugin_store::StoreBuilder;

// use serde_json::Value;
// use tauri::State;
use tauri::{App};
// use tauri_plugin_notification::Notification;
// use tauri_plugin_store::Store;
use tauri_plugin_store::StoreExt;
// use core::sync;
use dotenvy::dotenv;
use std::env;
use tauri_plugin_sql::{Migration, MigrationKind};

// use tauri::{command};
// use std::error::Error;
// use std::future::Future;
// use serde::Serialize;
// use std::convert::Infallible;
// use std::string::ParseError;

// use time::error;

// use std::path::PathBuf;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn get_pixela_token_key() -> String {
    env::var("PIXELA_TOKEN").unwrap_or_else(|_| "default-api-key".to_string())
}

impl serde::Serialize for MyError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv().ok();
    // let _ = main();
    // let _ = sync_databases();
    // let _ = test_insert_supabase();

    // initialize pool before tauri builder
    let pg_pool = tauri::async_runtime::block_on(async {
        match sqlx::PgPool::connect("")
            .await
        {
            Ok(pool) => Some(pool),
            Err(err) => None
        }
    });

    tauri::Builder::default()
        .manage(AppData { pg_pool: pg_pool })
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_google_auth::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(
                    "sqlite:pomodorodatabase_public.db",
                    vec![
                        Migration {
                            version: 1,
                            description: "Initial migration",
                            sql: include_str!("../migrations/sqlite/001_init.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 2,
                            description: "Todoist Users Table Init",
                            sql: include_str!("../migrations/sqlite/002_users.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 3,
                            description: "Projects Table Init",
                            sql: include_str!("../migrations/sqlite/003_projects.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 4,
                            description: "Sections Table Init",
                            sql: include_str!("../migrations/sqlite/004_sections.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 5,
                            description: "Tasks Table Init",
                            sql: include_str!("../migrations/sqlite/005_tasks.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 6,
                            description: "Sync State Table Init",
                            sql: include_str!("../migrations/sqlite/006_sync_table.sql"),
                            kind: MigrationKind::Up,
                        }
                    ],
                )
                .build(),
        )
        .setup(|app: &mut App| {
            let store = app.store("settings.json")?; // store is at AppData/Roaming
            if !store.has("settings") {
                store.set("settings", json!(Settings::default()));
            }
            Ok(())
        })
        .setup(|app: &mut App| {
            let store = app.store("localStorage.json")?; // store is at AppData/Roaming
            if !store.has("daily_visit") {
                store.set("daily_visit", json!(DailyVisit::default()));
            }
            Ok(())
        })
        // Set up local_user storage
        .setup(|app: &mut App| {
            let store = app.store("user.json")?; // store is at AppData/Roaming
            if !store.has("user") {
                store.set("user", json!(LocalUserData::default()));
            }
            Ok(())
        })
        // Set up local user token
        .setup(|app: &mut App| {
            let store = app.store("user_token.json")?; // store is at AppData/Roaming
            if !store.has("user_token") {
                store.set("user_token", json!(LocalUserToken::default()));
            }
            Ok(())
        })
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            update_stats,
            get_pixela_token_key,
            sync_databases,
            sync_db_remote_to_local,
            get_data,
            get_data_today,
            get_data_past_three_days,
            get_data_for_logs,
            get_weekly_heatmap,
            create_log,
            delete_log,
            get_all_tasks_from_local,
            get_all_tasks_from_remote,
            get_tasks_today,
            full_sync_tasks_to_local,
            partial_sync_tasks_to_local,
            get_tasks_today_from_local,
            get_all_projects,
            sync_projects_to_local,
            get_all_sections,
            sync_sections_to_local,
            complete_task_in_local,
            complete_task_in_remote,
            delete_task_in_local, delete_task_in_remote,
            upload_log_to_remote,

            // google auth
            sign_in_or_create_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// STATS
// #[derive(Default, Serialize, Deserialize, Debug)]
// struct Stat {
//     sessions: i32,
// }

// #[derive(Serialize, Deserialize, Debug)]
// struct Stats {
//     today: Stat,
//     week: Stat,
//     total: Stat,
// }

// impl Default for Stats {
//     fn default() -> Self {
//         Self {
//             today: Stat::default(),
//             week: Stat::default(),
//             total: Stat::default(),
//         }
//     }
// }
