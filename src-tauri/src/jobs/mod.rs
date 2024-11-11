pub mod commands;
mod manager;

pub use manager::*;

pub(crate) trait Processor {
    fn process(&self, job: &crate::queries::job::Job) -> Result<(), Box<dyn std::error::Error>>;
}
