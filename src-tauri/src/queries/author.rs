use sqlx::SqlitePool;
use std::{ops::Deref, sync::Arc};

pub struct AuthorQueries {
    db_pool: Arc<SqlitePool>,
}

impl AuthorQueries {
    pub fn new(db_pool: Arc<SqlitePool>) -> Self {
        Self { db_pool }
    }

    pub async fn find_author_id_by_youtube_id(
        &self,
        youtube_id: &str,
    ) -> anyhow::Result<Option<i64>> {
        let row = sqlx::query!(
            r#"
            SELECT a.id as  author_id FROM authors a INNER JOIN jobs j ON j.resource_id = a.id
            WHERE a.source_id = ?1 AND j.action = 'create_author' AND j.status = 'completed' LIMIT 1
            "#,
            youtube_id
        )
        .fetch_optional(self.db_pool.deref())
        .await
        .map_err(|e| anyhow::anyhow!("failed to check if author exists: {}", e))?;

        if let Some(row) = row {
            Ok(Some(row.author_id))
        } else {
            Ok(None)
        }
    }
}
