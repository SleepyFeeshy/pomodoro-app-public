use crate::error::MyError;
use chrono::{Utc};
use reqwest;
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};
// use std::env;
// use tauri::Manager;

use crate::util::database_auth::{get_sqlite_pool, TODOIST_KEY};

#[derive(Debug, Serialize, Deserialize)]
pub struct LocalTask {
    id: String,
    content: String,
    due: Option<String>,
    duration: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct LocalTaskResponse {
    results: Vec<LocalTask>,
}

#[derive(Debug, Serialize, Deserialize)]
struct CloseResponse {
    results: Vec<LocalTask>,
}

#[tauri::command]
pub async fn complete_task_in_local(app: tauri::AppHandle, task_id: String) -> Result<(), MyError> {
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app).await?;
    let now = Utc::now().to_string();

    // fetch local sqlite database
    sqlx::query(
        "
        UPDATE tasks
        SET completed_at = ?
        WHERE id = ?",
    )
    .bind(&now)
    .bind(&task_id)
    .execute(&sqlite_pool)
    .await?;

    // result
    Ok(())
}

#[tauri::command]
pub async fn complete_task_in_remote(task_id: String) -> Result<(), MyError> {
    let client = reqwest::Client::new();
    let todoist_key = TODOIST_KEY;
    println!("{:#?}", todoist_key);

    let endpoint = format!("https://api.todoist.com/api/v1/tasks/{}/close", &task_id);
    // get uncompleted tasks today
    client
        .post(&endpoint)
        .header("Authorization", format!("Bearer {}", todoist_key))
        .send()
        .await?;

    // result
    Ok(())
}


#[tauri::command]
pub async fn delete_task_in_local(app: tauri::AppHandle, task_id: String) -> Result<(), MyError> {
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app).await?;
    let now = Utc::now().to_string();

    // fetch local sqlite database
    sqlx::query(
        "
        UPDATE tasks
        SET is_deleted = ?
        WHERE id = ?",
    )
    .bind(1)
    .bind(&task_id)
    .execute(&sqlite_pool)
    .await?;

    // result
    Ok(())
}

#[tauri::command]
pub async fn delete_task_in_remote(task_id: String) -> Result<(), MyError> {
    let client = reqwest::Client::new();
    let todoist_key = TODOIST_KEY;
    println!("{:#?}", todoist_key);

    let endpoint = format!("https://api.todoist.com/api/v1/tasks/{}", &task_id);
    // get uncompleted tasks today
    client
        .delete(&endpoint)
        .header("Authorization", format!("Bearer {}", todoist_key))
        .send()
        .await?;

    // result
    Ok(())
}
