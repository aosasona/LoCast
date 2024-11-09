use chrono::Utc;
use sqlx::{Pool, Sqlite, SqlitePool};
use std::{cmp::max, collections::VecDeque, ops::Deref, sync::Arc, thread::available_parallelism};
use tauri::AppHandle;
use tauri_specta::Event as _;

use crate::{
    queries::{
        item::Item,
        job::Job,
        types::{Action, CreateJobInput, JobStatus, ResourceType},
        Queries,
    },
    sources::types::{Author, SourceType, VideoDetails, VideoImportEvent},
};

// TODO: move all queries to the job query module
pub struct Manager {
    max_concurrent_jobs: u8,

    app: AppHandle,
    db_pool: Arc<SqlitePool>,
    queries: Queries,

    queue: VecDeque<Job>,
}

macro_rules! in_queue {
    ($self:expr, $action:expr, $resource_type:expr, $id:expr) => {
        sqlx::query!(
            r#"
            SELECT id FROM jobs
            WHERE action = ?1
                AND resource_type = ?2
                AND status IN ('queued', 'in_progress')
                AND meta->>'id' = ?3
            "#,
            $action,
            $resource_type,
            $id
        )
        .fetch_optional($self.db_pool.deref())
        .await?
        .is_some()
    };
}

// TODO: emit children events for things like authors
impl Manager {
    pub fn new(db_pool: Arc<Pool<Sqlite>>, app: AppHandle) -> Self {
        let queries = Queries::new(Arc::clone(&db_pool));
        let max_concurrent_jobs = match available_parallelism() {
            Ok(available) => max(available.get() / 2, 2),
            Err(_) => 3,
        };

        Self {
            max_concurrent_jobs: max_concurrent_jobs as u8,
            app,
            db_pool,
            queries,
            queue: VecDeque::new(),
        }
    }

    pub async fn start(&self) {
        // This manager class will hold a channel where it will listen for new jobs to be processed
        // The enqueue method will create a new job and insert it into the database and then send a
        // message to the channel
        //
        // All pending jobs meeting the criteria will also be loaded on startup
        // Maximum number of jobs to be processed concurrently will be configurable via a constant

        // Load all pending jobs

        // Chunk the jobs into groups of max_concurrent_jobs

        // Spawn a new thread to process a maximum of max_concurrent_jobs jobs
    }

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

    pub async fn dequeue(&self, job_id: i64) -> anyhow::Result<()> {
        todo!()
    }

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

        // Before we proceed, we need to ensure that the item has not already been imported and
        // that it is not already in the queue

        // Check for presence in items table
        let item_exists = self
            .queries
            .item
            .find_item_by_source_id(meta.id.deref())
            .await?
            .is_some();
        if item_exists {
            return Err(anyhow::anyhow!("item already exists in the library"));
        }

        // Check in queued jobs
        if in_queue!(self, Action::ImportYtVideo, ResourceType::Item, meta.id) {
            return Err(anyhow::anyhow!("item is already in the queue"));
        }

        author_id = self
            .queries
            .author
            .find_author_id_by_youtube_id(meta.author.as_ref().unwrap().id.deref())
            .await?;

        // Create the item record
        let duration_in_seconds = meta.duration_in_seconds.parse::<i64>()?;
        let item = self
            .queries
            .item
            .create(Item::new(
                meta.title.clone(),
                meta.description.clone().into(),
                meta.category.clone().into(),
                duration_in_seconds,
                SourceType::Youtube,
                meta.id.clone(),
                author_id,
            ))
            .await?;

        let job = CreateJobInput {
            action: Action::ImportYtVideo,
            resource_type: ResourceType::Item,
            resource_id: item.id,
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

        // Verify that the item has not already been queued
        //
        // NOTE: We don't need to check if the author has been imported already here since this job is
        // only created when the author is not found in the database, in the future, this might
        // change though

        if in_queue!(
            self,
            Action::CreateYtAuthor,
            ResourceType::Author,
            author.id
        ) {
            return Err(anyhow::anyhow!("author is already in the queue"));
        }

        let created_author = self
            .queries
            .author
            .create(crate::queries::author::Author::new(
                author.name,
                author.id,
                SourceType::Youtube,
            ))
            .await?;

        // Enqueue a job to download the author's thumbnails
        let job = CreateJobInput {
            action: Action::CreateYtAuthor,
            resource_type: ResourceType::Author,
            resource_id: created_author.id,
            status: JobStatus::Queued,
            meta,
        };

        self.create_job(&job).await
    }

    async fn create_job(&self, job: &CreateJobInput) -> anyhow::Result<Job> {
        self.queries
            .job
            .create(Job::new(
                job.action.clone(),
                job.resource_type,
                job.resource_id,
                job.status.clone(),
                job.meta.clone(),
            ))
            .await
    }
}
