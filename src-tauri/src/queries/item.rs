use chrono::{DateTime, Utc};
use sqlx::{FromRow, SqlitePool};
use std::{ops::Deref, sync::Arc};

use crate::sources::types::SourceType;

pub struct ItemQueries {
    db_pool: Arc<SqlitePool>,
}

#[derive(FromRow, sqlx::Type)]
pub struct Item {
    pub id: i64,
    pub title: String,
    pub description: Option<String>,
    pub category: Option<String>,
    pub duration_in_seconds: i64,
    pub source_type: SourceType,
    pub source_id: String,
    pub asset_id: String,
    pub created_at: Option<DateTime<Utc>>,
    pub last_updated: Option<DateTime<Utc>>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub author_id: Option<i64>,
}

impl Item {
    pub fn new(
        title: String,
        description: Option<String>,
        category: Option<String>,
        duration_in_seconds: i64,
        source_type: SourceType,
        source_id: String,
        author_id: Option<i64>,
    ) -> Self {
        Self {
            id: 0,
            title,
            description,
            category,
            duration_in_seconds,
            source_type,
            source_id,
            asset_id: "".to_string(),
            created_at: None,
            last_updated: None,
            deleted_at: None,
            author_id,
        }
    }
}

impl ItemQueries {
    pub fn new(db_pool: Arc<SqlitePool>) -> Self {
        Self { db_pool }
    }

    pub async fn create(&self, item: Item) -> anyhow::Result<Item> {
        let asset_id = item.source_type.generate_asset_id();

        sqlx::query_as::<_, Item>(
                r#"
                INSERT INTO items (title, description, category, duration_in_seconds, source_type, source_id, asset_id, author_id)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
                RETURNING *
                "#
        )
            .bind(&item.title)
            .bind(&item.description)
            .bind(&item.category)
            .bind(item.duration_in_seconds)
            .bind(&item.source_type)
            .bind(&item.source_id)
            .bind(&asset_id)
            .bind(item.author_id)
            .fetch_one(self.db_pool.deref())
            .await
            .map_err(|e| anyhow::anyhow!("Failed to create item: {:?}", e))
    }
}
