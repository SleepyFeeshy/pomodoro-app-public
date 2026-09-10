use crate::error::MyError;
use sqlx::{Pool, Sqlite, FromRow};
use uuid::Uuid;
use serde::{Serialize, Deserialize};
use time::{format_description::well_known::Rfc3339};
use sqlx::types::time::OffsetDateTime;
use chrono::prelude::*;

use crate::util::database_auth::{get_sqlite_pool, get_postgres_pool};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Session {
    pub id: String,             
    pub finished_at: String,
    pub duration: f64,
    pub synced_at: String,
    pub session_type_id: String
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct NewSession {
    pub id: String,             
    pub finished_at: String,
    pub duration: f64,
    pub session_type_id: String,
    pub session_type: String
}


#[tauri::command]
pub async fn create_log(
    app: tauri::AppHandle,
    id: String,
    timestamp: String,
    duration: i64,
    session_type_id: String
) -> Result<NewSession, MyError> {
    println!("get data called");
    // get sqlite db pool
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;

    // create log local sqlite database
    let new_log = sqlx::query_as::<_, NewSession>(
        "
        INSERT INTO sessions (id, finished_at, duration, session_type_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING 
            *, 
            (SELECT label FROM session_types WHERE id = $4) AS session_type",
    )
    .bind(&id)
    .bind(&timestamp)
    .bind(&duration)
    .bind(&session_type_id)
    // .execute(&sqlite_pool)
    .fetch_one(&sqlite_pool) // Use fetch_one to get the row
    .await?;

    // upload_log_to_remote(app.clone(), &new_log).await?;

    Ok(new_log)
}


#[tauri::command]
pub async fn upload_log_to_remote(app: tauri::AppHandle, new_log: NewSession) -> Result<(), MyError> {
    println!("get data called");
    // get sqlite db pool
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;
    let pg_pool = get_postgres_pool(app.clone()).await?;
    let time_now = OffsetDateTime::parse(&Local::now().to_rfc3339(), &Rfc3339)?;

    // put data into pgsql format
    let uuid: Uuid = Uuid::parse_str(&new_log.id)?;
    // println!("uuid fetched");
    let finished_at = OffsetDateTime::parse(&new_log.finished_at, &Rfc3339)?;
    let duration_pgsql: f64 = new_log.duration as f64;
    // let session_type_id_string: String = row.get("session_type_id");
    // let session_type_id: Uuid = Uuid::parse_str(&session_type_id_string)?;

    // create log local sqlite database
    let uploaded_log = sqlx::query_as::<_, NewSession>(
        "
        INSERT INTO sessions (id, finished_at, duration, session_type_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING 
            *, 
            (SELECT label FROM session_types WHERE id = $4) AS session_type",
    )
    .bind(&uuid)
    .bind(&finished_at)
    .bind(&duration_pgsql)
    .bind(&new_log.session_type_id)
    // .execute(&sqlite_pool)
    .fetch_one(&pg_pool) // Use fetch_one to get the row
    .await?;

    // set log to synced in local db
    sqlx::query("UPDATE sessions SET synced_at = $1 WHERE id = $2 AND synced_at IS NULL")
        .bind(&time_now) // $1
        .bind(&new_log.id) // $2
        .execute(&sqlite_pool)
        .await?;
    println!("row synced_now updated");

    Ok(())
}


#[tauri::command]
pub async fn delete_log(app: tauri::AppHandle, id: String) -> Result<(), MyError> {
    println!("get data called");
    // get sqlite and pg pools
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;
    let pg_pool = get_postgres_pool(app.clone()).await?;
    let time_now = OffsetDateTime::parse(&Local::now().to_rfc3339(), &Rfc3339)?;

    // delete log local sqlite database
    sqlx::query(
        "
        UPDATE sessions
        SET 
            deleted_at = $1,
            updated_at = $2,
            synced_at = NULL
        WHERE id = $3",
    )
    .bind(&time_now) // $1
    .bind(&time_now) // $2
    .bind(&id)       // $3
    .execute(&sqlite_pool)
    .await?;

    let uuid: Uuid = Uuid::parse_str(&id)?;

    // delete from postgresql
    sqlx::query(
        "
        UPDATE sessions
        SET deleted_at = $1
        WHERE id = $2",
    )
    .bind(&time_now) // $1
    .bind(&uuid)    // $2
    .execute(&pg_pool)
    .await?;
    Ok(())
}
