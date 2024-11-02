use chrono::{MappedLocalTime, TimeZone, Utc};
use sqlx::{Pool, Sqlite, SqlitePool};
use std::{ops::Deref, sync::Arc};
use tauri::AppHandle;
use tauri_specta::Event as _;

use super::types::{Action, CreateJobInput, Job, JobStatus, ResourceType};
use crate::{
    queries::Queries,
    sources::types::{Author, SourceType, VideoDetails, VideoImportEvent},
};

// Eventually, we need to move the queries in this module to a separate queries module
pub struct Manager {
    app: AppHandle,
    db_pool: Arc<SqlitePool>,
    queries: Queries,
}

impl Manager {
    pub fn new(db_pool: Arc<Pool<Sqlite>>, app: AppHandle) -> Self {
        let queries = Queries::new(Arc::clone(&db_pool));
        Self {
            app,
            db_pool,
            queries,
        }
    }

    pub async fn start(&self) {}

    pub async fn enqueue(
        &self,
        action: Action,
        meta: Option<serde_json::Value>,
    ) -> anyhow::Result<Job> {
        match action {
            Action::ImportYtVideo => self.create_yt_import_job(meta).await,
            Action::CreateYtAuthor => self.create_yt_author_import_job(meta).await,
        }
    }

    pub async fn dequeue(&self) {}

    async fn create_yt_import_job(&self, meta: Option<serde_json::Value>) -> anyhow::Result<Job> {
        let meta: VideoDetails = match meta {
            Some(meta) => serde_json::from_value(meta)?,
            None => return Err(anyhow::anyhow!("missing metadata for job")),
        };

        // Check if the author has previously been imported and processed
        let mut author_id = match &meta.author {
            None => None,
            Some(author) => {
                self.queries
                    .author
                    .find_author_id_by_youtube_id(author.id.deref())
                    .await?
            }
        };

        // Enqueue a job to create the author if they don't exist already
        if author_id.is_none() {
            let author_meta = serde_json::to_value(meta.author.clone())?;
            Box::pin(self.enqueue(Action::CreateYtAuthor, Some(author_meta))).await?;
        }

        author_id = self
            .queries
            .author
            .find_author_id_by_youtube_id(meta.author.as_ref().unwrap().id.deref())
            .await?;

        // Create the item record
        let asset_id = SourceType::Youtube.generate_asset_id();
        let source_type: String = SourceType::Youtube.into();
        let duration_in_seconds = meta.duration_in_seconds.parse::<i64>()?;
        let resource_id = sqlx::query!(
                r#"
                INSERT INTO items (title, description, category, duration_in_seconds, source_type, source_id, asset_id, author_id)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
                "#,
                meta.title, meta.description, meta.category, duration_in_seconds, source_type, meta.id, asset_id, author_id
            )
            .execute(self.db_pool.deref())
            .await?
            .last_insert_rowid();

        let job = CreateJobInput {
            action: Action::ImportYtVideo,
            resource_type: ResourceType::Item,
            resource_id,
            status: JobStatus::Queued,
            meta: Some(serde_json::to_value(meta.clone())?),
        };

        let created_job = self.create_job(&job).await?;

        VideoImportEvent {
            job_id: created_job.id as i32,
            title: meta.title,
            author_name: meta.author.as_ref().unwrap().name.clone(),
            duration_in_seconds: duration_in_seconds as i32,
            status: JobStatus::Queued,
            created_at: Utc::now().timestamp() as i32,
        }
        .emit(&self.app)?;

        Ok(created_job)
    }

    // Creates a job to download the author's thumbnails and other metadata (including creating the
    // actual author record)
    async fn create_yt_author_import_job(
        &self,
        meta: Option<serde_json::Value>,
    ) -> anyhow::Result<Job> {
        let author: Author = match meta.clone() {
            Some(m) => serde_json::from_value(m)?,
            None => return Err(anyhow::anyhow!("missing metadata for job")),
        };

        // The author needs to exist before we can import a video, so we need to create the author
        // record regardless of whether the job is successful or not
        // Only job required for the author is to actual download the images and store them locally
        let asset_id = SourceType::Youtube.generate_asset_id();
        let source_type: String = SourceType::Youtube.into();
        let resource_id = sqlx::query!(
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
        .await?
        .last_insert_rowid();

        // Enqueue a job to download the author's thumbnails
        let job = CreateJobInput {
            action: Action::CreateYtAuthor,
            resource_type: ResourceType::Author,
            resource_id,
            status: JobStatus::Queued,
            meta,
        };

        self.create_job(&job).await
    }

    async fn create_job(&self, job: &CreateJobInput) -> anyhow::Result<Job> {
        let meta = match &job.meta {
            Some(meta) => Some(serde_json::to_string(&meta)?),
            None => None,
        };

        let job = sqlx::query!(
            r#"INSERT INTO jobs (action, resource_type, resource_id, status, meta) VALUES (?1, ?2, ?3, ?4, ?5) RETURNING *"#,
            job.action, job.resource_type, job.resource_id, job.status, meta
        )
        .fetch_one(self.db_pool.deref())
        .await?;

        let created_at = match Utc.timestamp_opt(job.created_at, 0) {
            MappedLocalTime::Single(t) => t,
            _ => return Err(anyhow::anyhow!("invalid timestamp")),
        };

        let last_updated = match Utc.timestamp_opt(job.last_updated, 0) {
            MappedLocalTime::Single(t) => t,
            _ => return Err(anyhow::anyhow!("invalid timestamp")),
        };

        Ok(Job {
            id: job.id,
            action: job.action.into(),
            resource_type: job.resource_type.into(),
            resource_id: job.resource_id,
            status: job.status.into(),
            meta: job.meta.map(|m| serde_json::from_str(&m)).transpose()?,
            retry_count: job.retry_count,
            failure_reason: job.failure_reason,
            created_at,
            last_updated,
        })
    }
}
