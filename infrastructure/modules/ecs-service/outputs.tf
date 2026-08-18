output "service_name" {
  description = "ECS service name."
  value       = aws_ecs_service.this.name
}

output "service_arn" {
  description = "ECS service ARN."
  value       = aws_ecs_service.this.id
}

output "task_definition_arn" {
  description = "Active task definition ARN."
  value       = aws_ecs_task_definition.this.arn
}

output "log_group_name" {
  description = "CloudWatch log group receiving application logs."
  value       = aws_cloudwatch_log_group.this.name
}
