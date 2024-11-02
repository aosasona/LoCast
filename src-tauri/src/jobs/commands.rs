use super::types::Job;

#[tauri::command]
#[specta::specta]
pub async fn get_jobs() -> Result<Vec<Job>, String> {
    todo!();
}
