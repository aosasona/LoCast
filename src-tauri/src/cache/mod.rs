use serde::{de::DeserializeOwned, Deserialize, Serialize};
use sqlx::{Pool, Sqlite, Type};
use std::{fmt::Display, sync::Arc};

pub struct DbCache {
    pool: Arc<Pool<Sqlite>>,
}

#[derive(Clone)]
pub enum Key {
    YoutubeVideoInfo(String),
}

impl From<String> for Key {
    fn from(s: String) -> Self {
        match s.split_once('_') {
            Some(("ytvi", id)) => Key::YoutubeVideoInfo(id.to_string()),
            _ => unreachable!("invalid cache key"),
        }
    }
}

impl Display for Key {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Key::YoutubeVideoInfo(id) => write!(f, "ytvi_{}", id),
        }
    }
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
    pub key: Key,
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
        key: Key,
        version: Version,
    ) -> Option<CacheEntry<T>> {
        let mut conn = self.pool.acquire().await.ok()?;

        let key = key.to_string();
        let row = sqlx::query!(
            r#"SELECT key, value FROM cache WHERE key = ?1 AND version = ?2"#,
            key,
            version
        )
        .fetch_one(&mut *conn)
        .await
        .ok()?;

        let value = serde_json::from_str(&row.value).ok()?;

        Some(CacheEntry {
            key: row.key.into(),
            value,
            version,
        })
    }

    // Get the latest version of the cache entry for the given key if it exists
    pub async fn get<T: DeserializeOwned>(&self, key: Key) -> Option<CacheEntry<T>> {
        let mut conn = self.pool.acquire().await.ok()?;

        let key = key.to_string();
        let row = sqlx::query!(
            r#"SELECT key, value, version FROM cache WHERE key = ?1 ORDER BY version DESC LIMIT 1"#,
            key
        )
        .fetch_one(&mut *conn)
        .await
        .ok()?;

        let value = serde_json::from_str(&row.value).ok()?;

        Some(CacheEntry {
            key: row.key.into(),
            value,
            version: Version::from(row.version),
        })
    }

    // Set the cache entry, incrementing the version number if the key already exists
    pub async fn set<T: Serialize>(&self, key: Key, value: &T) -> anyhow::Result<Version> {
        let mut conn = self.pool.acquire().await?;
        let key = key.to_string();
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
