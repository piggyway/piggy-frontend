variable "db_subnet_group_name" {
  description = "Name of the existing RDS DB subnet group."
  type        = string
}

variable "subnet_ids" {
  description = "Existing subnet IDs currently assigned to the DB subnet group."
  type        = list(string)
}

variable "description" {
  description = "Description of the DB subnet group."
  type        = string
}

variable "name_prefix" {
  description = "Name prefix for staging database resources."
  type        = string
}

variable "db_instance_identifier" {
  description = "RDS DB instance identifier."
  type        = string
}

variable "engine_version" {
  description = "Initial PostgreSQL engine version."
  type        = string
}

variable "instance_class" {
  description = "RDS DB instance class."
  type        = string
}

variable "allocated_storage" {
  description = "Initial gp3 storage allocation in GiB."
  type        = number
}

variable "max_allocated_storage" {
  description = "Maximum gp3 storage autoscaling allocation in GiB."
  type        = number
}

variable "database_name" {
  description = "Initial PostgreSQL database name."
  type        = string
}

variable "master_username" {
  description = "RDS master username. The password is generated and managed by RDS."
  type        = string
}

variable "vpc_security_group_ids" {
  description = "Security groups attached to the RDS DB instance."
  type        = list(string)
}

variable "final_snapshot_identifier" {
  description = "Final snapshot identifier used during an explicitly approved database deletion."
  type        = string
}
