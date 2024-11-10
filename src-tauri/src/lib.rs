mod cache;
mod database;
mod jobs;
mod queries;
mod sources;

use cache::DbCache;
use sources::youtube;
use specta::export::{self};
use sqlx::{Pool, Sqlite};
use std::sync::Arc;
use tauri::{AppHandle, Manager};

pub struct AppState {
    pub db_pool: Arc<Pool<Sqlite>>,
    pub job_manager: Arc<jobs::Manager>,
    pub cache: DbCache,
    pub queries: queries::Queries,
}

async fn setup(app: &AppHandle) {
    let db_pool = match database::make_pool().await {
        Ok(pool) => pool,
        Err(e) => {
            log::error!("Failed to initialize database pool: {}", e);
            return;
        }
    };

    let arc_pool = Arc::new(db_pool);

    let job_manager = Arc::new(jobs::Manager::new(arc_pool.clone()));

    let app_state = AppState {
        job_manager: Arc::clone(&job_manager),
        cache: DbCache::new(Arc::clone(&arc_pool)),
        db_pool: Arc::clone(&arc_pool),
        queries: queries::Queries::new(Arc::clone(&arc_pool)),
    };
    app.manage(app_state);

    job_manager.start().await;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(debug_assertions)]
    #[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
    export::ts("../src/lib/tauri/types.ts").expect("Failed to export typescript types");

    tauri::Builder::default()
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                setup(app.handle()).await;
            });

            Ok(())
        })
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_prevent_default::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:locast.db", database::get_migrations())
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            youtube::get_video_info,
            youtube::import_video
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
