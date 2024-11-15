mod cache;
mod database;
mod jobs;
mod queries;
mod sources;

use cache::DbCache;
use sources::youtube;
use specta::export::{self};
use sqlx::SqlitePool;
use std::sync::Arc;
use tauri::{AppHandle, Manager};

pub struct AppState {
    pub db_pool: Arc<SqlitePool>,
    pub job_manager: jobs::Manager,
    pub cache: DbCache,
    pub queries: queries::Queries,
}

async fn setup(app: &AppHandle) -> anyhow::Result<AppState> {
    let pool = Arc::new(database::init(app).await?);

    let app_state = AppState {
        db_pool: Arc::clone(&pool),
        job_manager: jobs::Manager::new(Arc::clone(&pool)),
        cache: DbCache::new(Arc::clone(&pool)),
        queries: queries::Queries::new(Arc::clone(&pool)),
    };

    Ok(app_state)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(debug_assertions)]
    #[cfg(any(target_os = "linux", target_os = "macos", target_os = "windows"))]
    export::ts("../src/lib/tauri/types.ts").expect("Failed to export typescript types");

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_prevent_default::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            youtube::get_video_info,
            youtube::import_video
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    let app_state = tauri::async_runtime::block_on(async {
        setup(app.handle())
            .await
            .expect("Failed to setup app state")
    });

    app.manage(app_state);
    app.run(|app, event| {
        if let tauri::RunEvent::ExitRequested { .. } = event {
            tauri::async_runtime::block_on(async {
                log::info!("Received exit request, running cleanup");
                let state = &*app.state::<AppState>();
                state.job_manager.stop().await;
                state.db_pool.close().await;
            });
        }
    });
}
