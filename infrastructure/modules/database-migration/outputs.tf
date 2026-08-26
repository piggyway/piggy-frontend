output "source_secret_name" {
  description = "Secrets Manager name where the Neon connection string must be stored outside Terraform."
  value       = aws_secretsmanager_secret.source.name
}

output "task_definition_arn" {
  description = "Stopped-by-default one-off Neon to RDS rehearsal migration task definition."
  value       = aws_ecs_task_definition.this.arn
}

output "log_group_name" {
  description = "CloudWatch log group for the one-off migration task."
  value       = aws_cloudwatch_log_group.this.name
}

output "rehearsal_database_name" {
  description = "Fresh logical RDS database populated by the rehearsal task."
  value       = var.rehearsal_database_name
}
