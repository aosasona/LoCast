mod actions;
pub mod commands;
mod manager;

use anyhow::Error as AnyError;
pub use manager::*;

pub(crate) trait Processor {
    fn process(&self, job: &crate::queries::job::Job) -> Result<(), AnyError>;
}
