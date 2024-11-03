pub mod author;
pub mod item;

use author::AuthorQueries;
use item::ItemQueries;
use sqlx::SqlitePool;
use std::sync::Arc;

pub struct Queries {
    db_pool: Arc<SqlitePool>,
    pub author: AuthorQueries,
    pub item: ItemQueries,
}

impl Queries {
    pub fn new(db_pool: Arc<SqlitePool>) -> Self {
        Self {
            author: AuthorQueries::new(Arc::clone(&db_pool)),
            item: ItemQueries::new(Arc::clone(&db_pool)),
            db_pool,
        }
    }
}
