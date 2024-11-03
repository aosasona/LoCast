use chrono::{TimeZone, Utc};
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
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub last_updated: Option<chrono::DateTime<chrono::Utc>>,
    pub deleted_at: Option<chrono::DateTime<chrono::Utc>>,
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

        // let record = sqlx::query!(
        //         r#"
        //         INSERT INTO items (title, description, category, duration_in_seconds, source_type, source_id, asset_id, author_id)
        //         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
        //         RETURNING *
        //         "#,
        //         item.title, item.description, item.category, item.duration_in_seconds, item.source_type, item.source_id, asset_id, item.author_id
        //     )
        //     .fetch_one(self.db_pool.deref())
        //     .await
        //     .map_err(|e| anyhow::anyhow!("failed to create item: {}", e))?;

        let record: Item = sqlx::query_as(
                r#"
                INSERT INTO items (title, description, category, duration_in_seconds, source_type, source_id, asset_id, author_id)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
                RETURNING *
                "#)
            .bind(&item.title)
            .bind(&item.description)
            .bind(&item.category)
            .bind(item.duration_in_seconds)
            .bind(&item.source_type)
            .bind(&item.source_id)
            .bind(&asset_id)
            .bind(item.author_id)
            .fetch_one(self.db_pool.deref())
            .await?;

        Ok(record)

        // Ok(Item {
        //     id: record.id,
        //     title: record.title,
        //     description: record.description,
        //     category: record.category,
        //     duration_in_seconds: record.duration_in_seconds,
        //     source_type: record.source_type.into(),
        //     source_id: record.source_id,
        //     asset_id: record.asset_id,
        //     created_at: Utc.timestamp_opt(record.created_at, 0).single(),
        //     last_updated: Utc.timestamp_opt(record.last_updated, 0).single(),
        //     deleted_at: record
        //         .deleted_at
        //         .and_then(|ts| Utc.timestamp_opt(ts, 0).single()),
        //     author_id: record.author_id,
        // })
    }
}
