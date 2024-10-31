use serde::{de::DeserializeOwned, Deserialize, Serialize};
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
pub enum JobStatus {
    Queued,
    InProgress,
    Completed,
    Failed,
}

pub struct Job<T>
where
    T: Serialize + DeserializeOwned,
{
    pub id: i64,
    pub action: Action,
    pub resource_type: ResourceType,
    pub resource_id: i64,
    pub status: JobStatus,
    pub meta: Option<T>,
    pub retry_count: i32,
    pub failure_reason: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub last_updated: chrono::NaiveDateTime,
}
