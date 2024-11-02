use serde::{Deserialize, Serialize};
use sqlx::Type;

#[derive(Clone, Serialize, Deserialize, Type)]
#[serde(rename_all = "snake_case")]
pub enum Action {
    ImportYtVideo,
    CreateAuthor,
}

#[derive(Clone, Copy, Serialize, Deserialize, Type)]
#[serde(rename_all = "snake_case")]
pub enum ResourceType {
    Author,
    Video,
}

#[derive(Serialize, Deserialize, Clone, Type)]
#[serde(rename_all = "snake_case")]
pub enum JobStatus {
    Queued,
    InProgress,
    Completed,
    Failed,
}

pub struct Job {
    pub id: i64,
    pub action: Action,
    pub resource_type: ResourceType,
    pub resource_id: i64,
    pub status: JobStatus,
    pub meta: Option<serde_json::Value>,
    pub retry_count: i32,
    pub failure_reason: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub last_updated: chrono::NaiveDateTime,
}
