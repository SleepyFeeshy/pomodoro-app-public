use crate::error::MyError;
use reqwest;
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};

use crate::util::database_auth::{get_sqlite_pool, TODOIST_KEY};

#[derive(Debug, Serialize, Deserialize)]
struct Section {
    id: String,
    user_id: String,
    project_id: String,
    added_at: String,
    updated_at: Option<String>,
    archived_at: Option<String>,
    name: String,
    section_order: i64,
    is_archived: bool,
    is_deleted: bool,
    is_collapsed: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SectionsResponse {
    results: Vec<Section>,
}

#[tauri::command]
pub async fn get_all_sections() -> Result<SectionsResponse, String> {
    let client = reqwest::Client::new();
    let todoist_key = TODOIST_KEY;
    println!("{:#?}", todoist_key);

    let result: SectionsResponse = client
        .get("https://api.todoist.com/api/v1/sections")
        .header("Authorization", format!("Bearer {}", todoist_key))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    Ok(result)
}

#[tauri::command]
pub async fn sync_sections_to_local(app: tauri::AppHandle) -> Result<(), MyError> {
    // get sqlite pool
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app).await?;

    let remote_sections = get_all_sections().await?;

    for section in remote_sections.results {
        sqlx::query(
            "INSERT INTO sections (
                id, project_id, added_at,
                updated_at, archived_at, name_text, section_order,
                is_archived, is_deleted, is_collapsed
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                project_id = excluded.project_id,
                added_at = excluded.added_at,
                updated_at = excluded.updated_at,
                archived_at = excluded.archived_at,
                name_text = excluded.name_text,
                section_order = excluded.section_order,
                is_archived = excluded.is_archived,
                is_deleted = excluded.is_deleted,
                is_collapsed = excluded.is_collapsed
            WHERE 
                sections.updated_at IS NULL
                OR excluded.updated_at > sections.updated_at;",
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
