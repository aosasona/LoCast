use sqlx::sqlite::SqlitePool;
use tauri_plugin_sql::{Migration, MigrationKind};

pub async fn make_pool() -> Result<SqlitePool, String> {
    SqlitePool::connect("sqlite:locast.db")
        .await
        .map_err(|e| e.to_string())
}

// Images are not stored int the database and they are not referenced there either
// Images are stores as <asset_id>/<quality>.<extension> in the filesystem
pub(crate) fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_authors_table",
            sql: "
        CREATE TABLE `authors` (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            source_url TEXT NOT NULL,
            asset_id TEXT NOT NULL,
            created_at INTEGER NOT NULL DEFAULT (unixepoch()),
            last_updated INTEGER NOT NULL DEFAULT (unixepoch())
        ) STRICT;
        ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_items_table",
            sql: "
        CREATE TABLE `items` (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT,
            duration_in_seconds INTEGER NOT NULL,
            source_url TEXT NOT NULL,
            source_type TEXT NOT NULL,
            source_id TEXT NOT NULL,
            asset_id TEXT NOT NULL,
            created_at INTEGER NOT NULL DEFAULT (unixepoch()),
            last_updated INTEGER NOT NULL DEFAULT (unixepoch()),
            deleted_at INTEGER,
            author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL
        ) STRICT;
        ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_jobs_table",
            sql: "
        CREATE TABLE `jobs` (
            id INTEGER PRIMARY KEY,
            action TEXT NOT NULL, -- describes the action to be taken (e.g. download, transcribe etc.)
            resource_type TEXT NOT NULL,
            resource_id INTEGER NOT NULL,
            status TEXT NOT NULL, -- pending, in_progress, completed, failed
            meta TEXT, -- JSON object containing additional information about the job
            retry_count INTEGER NOT NULL DEFAULT 0,
            failure_reason TEXT,
            created_at INTEGER NOT NULL DEFAULT (unixepoch()),
            last_updated INTEGER NOT NULL DEFAULT (unixepoch())
        ) STRICT;
        ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_cache_table",
            sql: "
        CREATE TABLE `cache` (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 1,
            created_at INTEGER NOT NULL DEFAULT (unixepoch()),
            last_updated INTEGER NOT NULL DEFAULT (unixepoch()),
            UNIQUE(key, version),
            CHECK (version > 0)
        ) STRICT;
        ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "add_source_id_to_authors",
            sql: "ALTER TABLE authors ADD COLUMN source_id TEXT;",
            kind: MigrationKind::Up,
        }
    ]
}
