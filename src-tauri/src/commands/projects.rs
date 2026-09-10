use crate::error::MyError;
use reqwest;
use serde::{Deserialize, Serialize};
use sqlx::{Row};
use sqlx::{Pool, Sqlite};

use crate::util::database_auth::{get_sqlite_pool, TODOIST_KEY};

#[derive(Debug, Serialize, Deserialize)]
struct Access {
    visibility: String,
    configuration: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    id: String,
    can_assign_tasks: bool,
    child_order: i64,
    color: String,
    creator_uid: Option<String>,
    created_at: Option<String>,
    is_archived: bool,
    is_deleted: bool,
    is_favorite: bool,
    is_frozen: bool,
    name: String,
    updated_at: Option<String>,
    view_style: String,
    default_order: i64,
    description: String,
    public_key: String,
    // access: Option<Access>,
    role: Option<String>,
    parent_id: Option<String>,
    inbox_project: bool,
    is_collapsed: bool,
    is_shared: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectsResponse {
    results: Vec<Project>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Paginated<T> {
    results: Vec<T>,
    next_cursor: Option<String>,
}

#[tauri::command]
pub async fn fetch_all_projects(
    client: &reqwest::Client,
    token: &str,
) -> Result<Vec<Project>, MyError> {
    let mut all = Vec::new();
    let mut cursor: Option<String> = None;

    loop {
        let url = match &cursor {
            Some(c) => format!("https://api.todoist.com/api/v1/projects?cursor={}", c),
            None => "https://api.todoist.com/api/v1/projects".to_string(),
        };

        let page: Paginated<Project> = client
            .get(url)
            .bearer_auth(token)
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

    Ok(all)
}

#[tauri::command]
pub async fn get_all_projects() -> Result<Vec<Project>, MyError> {
    let client = reqwest::Client::new();
    let todoist_key = TODOIST_KEY;
    println!("{:#?}", todoist_key);
    let result = fetch_all_projects(&client, &todoist_key).await?;
    Ok(result)
}

#[tauri::command]
pub async fn sync_projects_to_local(app: tauri::AppHandle) -> Result<(), MyError> {
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
                    "https://api.todoist.com/api/v1/projects?since={}&cursor={}",
                    since, c
                )
            } else {
                format!("https://api.todoist.com/api/v1/projects?cursor={}", c)
            }
        } else {
            if let Some(since) = &last_sync {
                format!("https://api.todoist.com/api/v1/projects?since={}", since)
            } else {
                "https://api.todoist.com/api/v1/projects".to_string()
            }
        };

        let page: Paginated<Project> = client
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

    for project in all {
        sqlx::query(
            "INSERT INTO projects (
                id, can_assign_tasks, child_order, color,
                creator_uid, created_at, is_archived, is_deleted,
                is_favorite, is_frozen, name_text, updated_at,
                view_style, default_order, description_text, public_key,
                role_text, parent_id, inbox_project, is_collapsed, is_shared
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                can_assign_tasks = excluded.can_assign_tasks,
                child_order = excluded.child_order,
                color = excluded.color,
                creator_uid = excluded.creator_uid,
                created_at = excluded.created_at,
                is_archived = excluded.is_archived,
                is_deleted = excluded.is_deleted,
                is_favorite = excluded.is_favorite,
                is_frozen = excluded.is_frozen,
                name_text = excluded.name_text,
                updated_at = excluded.updated_at,
                view_style = excluded.view_style,
                default_order = excluded.default_order,
                description_text = excluded.description_text,
                public_key = excluded.public_key,
                role_text = excluded.role_text,
                parent_id = excluded.parent_id,
                inbox_project = excluded.inbox_project,
                is_collapsed = excluded.is_collapsed,
                is_shared = excluded.is_shared
            WHERE 
                projects.updated_at IS NULL
                OR excluded.updated_at > projects.updated_at;",
        )
        .bind(&project.id)
        .bind(project.can_assign_tasks)
        .bind(project.child_order)
        .bind(&project.color)
        .bind(&project.creator_uid)
        .bind(&project.created_at)
        .bind(project.is_archived)
        .bind(project.is_deleted)
        .bind(project.is_favorite)
        .bind(project.is_frozen)
        .bind(&project.name)
        .bind(&project.updated_at)
        .bind(&project.view_style)
        .bind(project.default_order)
        .bind(&project.description)
        .bind(&project.public_key)
        .bind(&project.role)
        .bind(&project.parent_id)
        .bind(project.inbox_project)
        .bind(project.is_collapsed)
        .bind(project.is_shared)
        .execute(&sqlite_pool)
        .await?;
    }

    // update sync table
    let now = chrono::Utc::now().to_rfc3339();
    sqlx::query(
        "
        INSERT INTO sync_state (id, last_projects_sync)
        VALUES (1, ?)
        ON CONFLICT(id) DO UPDATE SET last_projects_sync = ?
    ",
    )
    .bind(&now)
    .bind(&now)
    .execute(&sqlite_pool)
    .await?;

    Ok(())
}
