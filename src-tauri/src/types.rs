use crate::{cache::DbCache, jobs::JobManager};
use sqlx::{Pool, Sqlite};
use std::sync::Arc;

pub struct AppState {
    pub db_pool: Arc<Pool<Sqlite>>,
    pub job_manager: Arc<JobManager>,
    pub cache: DbCache,
}
