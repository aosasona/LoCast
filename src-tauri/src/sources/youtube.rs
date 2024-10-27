use rusty_ytdl::Video;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct VideoInfo<'a> {
    title: &'a str,
    description: &'a str,
    thumbnail: &'a str,
    duration: u64,
}

#[tauri::command]
pub async fn get_video_info(id: &str) -> Result<VideoInfo, String> {
    let video = Video::new(id).map_err(|e| {
        log::error!("error while fetching video: {}", e);
        e.to_string()
    })?;

    todo!();
}
