use serde::{de::DeserializeOwned, Deserialize, Serialize};
use sqlx::{Pool, Sqlite, Type};
use std::sync::Arc;

pub struct DbCache {
    pool: Arc<Pool<Sqlite>>,
}

#[derive(Serialize, Deserialize, Type)]
pub enum Version {
    V1,
}

impl From<i64> for Version {
    fn from(v: i64) -> Self {
        match v {
            1 => Version::V1,
            _ => Version::V1,
        }
    }
}

pub struct CacheEntry<T> {
    pub key: String,
    pub value: T,
    pub version: Version,
}

impl DbCache {
    pub fn new(pool: Arc<Pool<Sqlite>>) -> Self {
        Self { pool }
    }

    // Get the cache entry for the given key and version if it exists
    pub async fn get_with_version<T: DeserializeOwned>(
        &self,
        key: &str,
        version: Version,
    ) -> Option<CacheEntry<T>> {
        let mut conn = self.pool.acquire().await.ok()?;

        let row = sqlx::query!(
            r#"SELECT value FROM cache WHERE key = ?1 AND version = ?2"#,
            key,
            version
        )
        .fetch_one(&mut *conn)
        .await
        .ok()?;

        let value = serde_json::from_str(&row.value).ok()?;

        Some(CacheEntry {
            key: key.into(),
            value,
            version,
        })
    }

    // Get the latest version of the cache entry for the given key if it exists
    pub async fn get<T: DeserializeOwned>(&self, key: &str) -> Option<CacheEntry<T>> {
        let mut conn = self.pool.acquire().await.ok()?;

        let row = sqlx::query!(
            r#"SELECT value, version FROM cache WHERE key = ?1 ORDER BY version DESC LIMIT 1"#,
            key
        )
        .fetch_one(&mut *conn)
        .await
        .ok()?;

        let value = serde_json::from_str(&row.value).ok()?;

        Some(CacheEntry {
            key: key.into(),
            value,
            version: Version::from(row.version),
        })
    }

    // Set the cache entry, incrementing the version number if the key already exists
    pub async fn set<T: Serialize>(&self, key: &str, value: &T) -> anyhow::Result<Version> {
        let mut conn = self.pool.acquire().await?;
        let value = serde_json::to_string(value)?;

        let last_version = sqlx::query!(
            r#"SELECT version FROM cache WHERE key = ?1 ORDER BY version DESC LIMIT 1"#,
            key
        )
        .fetch_one(&mut *conn)
        .await
        .map(|r| r.version)
        .unwrap_or(0);

        let version = last_version + 1;
        let inserted = sqlx::query!(
            r#"INSERT INTO cache (key, value, version) VALUES (?1, ?2, ?3) RETURNING version"#,
            key,
            value,
            version
        )
        .fetch_one(&mut *conn)
        .await?;

        Ok(inserted.version.into())
    }
}
