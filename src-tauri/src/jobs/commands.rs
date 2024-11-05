use crate::queries::job::Job;

#[tauri::command]
#[specta::specta]
pub async fn get_jobs() -> Result<Vec<Job>, String> {
    todo!();
}
