output "vpc_id" {
  description = "Staging VPC ID."
  value       = module.network.vpc_id
}

output "ecr_repository_urls" {
  description = "Existing staging ECR repository URLs."
  value       = module.ecr.repository_urls
}

output "ecs_cluster_arn" {
  description = "Existing staging ECS cluster ARN."
  value       = aws_ecs_cluster.this.arn
}

output "app_subnet_ids" {
  description = "Private Fargate application subnet IDs keyed by availability zone."
  value       = module.network.app_subnet_ids
}

output "database_subnet_ids" {
  description = "Private RDS subnet IDs keyed by availability zone."
  value       = module.network.database_subnet_ids
}

output "security_group_ids" {
  description = "Staging security group IDs keyed by service."
  value       = module.network.security_group_ids
}

output "nat_gateway_id" {
  description = "Shared staging NAT Gateway ID."
  value       = module.network.nat_gateway_id
}

output "cloud_map_namespace_id" {
  description = "Private Cloud Map namespace ID."
  value       = module.network.cloud_map_namespace_id
}

output "backend_discovery_service_arn" {
  description = "Cloud Map backend service ARN."
  value       = module.network.backend_discovery_service_arn
}

output "rds_instance_identifier" {
  description = "Staging RDS DB instance identifier."
  value       = module.database.instance_identifier
}

output "rds_address" {
  description = "Private staging PostgreSQL hostname."
  value       = module.database.address
}

output "rds_master_user_secret_arn" {
  description = "ARN of the RDS-managed master credential secret; the secret value is not stored in Terraform."
  value       = module.database.master_user_secret_arn
}

output "runtime_secret_arns" {
  description = "Empty application runtime secret container ARNs keyed by service."
  value       = module.runtime_secrets.secret_arns
}

output "runtime_secret_read_policy_arns" {
  description = "Least-privilege runtime secret read policy ARNs keyed by service."
  value       = module.runtime_secrets.read_policy_arns
}

output "database_bootstrap_task_definition_arns" {
  description = "One-off task definitions used for database bootstrap in execution order."
  value = {
    database_users       = module.database_bootstrap.database_users_task_definition_arn
    directus_schema      = module.database_bootstrap.directus_schema_task_definition_arn
    backend_schema       = module.database_bootstrap.backend_schema_task_definition_arn
    database_permissions = module.database_bootstrap.database_permissions_task_definition_arn
    backend_seed         = module.database_bootstrap.backend_seed_task_definition_arn
  }
}

output "database_bootstrap_log_group_name" {
  description = "CloudWatch log group for one-off database bootstrap tasks."
  value       = module.database_bootstrap.log_group_name
}
