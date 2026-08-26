output "secret_arns" {
  description = "Runtime secret ARNs keyed by service."
  value       = { for service, secret in aws_secretsmanager_secret.runtime : service => secret.arn }
}

output "read_policy_arns" {
  description = "Least-privilege runtime secret read policy ARNs keyed by service."
  value       = { for service, policy in aws_iam_policy.read_runtime_secret : service => policy.arn }
}
