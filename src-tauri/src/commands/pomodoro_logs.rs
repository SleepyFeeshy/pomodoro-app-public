use crate::error::MyError;
use serde::Serialize;
use sqlx::{Pool, Row, Sqlite};
use tauri::Manager;

use crate::util::database_auth::{get_sqlite_pool};

#[derive(Debug, Serialize)]
pub struct SessionCountByDate {
    date: String, // or chrono::NaiveDate if you want to keep it typed
    value: i64,
}

#[derive(Debug, Serialize)]
pub struct SessionCountByHour {
    date: String, // or chrono::NaiveDate if you want to keep it typed
    time: String,
    hour: String,
}

#[derive(Debug, Serialize)]
pub struct LogData {
    id: String,
    finished_at: String, // or chrono::NaiveDate if you want to keep it typed
    duration: f64,
    session_type: String
}

#[derive(Debug, Serialize)]
pub struct WeeklyHeatmapPoint {
    day_of_week: i32, // 0 (Sunday) to 6 (Saturday)
    hour: i32,        // 0 to 23
    count: i64,       // Number of sessions in that slot
}

// #[tokio::main] // sync unsynced rows
#[tauri::command]
pub async fn get_data(app: tauri::AppHandle) -> Result<Vec<SessionCountByDate>, MyError> {
    println!("get data called");
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;

    // fetch local sqlite database
    let rows = sqlx::query(
        "
        SELECT 
            DATE(s.finished_at, 'localtime') AS date, 
            COUNT(*) AS value,
            s.deleted_at
        FROM sessions s
        JOIN session_types t ON s.session_type_id = t.id
        WHERE s.session_type_id = '550e8400-e29b-41d4-a716-446655440000'
            AND s.deleted_at IS NULL
        GROUP BY date
        ORDER BY date;
        ",
    )
    .fetch_all(&sqlite_pool)
    .await?;

    let result = rows
        .into_iter()
        .map(|row| SessionCountByDate {
            date: row.get::<String, _>("date"),
            value: row.get::<i64, _>("value"),
        })
        .collect::<Vec<_>>();
    // result
    Ok(result)
}

#[tauri::command]
pub async fn get_data_today(app: tauri::AppHandle) -> Result<Vec<SessionCountByHour>, MyError> {
    println!("get data called");
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;

    // fetch local sqlite database
    let rows = sqlx::query(
        "
        SELECT
          DATETIME(finished_at, 'localtime') AS date,
          STRFTIME('%H:%M:%S', DATETIME(finished_at, 'localtime')) AS time, 
          STRFTIME('%H', DATETIME(finished_at, 'localtime')) as hour,
          s.deleted_at
        FROM sessions s
        JOIN session_types t ON s.session_type_id = t.id
        WHERE DATE(finished_at, 'localtime') = DATE('now', 'localtime')
            AND s.session_type_id = '550e8400-e29b-41d4-a716-446655440000'
            AND s.deleted_at IS NULL",
    )
    .fetch_all(&sqlite_pool)
    .await?;

    let result = rows
        .into_iter()
        .map(|row| SessionCountByHour {
            date: row.get::<String, _>("date"),
            time: row.get::<String, _>("time"),
            hour: row.get::<String, _>("hour"),
        })
        .collect::<Vec<_>>();
    // result
    Ok(result)
}

#[tauri::command]
pub async fn get_data_past_three_days(
    app: tauri::AppHandle,
) -> Result<Vec<SessionCountByHour>, MyError> {
    println!("get data called");
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;

    // fetch local sqlite database
    let rows = sqlx::query(
        "
        SELECT 
          DATETIME(finished_at, '+8 hours') AS datetime,
          DATE(DATETIME(finished_at, '+8 hours')) AS date,
          STRFTIME('%H:%M:%S', DATETIME(finished_at, '+8 hours')) AS time, 
          STRFTIME('%H', DATETIME(finished_at, '+8 hours')) as hour,
          s.deleted_at
        FROM sessions s
        JOIN session_types t ON s.session_type_id = t.id
        WHERE DATE(finished_at, '+8 hours') >= DATE('now', '-2 days', 'localtime')
        AND DATE(finished_at, '+8 hours') <= DATE('now', 'localtime')
        AND s.session_type_id = '550e8400-e29b-41d4-a716-446655440000'
        AND s.deleted_at IS NULL",
    )
    .fetch_all(&sqlite_pool)
    .await?;

    let result = rows
        .into_iter()
        .map(|row| SessionCountByHour {
            date: row.get::<String, _>("date"),
            time: row.get::<String, _>("time"),
            hour: row.get::<String, _>("hour"),
        })
        .collect::<Vec<_>>();
    // result
    Ok(result)
}

// #[tokio::main] // sync unsynced rows
#[tauri::command]
pub async fn get_data_for_logs(app: tauri::AppHandle) -> Result<Vec<LogData>, MyError> {
    println!("get data called");
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;

    // fetch local sqlite database
    let rows = sqlx::query(
        "
        SELECT 
            s.id,
            DATETIME(s.finished_at, '+8 hours') AS finished_at,
            s.duration,
            t.label AS session_type,
            s.deleted_at
        FROM sessions s
        JOIN session_types t ON s.session_type_id = t.id
        WHERE s.deleted_at IS NULL
        ORDER BY finished_at DESC
        LIMIT 50
        ",
    )
    .fetch_all(&sqlite_pool)
    .await?;

    let result = rows
        .into_iter()
        .map(|row| LogData {
            id: row.get::<String, _>("id"),
            finished_at: row.get::<String, _>("finished_at"),
            duration: row.get::<f64, _>("duration"),
            session_type: row.get::<String, _>("session_type")
        })
        .collect::<Vec<_>>();
    // result
    Ok(result)
}

#[tauri::command]
pub async fn get_weekly_heatmap(app: tauri::AppHandle) -> Result<Vec<WeeklyHeatmapPoint>, MyError> {
    let sqlite_pool = get_sqlite_pool(app).await?;

    // %w: day of week (0-6, Sunday is 0)
    // %H: hour (00-23)
    let rows = sqlx::query(
        "
        SELECT 
            CAST(STRFTIME('%w', finished_at, 'localtime') AS INTEGER) as day_of_week,
            CAST(STRFTIME('%H', finished_at, 'localtime') AS INTEGER) as hour,
            COUNT(*) as count
        FROM sessions
        WHERE DATE(finished_at, '+8 hours') >= DATE('now', '-6 days', 'localtime')
			AND session_type_id = '550e8400-e29b-41d4-a716-446655440000'
        GROUP BY day_of_week, hour
        ORDER BY day_of_week, hour
        "
    )
    .fetch_all(&sqlite_pool)
    .await?;

    let result = rows
        .into_iter()
        .map(|row| WeeklyHeatmapPoint {
            day_of_week: row.get("day_of_week"),
            hour: row.get("hour"),
            count: row.get("count"),
        })
        .collect();

    Ok(result)
}