output "name" {
  description = "DB subnet group name."
  value       = aws_db_subnet_group.this.name
}

output "instance_arn" {
  description = "RDS DB instance ARN."
  value       = aws_db_instance.this.arn
}

output "instance_identifier" {
  description = "RDS DB instance identifier."
  value       = aws_db_instance.this.identifier
}

output "address" {
  description = "Private RDS hostname."
  value       = aws_db_instance.this.address
}

output "port" {
  description = "PostgreSQL port."
  value       = aws_db_instance.this.port
}

output "database_name" {
  description = "Initial PostgreSQL database name."
  value       = aws_db_instance.this.db_name
}

output "master_user_secret_arn" {
  description = "ARN of the RDS-managed master credential secret."
  value       = aws_db_instance.this.master_user_secret[0].secret_arn
}

output "bootstrap_master_secret_read_policy_arn" {
  description = "IAM policy for the future one-off database bootstrap task."
  value       = aws_iam_policy.bootstrap_master_secret_read.arn
}
