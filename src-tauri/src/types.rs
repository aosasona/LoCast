use std::sync::Arc;

pub struct AppState {
    pub db_pool: sqlx::Pool<sqlx::Sqlite>,
    pub job_manager: Arc<crate::jobs::JobManager>,
}
