use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::Type;

#[derive(Clone, Serialize, Deserialize, Type)]
#[sqlx(rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum Action {
    ImportYtVideo,
    CreateYtAuthor,
}

impl From<String> for Action {
    fn from(val: String) -> Self {
        match val.as_str() {
            "import_yt_video" => Action::ImportYtVideo,
            "create_yt_author" => Action::CreateYtAuthor,
            _ => panic!("Invalid action type"),
        }
    }
}

#[derive(Clone, Copy, Serialize, Deserialize, Type)]
#[sqlx(rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum ResourceType {
    Author,
    Item,
}

impl From<String> for ResourceType {
    fn from(val: String) -> Self {
        match val.as_str() {
            "author" => ResourceType::Author,
            "item" => ResourceType::Item,
            _ => panic!("Invalid resource type"),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Type, specta::Type)]
#[sqlx(rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum JobStatus {
    Queued,
    InProgress,
    Completed,
    Failed,
    Cancelled,
}

impl From<String> for JobStatus {
    fn from(val: String) -> Self {
        match val.as_str() {
            "queued" => JobStatus::Queued,
            "in_progress" => JobStatus::InProgress,
            "completed" => JobStatus::Completed,
            "failed" => JobStatus::Failed,
            _ => panic!("Invalid job status"),
        }
    }
}

#[derive(Clone, Serialize, Deserialize, Type)]
pub struct Job {
    pub id: i64,
    pub action: Action,
    pub resource_type: ResourceType,
    pub resource_id: i64,
    pub status: JobStatus,
    pub meta: Option<serde_json::Value>,
    pub retry_count: i64,
    pub failure_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub last_updated: DateTime<Utc>,
}

pub struct CreateJobInput {
    pub action: Action,
    pub resource_type: ResourceType,
    pub resource_id: i64,
    pub status: JobStatus,
    pub meta: Option<serde_json::Value>,
}
