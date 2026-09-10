use crate::error::MyError;
use reqwest;
use serde::{Deserialize, Serialize};
use sqlx::sqlite::SqlitePool;
use std::env;
use tauri::Manager;
use sqlx::{Pool, Row, Sqlite};

use crate::util::database_auth::{get_sqlite_pool, get_postgres_pool, TODOIST_KEY};

// #[tauri::command]
// pub async fn get_all_users() -> Result<SectionsResponse, String> {
//     let client = reqwest::Client::new();
//     let todoist_key = TODOIST_KEY;
//     println!("{:#?}", todoist_key);

//     let result: SectionsResponse = client
//         .get("https://api.todoist.com/api/v1/sections")
//         .header("Authorization", format!("Bearer {}", todoist_key))
//         .send()
//         .await
//         .map_err(|e| e.to_string())?
//         .json()
//         .await
//         .map_err(|e| e.to_string())?;

//     Ok(result)
// }

#[tauri::command]
pub async fn sync_users_to_local(app: tauri::AppHandle) -> Result<(), MyError> {
    // get sqlite pool
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app).await?;

    let remote_sections = get_all_sections().await?;

    for section in remote_sections.results {
        sqlx::query(
            "INSERT INTO users (
                id, name, email, created, updated, is_active
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT(id) DO UPDATE SET
                name = excluded.name,
                email = excluded.email,
                created = excluded.created,
                updated = excluded.updated,
                is_active = excluded.is_active,
            WHERE 
                excluded.updated_at > sections.updated_at;",
        )
        .bind(&section.id)
        .bind(&section.project_id)
        .bind(&section.added_at)
        .bind(&section.updated_at)
        .bind(&section.name)
        .bind(section.section_order)
        .bind(section.is_archived)
        .bind(section.is_deleted)
        .bind(section.is_collapsed)
        .execute(&sqlite_pool)
        .await?;
    }

    Ok(())
}