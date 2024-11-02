pub mod author;

use author::AuthorQueries;
use sqlx::SqlitePool;
use std::sync::Arc;

pub struct Queries {
    db_pool: Arc<SqlitePool>,
    pub author: AuthorQueries,
}

impl Queries {
    pub fn new(db_pool: Arc<SqlitePool>) -> Self {
        Self {
            author: AuthorQueries::new(Arc::clone(&db_pool)),
            db_pool,
        }
    }
}
