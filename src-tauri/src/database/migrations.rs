use futures_core::future::BoxFuture;
use lazy_static::lazy_static;
use sqlx::{
    migrate::{Migration as SqlxMigration, MigrationSource, MigrationType, Migrator},
    SqlitePool,
};
use thiserror::Error;

#[derive(Clone, Copy, Debug)]
#[allow(dead_code)]
pub(crate) enum MigrationKind {
    Up,
    Down,
}

impl From<MigrationKind> for MigrationType {
    fn from(kind: MigrationKind) -> Self {
        match kind {
            MigrationKind::Up => MigrationType::ReversibleUp,
            MigrationKind::Down => MigrationType::ReversibleDown,
        }
    }
}

#[derive(Debug, Clone)]
pub(crate) struct Migration {
    version: i64,
    name: &'static str,
    sql: &'static str,
    kind: MigrationKind,
}

#[derive(Debug, Clone)]
pub(crate) struct Migrations {
    migrations: Vec<Migration>,
}

impl MigrationSource<'static> for Migrations {
    fn resolve(self) -> BoxFuture<'static, Result<Vec<SqlxMigration>, sqlx::error::BoxDynError>> {
        Box::pin(async move {
            let mut sqlx_migrations = Vec::new();

            for migration in MIGRATIONS.migrations.iter() {
                let sqlx_migration = SqlxMigration::new(
                    migration.version,
                    migration.name.into(),
                    migration.kind.into(),
                    migration.sql.into(),
                    false,
                );
                sqlx_migrations.push(sqlx_migration);
            }

            Ok(sqlx_migrations)
        })
    }
}

// Images are not stored int the database and they are not referenced there either
// Images are stores as <asset_id>/<quality>.<extension> in the filesystem
lazy_static! {
    pub(crate) static ref MIGRATIONS: Migrations = Migrations {
        migrations: vec![
            Migration {
                version: 1,
                name: "create_authors_table",
                sql: "
            CREATE TABLE IF NOT EXISTS `authors` (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                source_type TEXT NOT NULL DEFAULT 'youtube',
                source_id TEXT,
                asset_id TEXT NOT NULL,
                created_at INTEGER NOT NULL DEFAULT (unixepoch()),
                last_updated INTEGER NOT NULL DEFAULT (unixepoch()),
                UNIQUE(asset_id)
            ) STRICT;
            ",
                kind: MigrationKind::Up,
            },
            Migration {
                version: 2,
                name: "create_items_table",
                sql: "
            CREATE TABLE IF NOT EXISTS `items` (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                category TEXT,
                duration_in_seconds INTEGER NOT NULL,
                source_type TEXT NOT NULL,
                source_id TEXT NOT NULL,
                asset_id TEXT NOT NULL,
                created_at INTEGER NOT NULL DEFAULT (unixepoch()),
                last_updated INTEGER NOT NULL DEFAULT (unixepoch()),
                deleted_at INTEGER,
                author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
                UNIQUE(asset_id)
            ) STRICT;
            ",
                kind: MigrationKind::Up,
            },
            Migration {
                version: 3,
                name: "create_jobs_table",
                sql: "
            CREATE TABLE IF NOT EXISTS `jobs` (
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
                name: "create_cache_table",
                sql: "
            CREATE TABLE IF NOT EXISTS `cache` (
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
        ],
    };
}

pub(crate) struct MigrationManager<'a> {
    migrations: Migrations,
    pool: &'a SqlitePool,
}

#[derive(Error, Debug)]
pub(crate) enum MigrationError {
    #[error("Failed to create migration table: {0}")]
    InitializationError(String),

    #[error("Failed to run migrations: {0}")]
    FailedToRunMigrations(String),
}

impl<'a> MigrationManager<'a> {
    pub async fn new(pool: &'a SqlitePool) -> anyhow::Result<Self> {
        Ok(Self {
            pool,
            migrations: MIGRATIONS.clone(),
        })
    }

    pub async fn run(&self) -> anyhow::Result<()> {
        let migrator = Migrator::new(self.migrations.clone()).await.map_err(|e| {
            MigrationError::InitializationError(format!("Failed to create migrator: {}", e))
        })?;

        migrator
            .run(self.pool)
            .await
            .map_err(|e| MigrationError::FailedToRunMigrations(e.to_string()))?;

        log::info!("Migrations ran successfully");

        Ok(())
    }
}
