use sqlx::SqlitePool;
use std::{ops::Deref, sync::Arc};

use chrono::{DateTime, Utc};

use crate::sources::types::SourceType;

pub struct AuthorQueries {
    db_pool: Arc<SqlitePool>,
}

#[derive(Debug, sqlx::FromRow)]
pub struct Author {
    pub id: i64,
    pub name: String,
    pub asset_id: String,
    pub source_id: String,
    pub source_type: SourceType,
    pub created_at: Option<DateTime<Utc>>,
    pub last_updated: Option<DateTime<Utc>>,
}

impl Author {
    pub fn new(name: String, source_id: String, source_type: SourceType) -> Self {
        Self {
            id: 0,
            name,
            asset_id: "".to_string(),
            source_id,
            source_type,
            created_at: None,
            last_updated: None,
        }
    }
}

impl AuthorQueries {
    pub fn new(db_pool: Arc<SqlitePool>) -> Self {
        Self { db_pool }
    }

    pub async fn create(&self, author: Author) -> anyhow::Result<Author> {
        let asset_id = author.source_type.generate_asset_id();

        let record: Author = sqlx::query_as("INSERT INTO authors (name, source_id, source_type, asset_id) VALUES (?1, ?2, ?3, ?4) RETURNING *")
            .bind(&author.name)
            .bind(&author.source_id)
            .bind(&author.source_type)
            .bind(&asset_id)
            .fetch_one(self.db_pool.deref())
            .await?;

        Ok(record)
    }

    pub async fn delete(&self, author_id: i64) -> anyhow::Result<()> {
        todo!()
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
