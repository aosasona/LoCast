use serde::{Deserialize, Serialize};
use specta::Type;
use tauri_specta::Event;

#[derive(Clone, Debug, Serialize, Deserialize, Type, sqlx::Type)]
#[sqlx(rename_all = "snake_case")]
pub enum SourceType {
    Youtube,
}

impl From<SourceType> for String {
    fn from(val: SourceType) -> Self {
        match val {
            SourceType::Youtube => "youtube".to_string(),
        }
    }
}

impl From<String> for SourceType {
    fn from(val: String) -> Self {
        match val.as_str() {
            "youtube" => SourceType::Youtube,
            _ => panic!("Invalid source type"),
        }
    }
}

impl SourceType {
    pub fn generate_asset_id(&self) -> String {
        match self {
            SourceType::Youtube => format!("yt:{}", nanoid::nanoid!(12, &nanoid::alphabet::SAFE)),
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
pub struct Thumbnail {
    pub url: String,
    pub width: i32,
    pub height: i32,
}

// We will only store the small and standard thumbnails for now (previews and actual display)
#[derive(Clone, Debug, Serialize, Deserialize, Type)]
pub struct ThumbnailSet {
    pub small: Thumbnail,
    pub medium: Thumbnail,
    pub standard: Thumbnail,
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
pub struct Author {
    pub id: String,
    pub name: String,
    pub thumbnails: Option<ThumbnailSet>,
    pub url: String,
}

#[derive(Clone, Debug, Serialize, Deserialize, Type)]
pub struct VideoDetails {
    pub id: String,
    pub title: String,
    pub description: String,
    pub thumbnails: Option<ThumbnailSet>,
    pub url: String,
    pub category: String,
    pub duration_in_seconds: String,
    pub view_count: String,
    pub author: Option<Author>,
    pub publish_date: String,
}

#[derive(Serialize, Deserialize, Clone, Type, Event)]
pub struct VideoImportEvent {
    pub job_id: i32,
    pub title: String,
    pub author_name: String,
    pub duration_in_seconds: i32,
    pub status: crate::jobs::types::JobStatus,
    pub created_at: i32,
}
