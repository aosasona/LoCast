use sqlx::{Pool, Sqlite, SqlitePool};
use std::{ops::Deref, sync::Arc};

use super::{Action, Job};
use crate::sources::types::{Author, SourceType, VideoDetails};

pub struct JobManager {
    db_pool: Arc<SqlitePool>,
}

impl JobManager {
    pub fn new(db_pool: Arc<Pool<Sqlite>>) -> Self {
        Self { db_pool }
    }

    pub async fn start(&self) {}

    pub async fn enqueue(
        &self,
        action: Action,
        meta: Option<serde_json::Value>,
    ) -> anyhow::Result<i64> {
        match action {
            Action::ImportYtVideo => self.create_yt_import_job(meta).await,
            Action::CreateAuthor => self.create_yt_author_import_job(meta).await,
        }
    }

    pub async fn dequeue(&self) {}

    async fn create_yt_import_job(&self, meta: Option<serde_json::Value>) -> anyhow::Result<i64> {
        let meta: VideoDetails = match meta {
            Some(meta) => serde_json::from_value(meta)?,
            None => return Err(anyhow::anyhow!("missing metadata for job")),
        };

        // Check if the author has previously been imported and processed
        let author_exists = match &meta.author {
            None => false,
            Some(author) => self.author_exists(author.id.deref()).await?,
        };

        // Enqueue a job to create the author if they don't exist already
        if !author_exists {
            let author_meta = serde_json::to_value(meta.author)?;
            Box::pin(self.enqueue(Action::CreateAuthor, Some(author_meta))).await?;
        }

        todo!()
    }

    async fn author_exists(&self, author_yt_id: &str) -> anyhow::Result<bool> {
        sqlx::query!(
            r#"
            SELECT a.id FROM authors a INNER JOIN jobs j ON j.resource_id = a.id
            WHERE a.source_id = ?1 AND j.action = 'create_author' AND j.status = 'completed'
            "#,
            author_yt_id
        )
        .fetch_optional(self.db_pool.deref())
        .await
        .map(|row| row.is_some())
        .map_err(Into::into)
    }

    async fn create_yt_author_import_job(
        &self,
        meta: Option<serde_json::Value>,
    ) -> anyhow::Result<i64> {
        let author: Author = match meta {
            Some(meta) => serde_json::from_value(meta)?,
            None => return Err(anyhow::anyhow!("missing metadata for job")),
        };

        // The author needs to exist before we can import a video, so we need to create the author
        // record regardless of whether the job is successful or not
        // Only job required for the author is to actual download the images and store them locally
        let asset_id = SourceType::Youtube.generate_asset_id();
        let source_type: String = SourceType::Youtube.into();
        sqlx::query!(
            r#"
            INSERT INTO authors (name, source_id, source_type, asset_id)
            VALUES (?1, ?2, ?3, ?4)
            "#,
            author.name,
            author.id,
            source_type,
            asset_id
        )
        .execute(self.db_pool.deref())
        .await?;

        todo!()
    }

    async fn create_job(&self, job: &Job) -> anyhow::Result<i64> {
        let meta = match &job.meta {
            Some(meta) => Some(serde_json::to_string(&meta)?),
            None => None,
        };

        let id = sqlx::query!(
            r#"INSERT INTO jobs (action, resource_type, resource_id, status, meta) VALUES (?1, ?2, ?3, ?4, ?5)"#,
            job.action, job.resource_type, job.resource_id, job.status, meta
        )
        .execute(self.db_pool.deref()).await?.last_insert_rowid();

        Ok(id)
    }
}
