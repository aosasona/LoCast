use serde::{de::DeserializeOwned, Serialize};
use sqlx::{Pool, Sqlite};

use super::Job;

pub struct JobManager {
    db_pool: Pool<Sqlite>,
}

impl JobManager {
    pub fn new(db_pool: Pool<Sqlite>) -> Self {
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

        let meta = match &job.meta {
            Some(meta) => Some(serde_json::to_string(&meta)?),
            None => None,
        };

        let id = sqlx::query!(
            r#"
        INSERT INTO jobs (action, resource_type, resource_id, status, meta) VALUES (?1, ?2, ?3, ?4, ?5)
        "#,
            job.action,
            job.resource_type,
            job.resource_id,
            job.status,
            meta,
        )
        .execute(&mut *conn).await?.last_insert_rowid();

        Ok(id)
    }
}
