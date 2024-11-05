use rusty_ytdl::Video;
use tauri::State;

use super::types::{Author, Thumbnail, ThumbnailSet, VideoDetails};
use crate::{cache::Key, queries::types::Action, types::AppState};

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

// Videos are only really imported after they have been processed by the job manager, so here we
// just add the video to the job queue
#[tauri::command]
#[specta::specta]
pub async fn import_video(state: State<'_, AppState>, details: VideoDetails) -> Result<(), String> {
    let serialized_meta = serde_json::to_value(details).map_err(|e| e.to_string())?;

    state
        .job_manager
        .enqueue(Action::ImportYtVideo, Some(serialized_meta))
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
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
