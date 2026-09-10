use crate::error::MyError;
use sqlx::{postgres::PgPool, sqlite::SqlitePool};
use tauri::Manager;
use sqlx::{Sqlite, Pool, Postgres};

pub struct AppData {
  pub pg_pool: Option<Pool<Postgres>>,
}

pub static TODOIST_KEY: &str = "";

pub async fn get_sqlite_pool(app: tauri::AppHandle) -> Result<Pool<Sqlite>, MyError> {
    // get sqlite db url
    let app_dir = app.path().app_data_dir().unwrap();
    let db_path = app_dir
        .join("pomodorodatabase_public.db")
        .to_string_lossy()
        .to_string();

    println!("{}", db_path.as_str());
    let sqlite_pool = SqlitePool::connect(db_path.as_str()).await?;
    Ok(sqlite_pool)
}

pub async fn get_postgres_pool(app: tauri::AppHandle) -> Result<Pool<Postgres>, MyError> {
    // let data = app.state::<AppData>();
    // match data.pg_pool.clone() {
    //     Some(pool) => Ok(pool),
    //     None => Err(MyError::Offline),
    // }
    Err(MyError::Offline)
}