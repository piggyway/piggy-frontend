output "repository_arns" {
  description = "ECR repository ARNs keyed by workload."
  value       = { for key, repository in aws_ecr_repository.this : key => repository.arn }
}

output "repository_urls" {
  description = "ECR repository URLs keyed by workload."
  value       = { for key, repository in aws_ecr_repository.this : key => repository.repository_url }
}

