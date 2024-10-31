use std::sync::Arc;

use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};

mod database;
mod jobs;
mod sources;
mod types;

async fn setup<T: tauri::Runtime>(manager: &impl tauri::Manager<T>) {
    let db_pool = match database::make_pool().await {
        Ok(pool) => pool,
        Err(e) => {
            log::error!("Failed to initialize database pool: {}", e);
            return;
        }
    };

    let job_manager = Arc::new(jobs::JobManager::new(db_pool.clone()));

    manager.manage(types::AppState {
        job_manager: Arc::clone(&job_manager),
        db_pool,
    });

    job_manager.start().await;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder =
        Builder::<tauri::Wry>::new().commands(collect_commands![sources::youtube::get_video_info]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/lib/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                setup(app).await;
            });

            Ok(())
        })
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_prevent_default::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:locast.db", database::get_migrations())
                .build(),
        )
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
