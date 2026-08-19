output "alb_arn" {
  description = "ARN of the staging application load balancer."
  value       = aws_lb.this.arn
}

output "alb_dns_name" {
  description = "AWS DNS hostname of the staging application load balancer."
  value       = aws_lb.this.dns_name
}

output "alb_zone_id" {
  description = "Route 53 canonical hosted zone ID for the ALB."
  value       = aws_lb.this.zone_id
}

output "directus_target_group_arn" {
  description = "Target group ARN used by the Directus ECS service."
  value       = aws_lb_target_group.directus.arn
}

output "backend_target_group_arn" {
  description = "Target group ARN used by the Backend ECS service."
  value       = aws_lb_target_group.backend.arn
}

output "certificate_arn" {
  description = "ARN of the DNS-validated staging ACM certificate."
  value       = aws_acm_certificate_validation.staging.certificate_arn
}

output "certificate_validation_options" {
  description = "DNS records that must be created before ACM can issue the certificate."
  value = {
    for option in aws_acm_certificate.staging.domain_validation_options : option.domain_name => {
      name  = option.resource_record_name
      type  = option.resource_record_type
      value = option.resource_record_value
    }
  }
}
