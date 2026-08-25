output "role_arn" {
  description = "ARN of the shared GitHub Actions staging deployment role."
  value       = aws_iam_role.github_deploy.arn
}
