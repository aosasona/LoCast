use crate::queries::job::Job;

#[tauri::command]
pub async fn get_jobs() -> Result<Vec<Job>, String> {
    todo!();
}
