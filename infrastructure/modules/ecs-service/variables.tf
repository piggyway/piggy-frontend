variable "name_prefix" {
  description = "Name prefix shared by the staging resources."
  type        = string
}

variable "service_name" {
  description = "Short workload name, for example directus."
  type        = string
}

variable "aws_region" {
  description = "AWS region containing the ECS service."
  type        = string
}

variable "cluster_arn" {
  description = "ARN of the ECS cluster."
  type        = string
}

variable "image" {
  description = "Immutable container image reference, preferably by digest."
  type        = string
}

variable "repository_arn" {
  description = "ECR repository ARN that the execution role may pull from."
  type        = string
}

variable "container_port" {
  description = "Application port exposed by the container."
  type        = number
}

variable "cpu" {
  description = "Fargate task CPU units."
  type        = number
}

variable "memory" {
  description = "Fargate task memory in MiB."
  type        = number
}

variable "desired_count" {
  description = "Number of tasks the ECS service maintains."
  type        = number
  default     = 1
}

variable "subnet_ids" {
  description = "Private application subnet IDs used by Fargate."
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security groups attached to each Fargate task ENI."
  type        = list(string)
}

variable "target_group_arn" {
  description = "ALB target group that receives the service traffic."
  type        = string
}

variable "environment" {
  description = "Non-secret runtime environment variables."
  type        = map(string)
  default     = {}
}

variable "runtime_secret_arn" {
  description = "Secrets Manager secret containing this service's runtime values."
  type        = string
}

variable "secret_keys" {
  description = "Map of container environment names to JSON keys in the runtime secret."
  type        = map(string)
  default     = {}
}

variable "health_check_command" {
  description = "ECS container health-check command."
  type        = list(string)
}

variable "health_check_start_period" {
  description = "Seconds allowed for application startup before failures count."
  type        = number
  default     = 120
}

variable "health_check_grace_period_seconds" {
  description = "Seconds ECS ignores load balancer health failures after startup."
  type        = number
  default     = 180
}

variable "log_retention_days" {
  description = "CloudWatch log retention period."
  type        = number
  default     = 14
}
