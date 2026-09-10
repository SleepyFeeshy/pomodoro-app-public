use crate::error::MyError;
use chrono::{Utc, Duration as D};
use reqwest;
use serde::{Deserialize, Serialize};
// use sqlx::sqlite::SqlitePool;
use sqlx::{Pool, Row, Sqlite};
// use std::env;
// use tauri::Manager;

use crate::util::database_auth::{get_sqlite_pool, TODOIST_KEY};

#[derive(Debug, Serialize, Deserialize)]
pub struct TasksResponse {
    results: Vec<Task>,
}

#[derive(Debug, Deserialize)]
struct CompletedTasksResponse {
    items: Vec<Task>,
}


#[derive(Debug, Serialize, Deserialize)]
struct Due {
    date: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Deadline {
    date: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Duration {
    amount: i64,
    unit: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    id: String,
    project_id: String,
    section_id: Option<String>,
    parent_id: Option<String>,
    added_by_uid: Option<String>,
    assigned_by_uid: Option<String>,
    responsible_uid: Option<String>,
    labels: Vec<String>,
    deadline: Option<Deadline>,
    duration: Option<Duration>,
    checked: bool,
    is_deleted: bool,
    added_at: Option<String>,
    completed_at: Option<String>,
    completed_by_uid: Option<String>,
    updated_at: Option<String>,
    due: Option<Due>,
    priority: i64,
    child_order: i64,
    content: String,
    description: String,
    day_order: i64,
    is_collapsed: bool, // add more fields later as needed
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LocalTask {
    id: String,
    content: String,
    due: Option<String>,
    duration: Option<String>,
    is_deleted: bool
}

#[derive(Debug, Serialize, Deserialize)]
struct LocalTaskResponse {
    results: Vec<LocalTask>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Paginated<T> {
    results: Vec<T>,
    next_cursor: Option<String>,
}

#[tauri::command]
pub async fn get_all_tasks_from_local(app: tauri::AppHandle) -> Result<Vec<LocalTask>, MyError> {
    // get sqlite pool
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app).await?;

    // fetch local sqlite database
    let rows = sqlx::query(
        "
        SELECT 
          id, content, due, duration, is_deleted
        FROM tasks
        WHERE is_deleted = 0",
    )
    .fetch_all(&sqlite_pool)
    .await?;

    let result = rows
        .into_iter()
        .map(|row| LocalTask {
            id: row.get::<String, _>("id"),
            content: row.get::<String, _>("content"),
            due: row.get::<Option<String>, _>("due"),
            duration: row.get::<Option<String>, _>("duration"),
            is_deleted: row.get::<bool, _>("is_deleted")
        })
        .collect::<Vec<_>>();
    // result
    Ok(result)
}

#[tauri::command]
pub async fn get_tasks_today_from_local(app: tauri::AppHandle) -> Result<Vec<LocalTask>, MyError> {
    // get sqlite pool
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app).await?;

    // Get current date in YYYY-MM-DD
    // let today: String = Utc::now().date().format("%Y-%m-%d").to_string();

    // fetch local sqlite database
    let rows = sqlx::query(
        "
        SELECT 
          id, content, due, duration, is_deleted
        FROM tasks
        WHERE DATE(json_extract(due, '$.date')) = DATE('now', 'localtime') AND completed_at IS NULL AND is_deleted = 0
        ORDER BY json_extract(due, '$.date') ASC",
    )
    .fetch_all(&sqlite_pool)
    .await?;

    let result = rows
        .into_iter()
        .map(|row| LocalTask {
            id: row.get::<String, _>("id"),
            content: row.get::<String, _>("content"),
            due: row.get::<Option<String>, _>("due"),
            duration: row.get::<Option<String>, _>("duration"),
            is_deleted: row.get::<bool, _>("is_deleted")
        })
        .collect::<Vec<_>>();
    // result
    Ok(result)
}


#[tauri::command]
pub async fn get_tasks_today() -> Result<TasksResponse, String> {
    let client = reqwest::Client::new();
    let todoist_key = TODOIST_KEY;
    println!("{:#?}", todoist_key);

    // get uncompleted tasks today
    let mut result: TasksResponse = client
        .get("https://api.todoist.com/api/v1/tasks/filter/?query=due: today | due after: today")
        .header("Authorization", format!("Bearer {}", todoist_key))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    // get completed tasks today
    let now = Utc::now().date_naive().to_string();
    let tom = (Utc::now() + D::days(1)).date_naive().to_string();
    let mut tasks_completed: CompletedTasksResponse = client
        .get("https://api.todoist.com/api/v1/tasks/completed/by_completion_date")
        .header("Authorization", format!("Bearer {}", todoist_key))
        // .query(&[("since", "2026-01-14"),("until", "2026-01-15")])
        .query(&[("since", &now.to_string()),("until", &tom.to_string())])
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    result.results.append(&mut tasks_completed.items);

    // result.results.append(&mut tasks_completed.results);
    Ok(result)
}


#[tauri::command]
pub async fn get_all_tasks_from_remote() -> Result<TasksResponse, MyError> {
    let client = reqwest::Client::new();
    let todoist_key = TODOIST_KEY;
    println!("{:#?}", todoist_key);

    let result: TasksResponse = client
        .get("https://api.todoist.com/api/v1/tasks")
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
pub async fn partial_sync_tasks_to_local(app: tauri::AppHandle) -> Result<(), MyError> {
    // get sqlite pool
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app).await?;

    // let remote_tasks = get_all_tasks_from_remote().await?;
    let mut remote_tasks = get_tasks_today().await?; // sync tasks today

    // Sort so that parent_id: None comes first, then parent_id: Some(id)
    // This ensures parents are created before their children.
    remote_tasks.results.sort_by(|a, b| {
        a.parent_id.is_some().cmp(&b.parent_id.is_some())
    });

    for task in remote_tasks.results {
        let labels_json = serde_json::to_string(&task.labels)?;
        let duration_json = task
            .duration
            .as_ref()
            .map(|d| serde_json::to_string(d))
            .transpose()?;
        let deadline_json = task
            .deadline
            .as_ref()
            .map(|d| serde_json::to_string(d))
            .transpose()?;
        let due_json = task
            .due
            .as_ref()
            .map(|d| serde_json::to_string(d))
            .transpose()?;

        sqlx::query(
            "INSERT INTO tasks (
                id, project_id, section_id, parent_id,
                added_by_uid, assigned_by_uid, responsible_uid, labels,
                deadline, duration, checked, is_deleted,
                added_at, completed_at, completed_by_uid, updated_at,
                due, priority_num, child_order, content, description_text,
                day_order, is_collapsed
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
            ON CONFLICT(id) DO UPDATE SET
                project_id = excluded.project_id,
                section_id = excluded.section_id,
                parent_id = excluded.parent_id,
                added_by_uid = excluded.added_by_uid,
                assigned_by_uid = excluded.assigned_by_uid,
                responsible_uid = excluded.responsible_uid,
                labels = excluded.labels,
                deadline = excluded.deadline,
                duration = excluded.duration,
                checked = excluded.checked,
                is_deleted = excluded.is_deleted,
                added_at = excluded.added_at,
                completed_at = excluded.completed_at,
                completed_by_uid = excluded.completed_by_uid,
                updated_at = excluded.updated_at,
                due = excluded.due,
                priority_num = excluded.priority_num,
                child_order = excluded.child_order,
                content = excluded.content,
                description_text = excluded.description_text,
                day_order = excluded.day_order,
                is_collapsed = excluded.is_collapsed
            WHERE excluded.updated_at > tasks.updated_at;",
        )
        .bind(&task.id)                     // $1
        .bind(&task.project_id)             // $2
        .bind(&task.section_id)             // $3
        .bind(&task.parent_id)              // $4
        .bind(&task.added_by_uid)           // $5
        .bind(&task.assigned_by_uid)        // $6
        .bind(&task.responsible_uid)        // $7
        .bind(labels_json)                  // $8
        .bind(deadline_json)                // $9
        .bind(duration_json)                // $10
        .bind(task.checked)                 // $11
        .bind(task.is_deleted)              // $12
        .bind(&task.added_at)               // $13
        .bind(&task.completed_at)           // $14
        .bind(&task.completed_by_uid)       // $15
        .bind(&task.updated_at)             // $16
        .bind(due_json)                     // $17
        .bind(task.priority)                // $18
        .bind(task.child_order)             // $19
        .bind(&task.content)                // $20
        .bind(&task.description)            // $21
        .bind(task.day_order)               // $22
        .bind(task.is_collapsed)            // $23
        .execute(&sqlite_pool)
        .await?;
    }

    Ok(())
}

#[tauri::command]
pub async fn full_sync_tasks_to_local(app: tauri::AppHandle) -> Result<(), MyError> {
    // get sqlite pool
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app).await?;

    // insert one entry into sync_table
    sqlx::query("INSERT INTO sync_state (id) VALUES (1) ON CONFLICT(id) DO NOTHING")
        .execute(&sqlite_pool)
        .await?;

    // get sync table
    let last_sync: Option<String> = sqlx::query(
        "
        SELECT 
            last_projects_sync
        FROM sync_state
        LIMIT 1",
    )
    .fetch_one(&sqlite_pool)
    .await?
    .get("last_projects_sync");

    let client = reqwest::Client::new();
    let todoist_key = TODOIST_KEY;
    let mut all = Vec::new();
    let mut cursor: Option<String> = None;

    loop {
        let url = if let Some(c) = &cursor {
            if let Some(since) = &last_sync {
                format!(
                    "https://api.todoist.com/api/v1/tasks?since={}&cursor={}",
                    since, c
                )
            } else {
                format!("https://api.todoist.com/api/v1/tasks?cursor={}", c)
            }
        } else {
            if let Some(since) = &last_sync {
                format!("https://api.todoist.com/api/v1/tasks?since={}", since)
            } else {
                "https://api.todoist.com/api/v1/tasks".to_string()
            }
        };

        println!("{:#?}", url);

        let page: Paginated<Task> = client
            .get(url)
            .bearer_auth(&todoist_key)
            .send()
            .await?
            .json()
            .await?;

        all.extend(page.results);

        match page.next_cursor {
            Some(c) => cursor = Some(c),
            None => break,
        }
    }

    for task in all {
        let labels_json = serde_json::to_string(&task.labels)?;
        let duration_json = task
            .duration
            .as_ref()
            .map(|d| serde_json::to_string(d))
            .transpose()?;
        let deadline_json = task
            .deadline
            .as_ref()
            .map(|d| serde_json::to_string(d))
            .transpose()?;
        let due_json = task
            .due
            .as_ref()
            .map(|d| serde_json::to_string(d))
            .transpose()?;

        sqlx::query(
            "INSERT INTO tasks (
                id, project_id, section_id, parent_id,
                added_by_uid, assigned_by_uid, responsible_uid, labels,
                deadline, duration, checked, is_deleted,
                added_at, completed_at, completed_by_uid, updated_at,
                due, priority_num, child_order, content, description_text,
                day_order, is_collapsed
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                project_id = excluded.project_id,
                section_id = excluded.section_id,
                parent_id = excluded.parent_id,
                added_by_uid = excluded.added_by_uid,
                assigned_by_uid = excluded.assigned_by_uid,
                responsible_uid = excluded.responsible_uid,
                labels = excluded.labels,
                deadline = excluded.deadline,
                duration = excluded.duration,
                checked = excluded.checked,
                is_deleted = excluded.is_deleted,
                added_at = excluded.added_at,
                completed_at = excluded.completed_at,
                completed_by_uid = excluded.completed_by_uid,
                updated_at = excluded.updated_at,
                due = excluded.due,
                priority_num = excluded.priority_num,
                child_order = excluded.child_order,
                content = excluded.content,
                description_text = excluded.description_text,
                day_order = excluded.day_order,
                is_collapsed = excluded.is_collapsed
            WHERE excluded.updated_at > tasks.updated_at;",
        )
        .bind(&task.id)
        .bind(&task.project_id)
        .bind(&task.section_id)
        .bind(&task.parent_id)
        .bind(&task.added_by_uid)
        .bind(&task.assigned_by_uid)
        .bind(&task.responsible_uid)
        .bind(labels_json)
        .bind(deadline_json)
        .bind(duration_json)
        .bind(task.checked)
        .bind(task.is_deleted)
        .bind(&task.added_at)
        .bind(&task.completed_at)
        .bind(&task.completed_by_uid)
        .bind(&task.updated_at)
        .bind(due_json)
        .bind(task.priority)
        .bind(task.child_order)
        .bind(&task.content)
        .bind(&task.description)
        .bind(task.day_order)
        .bind(task.is_collapsed)
        .execute(&sqlite_pool)
        .await?;
    }

    // update sync table
    let now = chrono::Utc::now().to_rfc3339();
    sqlx::query(
        "
        INSERT INTO sync_state (id, last_tasks_sync)
        VALUES (1, ?)
        ON CONFLICT(id) DO UPDATE SET last_tasks_sync = ?
    ",
    )
    .bind(&now)
    .bind(&now)
    .execute(&sqlite_pool)
    .await?;

    Ok(())
}
