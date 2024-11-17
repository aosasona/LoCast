use std::sync::Arc;

use super::Action;
use crate::sources::types::VideoDetails;
use anyhow::Error as AnyError;
use async_trait::async_trait;
use sqlx::{Pool, Sqlite};

pub struct ImportYtVideoAction {
    pool: Option<Arc<Pool<Sqlite>>>,
    details: VideoDetails,
}

impl ImportYtVideoAction {
    pub fn new(details: VideoDetails) -> Self {
        Self {
            pool: None,
            details,
        }
    }
}

#[async_trait]
impl Action for ImportYtVideoAction {
    fn set_pool(&mut self, pool: Arc<Pool<Sqlite>>) {
        self.pool = Some(pool);
    }

    async fn create_job(&self) -> Result<crate::queries::job::Job, AnyError> {
        todo!()
    }
}
