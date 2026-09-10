use serde::{Deserialize, Serialize};
use crate::error::MyError;
use chrono::prelude::*;
use sqlx::types::time::OffsetDateTime;
use time::{format_description::well_known::Rfc3339, UtcOffset};
use uuid::Uuid;
use sqlx::{Pool, Row, Sqlite};
use tauri::Wry;
use tauri_plugin_store::StoreExt;
use serde_json::json;

// use google_oauth::AsyncClient;
use crate::util::database_auth::{get_sqlite_pool, get_postgres_pool};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};

// for storage
#[derive(Serialize, Deserialize, Debug)]
pub struct LocalUserData {
    id: Option<String>,
    email: Option<String>,
    picture: Option<String>
}

impl Default for LocalUserData {
    fn default() -> Self {
        Self {
            id: None,
            email: None,
            picture: None
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LocalUserToken {
    access_token: Option<String>,
    id_token: Option<String>,
    refresh_token: Option<String>
}

impl Default for LocalUserToken {
    fn default() -> Self {
        Self {
            access_token: None,
            id_token: None,
            refresh_token: None
        }
    }
}



// error types
#[derive(Debug, Clone)]
pub struct TokenNotVerified;

#[derive(Debug, Serialize, Deserialize)]
pub struct GooglePayload {
    // These fields are marked `always`.
    pub aud: String,
    pub exp: u64,
    pub iat: u64,
    pub iss: String,
    pub sub: String,

    // These fields are optional.
    pub at_hash: Option<String>,
    pub azp: Option<String>,
    pub email: Option<String>,
    pub email_verified: Option<bool>,
    pub family_name: Option<String>,
    pub given_name: Option<String>,
    pub hd: Option<String>,
    pub locale: Option<String>,
    pub name: Option<String>,
    pub nonce: Option<String>,
    pub picture: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Profile {
    pub email: String,       
    pub name: String,
    pub picture: String,      
}

pub fn verify_google_jwt_token(payload_json: &GooglePayload) -> Result<(), TokenNotVerified> {
    let client_id = "";
    // VERIFY ID TOKEN
    // Check if aud == client_id
    println!("aud: {}", &payload_json.aud);
    println!("iss: {}", &payload_json.iss);
    println!("exp: {}", &payload_json.exp);

    if (&payload_json.aud == client_id) {
        println!("aud == client_id ");
    } else {
        return Err(TokenNotVerified)
    }
    // Check if iss == accounts.google.com
    if (&payload_json.iss == "accounts.google.com" || &payload_json.iss == "https://accounts.google.com") {
        println!("ISS valid");
    } else {
        return Err(TokenNotVerified)
    }

    // Check if token is expired
    let time_now = Local::now().timestamp();
    let signed_exp = payload_json.exp as i64;
    if (signed_exp > time_now) {
        println!("not expired yet")
    } else {
        return Err(TokenNotVerified)
    }
    Ok(())
}

pub fn decode_jwt_token(id_token: &String) -> GooglePayload {
    let client_id = "";
    // 1. split id tokens
    let id_token_parts = id_token.split(".");
    let collection = &id_token_parts.collect::<Vec<&str>>();

    let header = match URL_SAFE_NO_PAD.decode(collection[0]) {
        Ok(string) => String::from_utf8(string),
        Err(e) => panic!("{}", e),
    };

    let payload_str = match URL_SAFE_NO_PAD.decode(collection[1]) {
        Ok(string) => String::from_utf8(string),
        Err(e) => panic!("{}", e),
    };

    let payload_json: GooglePayload = serde_json::from_str(&payload_str.expect("")).expect("");

    // VERIFY ID TOKEN
    return payload_json
}

#[tauri::command]
pub async fn sign_in_or_create_user(app: tauri::AppHandle, id_token: String) -> Result<Profile, MyError> {
    let sqlite_pool: Pool<Sqlite> = get_sqlite_pool(app.clone()).await?;
    let time_now = OffsetDateTime::parse(&Local::now().to_rfc3339(), &Rfc3339)?;

     // 1. split id tokens
    let id_token_parts = id_token.split(".");
    let collection = &id_token_parts.collect::<Vec<&str>>();

    let payload_json: GooglePayload = decode_jwt_token(&id_token);
    // let signature = String::from_utf8(URL_SAFE.decode(collection[2])?)?;

    // println!("payload_json: {}", serde_json::to_string_pretty(&payload_json)?);
    // Verify user TODO: THROW ERROR IF NOT VERIFIED
    match verify_google_jwt_token(&payload_json) {
        Ok(val) => val,
        Err(error) => panic!("Token Not Verified")
    }

    let mut user_profile = Profile {email: String::new(), name: String::new(), picture: String::new()};
    if payload_json.email.is_some() {
        user_profile = Profile {
            email: payload_json.email.expect(""),
            name: payload_json.name.expect(""),
            picture: payload_json.picture.expect("")
        };
    }
    
    // check if user exists on database
    // fetch user from db to check if user exists   
    let user = sqlx::query(
        "
        SELECT 
            *
        FROM users
        WHERE email = $1",
    )
    .bind(&user_profile.email)
    .fetch_optional(&sqlite_pool) // Use fetch_one to get the row
    .await?;

    // if user exists, return 
    if user.is_some() {
        return Ok(user_profile)
    } else {// if no user, create user 
        // make user
        let new_user_uuid: Uuid = Uuid::new_v4();
        let new_user_uuid_string = new_user_uuid.to_string();
        let new_user = sqlx::query(
        "
        INSERT INTO users (id, name, email, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        ",
        )
        .bind(&new_user_uuid_string)           // $1
        .bind(&user_profile.name)       // $2
        .bind(&user_profile.email)      // $3
        .bind(&time_now)                // $4
        .bind(&time_now)                // $5
        .fetch_one(&sqlite_pool)
        .await?;
    }

    Ok(user_profile)
}