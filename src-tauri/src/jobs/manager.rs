use sqlx::{Pool, Sqlite, SqlitePool};
use std::{ops::Deref, sync::Arc};

use super::{Action, Job};
use crate::sources::types::VideoDetails;

pub struct JobManager {
    db_pool: Arc<SqlitePool>,
}

impl JobManager {
    pub fn new(db_pool: Arc<Pool<Sqlite>>) -> Self {
        Self { db_pool }
    }

    pub async fn start(&self) {}

    pub async fn enqueue(&self) {}

    pub async fn dequeue(&self) {}

    async fn create_job<T: Serialize + DeserializeOwned>(
        &self,
        job: &Job<T>,
    ) -> anyhow::Result<i64> {
        let mut conn = self.db_pool.acquire().await?;

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
