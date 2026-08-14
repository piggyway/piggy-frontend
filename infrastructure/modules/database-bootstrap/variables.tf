variable "name_prefix" {
  description = "Prefix used for database bootstrap resources."
  type        = string
}

variable "aws_region" {
  description = "AWS region used by the CloudWatch Logs configuration."
  type        = string
}

variable "database_address" {
  description = "Private PostgreSQL hostname."
  type        = string
}

variable "database_port" {
  description = "PostgreSQL port."
  type        = number
}

variable "database_name" {
  description = "PostgreSQL database name."
  type        = string
}

variable "database_master_secret_arn" {
  description = "RDS-managed master credential secret ARN."
  type        = string
}

variable "directus_runtime_secret_arn" {
  description = "Directus runtime secret ARN."
  type        = string
}

variable "backend_runtime_secret_arn" {
  description = "Backend runtime secret ARN."
  type        = string
}

variable "directus_repository_arn" {
  description = "ARN of the Directus ECR repository."
  type        = string
}

variable "directus_image" {
  description = "Directus image URI pinned by digest."
  type        = string
}

variable "postgres_image" {
  description = "PostgreSQL client image URI pinned to a linux/amd64 digest."
  type        = string
}

variable "directus_public_url" {
  description = "Public staging URL used by Directus."
  type        = string
}

variable "log_retention_days" {
  description = "CloudWatch log retention for one-off bootstrap tasks."
  type        = number
  default     = 14
}
