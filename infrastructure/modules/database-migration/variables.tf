variable "name_prefix" {
  description = "Prefix used for database migration resources."
  type        = string
}

variable "aws_region" {
  description = "AWS region containing the staging environment."
  type        = string
}

variable "cluster_arn" {
  description = "ECS cluster that runs the one-off migration task."
  type        = string
}

variable "subnet_ids" {
  description = "Private application subnet IDs for the migration task."
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security groups attached to the migration task."
  type        = list(string)
}

variable "database_address" {
  description = "Private RDS hostname."
  type        = string
}

variable "database_port" {
  description = "RDS PostgreSQL port."
  type        = number
}

variable "rehearsal_database_name" {
  description = "Fresh logical database used only for the Neon migration rehearsal."
  type        = string
}

variable "database_master_secret_arn" {
  description = "RDS-managed master credential secret ARN."
  type        = string
}

variable "directus_runtime_secret_arn" {
  description = "Directus runtime secret ARN used to restore database ownership."
  type        = string
}

variable "postgres_image" {
  description = "Pinned PostgreSQL 18 image containing pg_dump and pg_restore."
  type        = string
}

variable "log_retention_days" {
  description = "CloudWatch log retention for the one-off migration task."
  type        = number
  default     = 14
}
