use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};

mod sources;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder =
        Builder::<tauri::Wry>::new().commands(collect_commands![sources::youtube::get_video_info]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/lib/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_prevent_default::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
