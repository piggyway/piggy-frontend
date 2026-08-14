output "database_users_task_definition_arn" {
  description = "Task definition ARN for creating application database users."
  value       = aws_ecs_task_definition.database_users.arn
}

output "directus_schema_task_definition_arn" {
  description = "Task definition ARN for applying the Directus schema once."
  value       = aws_ecs_task_definition.directus_schema.arn
}

output "database_permissions_task_definition_arn" {
  description = "Task definition ARN for granting application-table access to the backend."
  value       = aws_ecs_task_definition.database_permissions.arn
}

output "backend_schema_task_definition_arn" {
  description = "Task definition ARN for applying staging product schema compatibility changes."
  value       = aws_ecs_task_definition.backend_schema.arn
}

output "backend_seed_task_definition_arn" {
  description = "Task definition ARN for upserting synthetic staging catalogue data."
  value       = aws_ecs_task_definition.backend_seed.arn
}

output "log_group_name" {
  description = "CloudWatch log group used by database bootstrap tasks."
  value       = aws_cloudwatch_log_group.bootstrap.name
}
