use std::ops::Deref;
use std::sync::Arc;

use chrono::{DateTime, Utc};
use sqlx::SqlitePool;

use crate::queries::types::{Action, JobStatus, ResourceType};

pub struct JobQueries {
    db_pool: Arc<SqlitePool>,
}

#[derive(Debug, sqlx::FromRow)]
pub struct Job {
    pub id: i64,
    pub action: Action,
    pub resource_type: ResourceType,
    pub resource_id: i64,
    pub status: JobStatus,
    pub meta: Option<serde_json::Value>,
    pub retry_count: i64,
    pub failure_reason: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub last_updated: Option<DateTime<Utc>>,
}

impl Job {
    pub fn new(
        action: Action,
        resource_type: ResourceType,
        resource_id: i64,
        status: JobStatus,
        meta: Option<serde_json::Value>,
    ) -> Self {
        Self {
            id: 0,
            action,
            resource_type,
            resource_id,
            status,
            meta,
            retry_count: 0,
            failure_reason: None,
            created_at: None,
            last_updated: None,
        }
    }
}

impl JobQueries {
    pub fn new(db_pool: Arc<SqlitePool>) -> Self {
        Self { db_pool }
    }

    pub async fn create(&self, job: Job) -> anyhow::Result<Job> {
        sqlx::query_as::<_, Job>("INSERT INTO jobs (action, resource_type, resource_id, status, meta) VALUES (?1, ?2, ?3, ?4, ?5) RETURNING *")
            .bind(&job.action)
            .bind(job.resource_type)
            .bind(job.resource_id)
            .bind(&job.status)
            .bind(&job.meta)
            .fetch_one(self.db_pool.deref())
            .await
            .map_err(|e| anyhow::anyhow!("Failed to create job: {}", e))
    }
}
