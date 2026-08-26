output "vpc_id" {
  description = "Staging VPC ID."
  value       = aws_vpc.this.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs keyed by availability zone."
  value       = { for key, subnet in aws_subnet.public : key => subnet.id }
}

output "app_subnet_ids" {
  description = "Private Fargate application subnet IDs keyed by availability zone."
  value       = { for key, subnet in aws_subnet.app : key => subnet.id }
}

output "database_subnet_ids" {
  description = "Private database subnet IDs keyed by availability zone."
  value       = { for key, subnet in aws_subnet.database : key => subnet.id }
}

output "security_group_ids" {
  description = "Security group IDs keyed by service."
  value       = { for key, security_group in aws_security_group.this : key => security_group.id }
}

output "public_route_table_id" {
  description = "Public route table ID."
  value       = aws_route_table.public.id
}

output "app_route_table_ids" {
  description = "Application route table IDs keyed by availability zone."
  value       = { for key, route_table in aws_route_table.app : key => route_table.id }
}

output "database_route_table_id" {
  description = "Isolated database route table ID."
  value       = aws_route_table.database.id
}

output "nat_gateway_id" {
  description = "Shared staging NAT Gateway ID."
  value       = aws_nat_gateway.this.id
}

output "cloud_map_namespace_id" {
  description = "Cloud Map private DNS namespace ID."
  value       = aws_service_discovery_private_dns_namespace.this.id
}

output "backend_discovery_service_arn" {
  description = "Cloud Map backend service ARN."
  value       = aws_service_discovery_service.backend.arn
}
