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

output "database_migration" {
  description = "One-off Neon to RDS rehearsal migration resources. The source secret value is set outside Terraform."
  value = {
    source_secret_name      = module.database_migration.source_secret_name
    task_definition_arn     = module.database_migration.task_definition_arn
    log_group_name          = module.database_migration.log_group_name
    rehearsal_database_name = module.database_migration.rehearsal_database_name
  }
}

output "staging_alb_dns_name" {
  description = "AWS hostname that Cloudflare staging records should proxy to."
  value       = module.load_balancer.alb_dns_name
}

output "staging_certificate_arn" {
  description = "ACM certificate ARN for the staging hostnames."
  value       = module.load_balancer.certificate_arn
}

output "staging_certificate_validation_options" {
  description = "Cloudflare DNS records required to validate the staging ACM certificate."
  value       = module.load_balancer.certificate_validation_options
}

output "directus_service_name" {
  description = "ECS service running the Directus staging application."
  value       = module.directus_service.service_name
}

output "directus_log_group_name" {
  description = "CloudWatch log group receiving Directus application logs."
  value       = module.directus_service.log_group_name
}

output "backend_service_name" {
  description = "ECS service running the Backend staging application."
  value       = module.backend_service.service_name
}

output "backend_log_group_name" {
  description = "CloudWatch log group receiving Backend application logs."
  value       = module.backend_service.log_group_name
}

output "frontend_service_name" {
  description = "ECS service running the Frontend staging application."
  value       = module.frontend_service.service_name
}

output "frontend_log_group_name" {
  description = "CloudWatch log group receiving Frontend application logs."
  value       = module.frontend_service.log_group_name
}
