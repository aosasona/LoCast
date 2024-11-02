use serde::{Deserialize, Serialize};
use specta::Type;

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
