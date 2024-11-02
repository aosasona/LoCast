use crate::{cache::DbCache, jobs::Manager, queries};
use sqlx::{Pool, Sqlite};
use std::sync::Arc;

pub struct AppState {
    pub db_pool: Arc<Pool<Sqlite>>,
    pub job_manager: Arc<Manager>,
    pub cache: DbCache,
    pub queries: queries::Queries,
}
