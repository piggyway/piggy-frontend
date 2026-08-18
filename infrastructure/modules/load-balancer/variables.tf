variable "name_prefix" {
  description = "Name prefix shared by staging resources."
  type        = string
}

variable "vpc_id" {
  description = "VPC containing the load balancer and target group."
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs used by the internet-facing ALB."
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group attached to the ALB."
  type        = string
}

variable "directus_port" {
  description = "Port exposed by the Directus task."
  type        = number
  default     = 8055
}

variable "certificate_domains" {
  description = "Staging hostnames included in the ACM certificate."
  type        = list(string)
}
