mod cache;
mod database;
mod jobs;
mod queries;
mod sources;
mod types;

use cache::DbCache;
use sources::{types::VideoImportEvent, youtube};
use specta_typescript::Typescript;
use std::sync::Arc;
use tauri::AppHandle;
use tauri_specta::{collect_commands, collect_events, Builder};

async fn setup<T: tauri::Runtime>(manager: &impl tauri::Manager<T>, app: &AppHandle) {
    let db_pool = match database::make_pool().await {
        Ok(pool) => pool,
        Err(e) => {
            log::error!("Failed to initialize database pool: {}", e);
            return;
        }
    };

    let arc_pool = Arc::new(db_pool);

    let job_manager = Arc::new(jobs::Manager::new(arc_pool.clone(), app.clone()));
    manager.manage(types::AppState {
        job_manager: Arc::clone(&job_manager),
        cache: DbCache::new(Arc::clone(&arc_pool)),
        db_pool: Arc::clone(&arc_pool),
        queries: queries::Queries::new(Arc::clone(&arc_pool)),
    });

    job_manager.start().await;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new()
        .commands(collect_commands![
            youtube::import_video,
            youtube::get_video_info,
        ])
        .events(collect_events![VideoImportEvent]);

    #[cfg(target_os = "macos")]
    builder
        .export(Typescript::default(), "../src/lib/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);

            tauri::async_runtime::block_on(async move {
                setup(app, app.handle()).await;
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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
