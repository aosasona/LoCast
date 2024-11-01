use rusty_ytdl::Video;
use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::State;

use crate::{cache::Key, types::AppState};

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

#[tauri::command]
#[specta::specta]
pub async fn get_video_info(id: &str, state: State<'_, AppState>) -> Result<VideoDetails, String> {
    let video = Video::new(id).map_err(|e| {
        log::error!("error while fetching video: {}", e);
        String::from("Failed to fetch video")
    })?;

    if let Some(info) = state
        .cache
        .get::<VideoDetails>(Key::YoutubeVideoInfo(id.to_string()))
        .await
    {
        log::info!("cache hit for video {}", id);
        return Ok(info.value);
    }

    let mut info = video
        .get_basic_info()
        .await
        .map_err(|e| {
            log::error!("error while fetching video info: {}", e);
            e.to_string()
        })?
        .video_details;

    let mut author: Option<Author> = None;
    if let Some(mut au) = info.author {
        author = Some(Author {
            id: au.id,
            name: au.name,
            thumbnails: extract_thumbnails(&mut au.thumbnails),
            url: au.channel_url,
        });
    }

    let video_info = VideoDetails {
        id: info.video_id,
        title: info.title,
        description: info.description,
        url: info.video_url,
        thumbnails: extract_thumbnails(&mut info.thumbnails),
        author,
        view_count: info.view_count,
        category: info.category,
        duration_in_seconds: info.length_seconds,
        publish_date: info.publish_date,
    };

    match state
        .cache
        .set(Key::YoutubeVideoInfo(id.to_string()), video_info.clone())
        .await
    {
        Ok(_) => log::info!("cached video info for {}", id),
        Err(e) => log::error!("failed to cache video info: {}", e),
    }

    Ok(video_info)
}

// Extract the small, medium, and standard thumbnails from the list of thumbnails
fn extract_thumbnails(thumbnails: &mut [rusty_ytdl::Thumbnail]) -> Option<ThumbnailSet> {
    if thumbnails.is_empty() {
        return None;
    }

    thumbnails.sort_by(|a, b| a.width.cmp(&b.width));

    let small = thumbnails.first().unwrap().clone();
    let standard = thumbnails.last().unwrap().clone();
    let mut medium = standard.clone();

    if thumbnails.len() > 2 {
        let mid = thumbnails.len() / 2;
        medium = thumbnails.get(mid).unwrap().clone();
    }

    Some(ThumbnailSet {
        small: Thumbnail {
            url: small.url.clone(),
            width: small.width as i32,
            height: small.height as i32,
        },
        medium: Thumbnail {
            url: medium.url.clone(),
            width: medium.width as i32,
            height: medium.height as i32,
        },
        standard: Thumbnail {
            url: standard.url.clone(),
            width: standard.width as i32,
            height: standard.height as i32,
        },
    })
}
