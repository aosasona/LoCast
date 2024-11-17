use std::sync::Arc;

use anyhow::Error as AnyError;
use async_trait::async_trait;
use sqlx::{Pool, Sqlite};

#[async_trait]
pub trait Action {
    fn set_pool(&mut self, pool: Arc<Pool<Sqlite>>);

    async fn create_job(&self) -> Result<crate::queries::job::Job, AnyError>;
}
