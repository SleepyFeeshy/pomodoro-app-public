use std::ptr::null;
use serde::Serialize;

use chrono::prelude::*;
use sqlx::types::time::OffsetDateTime;
use sqlx::{Pool, Row, Sqlite};
// use sqlx::{postgres::PgPool, sqlite::SqlitePool};
// use std::env;
// use tauri::Manager;
use time::{format_description::well_known::Rfc3339, UtcOffset};
use uuid::Uuid;

use crate::error::MyError;
use crate::util::database_auth::{get_sqlite_pool, get_postgres_pool};

#[derive(Debug, Serialize)]
pub struct LogData {
    id: String,
    finished_at: String, // or chrono::NaiveDate if you want to keep it typed
    duration: f64,
    session_type_id: String
}


// #[tokio::main] // sync unsynced rows
#[tauri::command]
pub async fn sync_databases(app: tauri::AppHandle) -> Result<(), MyError> {
    println!("sync databases called");
    // get sqlite and pg pools
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;
    let pg_pool = match get_postgres_pool(app.clone()).await {
        Ok(pool) => pool,
        Err(error) => {
            eprintln!("Unable to connect to PostgreSQL. Sync skipped: {error:?}");
            return Err(MyError::Offline);
        }
    };
    // let pg_pool = PgPool::connect(supabase_url.as_str()).await?;

    
    // fetch local sqlite database
    let unsynced_rows = sqlx::query(
        "SELECT id, finished_at, duration, synced_at, session_type_id, deleted_at FROM sessions WHERE synced_at IS NULL",
    )
    .fetch_all(&sqlite_pool)
    .await?;

    for row in unsynced_rows {
        // println!("rows fetched");
        let id: String = row.get("id");
        // println!("id: {}", id);
        let uuid: Uuid = Uuid::parse_str(&id)?;
        // println!("uuid fetched");
        let finished_at = OffsetDateTime::parse(row.get("finished_at"), &Rfc3339)?;

        let deleted_at_string: Option<String> = row.get("deleted_at");
        let deleted_at: Option<OffsetDateTime> = deleted_at_string
            .filter(|s| !s.is_empty()) // Filter out empty strings if they exist
            .map(|s| OffsetDateTime::parse(&s, &time::format_description::well_known::Rfc3339))
            .transpose()?; // Propagates parsing errors up if the string was malformed
        
        let duration: f64 = row.get("duration");
        let session_type_id_string: String = row.get("session_type_id");
        let session_type_id: Uuid = Uuid::parse_str(&session_type_id_string)?;
        // let synced_at: Option<String> = row.get("synced_at");

        // let time_now = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        // let time_now = Local::now().to_rfc3339();
        let time_now = OffsetDateTime::parse(&Local::now().to_rfc3339(), &Rfc3339)?;
        // println!("id: {} datetime: {}, time_now: {}", uuid, finished_at, time_now);
        println!("uuid: {}", id);
        println!("datetime: {}", finished_at);
        println!("time_now: {}", time_now);
        // insert row into supabase
        sqlx::query(
            "INSERT INTO sessions 
                (id, duration, finished_at, updated_at, session_type_id, deleted_at) 
            VALUES 
                ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id)
            DO UPDATE SET
                updated_at = EXCLUDED.updated_at,  
                deleted_at = EXCLUDED.deleted_at
            WHERE EXCLUDED.updated_at > sessions.updated_at"
        )
        .bind(&uuid)              // $1
        .bind(&duration)          // $2
        .bind(&finished_at)       // $3
        .bind(&time_now)          // $4
        .bind(&session_type_id)   // $5
        .bind(deleted_at)         // $6
        .execute(&pg_pool)
        .await?;
        println!("row uploaded to supabase");
        // break;

        sqlx::query("UPDATE sessions SET synced_at = ? WHERE id = ? AND synced_at IS NULL")
            .bind(&time_now)
            .bind(&id)
            .execute(&sqlite_pool)
            .await?;
        println!("row synced_now updated");
    }

    // result
    Ok(())
}

// #[tokio::main] // sync unsynced rows
#[tauri::command]
pub async fn sync_db_remote_to_local(app: tauri::AppHandle) -> Result<Vec<LogData>, MyError> {
    println!("sync_db_remote_to_local called");
    // get sqlite and pg pools
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;
    let mut tx = sqlite_pool.begin().await?;

    let mut inserted = Vec::new();
    let pg_pool = get_postgres_pool(app.clone()).await?;
    // println!("supabase connected");

    // fetch remote postgres database
    let remote_rows = sqlx::query(
        "
        SELECT * 
        FROM (
            SELECT *
            from sessions
            ORDER BY finished_at DESC
            LIMIT 60
        ) as recent
        ORDER BY finished_at ASC;
        ",
    )
    .fetch_all(&pg_pool)
    .await?;

    for row in remote_rows {
        // println!("rows fetched");

        let uuid: Uuid = row.get("id");
        // println!("uuid fetched");
        let finished_at: OffsetDateTime = row.get("finished_at");
        let deleted_at: Option<OffsetDateTime> = row.get("deleted_at");
        let updated_at: Option<OffsetDateTime> = row.get("updated_at");
        let duration: f64 = row.get("duration");
        let session_type_uuid: Uuid = row.get("session_type_id");
        // let synced_at: Option<String> = row.get("updated_at");

        let time_now = OffsetDateTime::parse(&Local::now().to_rfc3339(), &Rfc3339)?;
        // println!("id: {} datetime: {}, time_now: {}", uuid, finished_at, time_now);
        // println!("uuid: {}", uuid);
        // println!("datetime: {}", finished_at);
        // println!("time_now: {}", time_now);
        // insert row into supabase

        let finished_at_with_offset = finished_at.to_offset(UtcOffset::current_local_offset()?);
        let finished_at_string =
            OffsetDateTime::parse(&finished_at_with_offset.format(&Rfc3339).unwrap(), &Rfc3339)?;
        // println!("finished_at_string: {}", finished_at_string);

        // let result = sqlx::query(
        //     "INSERT OR IGNORE INTO sessions (id, duration, finished_at, synced_at, session_type_id) 
        //         VALUES ($1, $2, $3, $4, $5)
        //     RETURNING id, duration, finished_at, synced_at, session_type_id",
        // )
        let result = sqlx::query(
            "INSERT INTO sessions 
                (id, duration, finished_at, synced_at, session_type_id, deleted_at, updated_at) 
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id)
            DO UPDATE SET
                duration = EXCLUDED.duration,
                finished_at = EXCLUDED.finished_at,
                synced_at = EXCLUDED.synced_at,
                session_type_id = EXCLUDED.session_type_id,
                updated_at = EXCLUDED.updated_at,
                deleted_at = EXCLUDED.deleted_at
            WHERE sessions.updated_at IS NULL OR EXCLUDED.updated_at > sessions.updated_at
            RETURNING id, duration, finished_at, synced_at, session_type_id",
        )
        .bind(&uuid.to_string())
        .bind(&duration)
        .bind(&finished_at_string)
        .bind(&time_now)
        .bind(&session_type_uuid.to_string())
        .bind(&deleted_at)
        .bind(&updated_at)
        // .execute(&sqlite_pool)
        // .execute(&mut *tx)
        .fetch_optional(&mut *tx)
        .await?;
        // println!("row synced_now updated");

        if let Some(row) = result {
            inserted.push(row);
        }
    }

    tx.commit().await?;
    println!("database remote to local synchronized");
    // Ok(())
    let result = inserted
        .into_iter()
        .map(|row| LogData {
            id: row.get::<String, _>("id"),
            finished_at: row.get::<String, _>("finished_at"),
            duration: row.get::<f64, _>("duration"),
            session_type_id: row.get::<String, _>("session_type_id")
        })
        .collect::<Vec<_>>();
    Ok(result)
}

// impl From<MyError> for tauri::Error {
//     fn from(err: MyError) -> Self {
//         tauri::Error::Api(err.to_string())
//     }
// }
