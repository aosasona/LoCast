mod migrations;

use std::path::{Path, PathBuf};

use migrations::MigrationManager;
use sqlx::sqlite::SqlitePool;
use tauri::Manager as _;
use thiserror::Error;

const DATABASE_FILE: &str = "locast.db";

#[derive(Error, Debug)]
enum DatabaseError {
    #[error("Failed to initialize database pool: {0}")]
    PoolInitializationError(String),

    #[error("Failed to run migrations: {0}")]
    MigrationError(#[from] anyhow::Error),

    #[error("Failed to get app data directory: {0}")]
    FailedToGetAppDataDir(String),

    #[error("Failed to create database directory: {0}")]
    FailedToCreateDatabaseDir(String),

    #[error("Failed to create database file: {0}")]
    FailedToCreateDatabaseFile(String),

    #[error("Unable to get database directory parent: {0}")]
    UnableToGetDbDirParent(String),
}

pub async fn init(app: &tauri::AppHandle) -> anyhow::Result<SqlitePool> {
    log::trace!("Initializing database pool");

    // Initialize database file
    let db_path = get_database_path(app)?;
    log::debug!("Database path: {:?}", db_path);

    // Ensure the actual database file exists
    ensure_database_dir_exists(&db_path)?;
    ensure_database_file_exists(&db_path)?;

    let pool = SqlitePool::connect(format!("sqlite:{}", db_path.to_string_lossy()).as_str())
        .await
        .map_err(|e| DatabaseError::PoolInitializationError(e.to_string()))?;

    // Run migrations
    let migrations = MigrationManager::new(&pool).await?;
    migrations
        .run()
        .await
        .map_err(DatabaseError::MigrationError)?;

    Ok(pool)
}

fn get_database_path(app: &tauri::AppHandle) -> anyhow::Result<PathBuf> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| DatabaseError::FailedToGetAppDataDir(e.to_string()))?;
    Ok(app_data_dir.join(DATABASE_FILE))
}

// Create the database directory if it does not exist
fn ensure_database_dir_exists(db_path: &Path) -> anyhow::Result<()> {
    let db_dir = db_path
        .parent()
        .ok_or("Invalid database path")
        .map_err(|e| DatabaseError::UnableToGetDbDirParent(e.to_string()))?;

    if !db_dir.exists() {
        std::fs::create_dir_all(db_dir)
            .map_err(|e| DatabaseError::FailedToCreateDatabaseDir(e.to_string()))?;
    }

    Ok(())
}

// Create the database file if it does not exist
fn ensure_database_file_exists(db_path: &Path) -> anyhow::Result<()> {
    if !db_path.exists() {
        std::fs::File::create(db_path)
            .map_err(|e| DatabaseError::FailedToCreateDatabaseFile(e.to_string()))?;
    }

    Ok(())
}
