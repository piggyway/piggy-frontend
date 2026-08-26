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

variable "backend_port" {
  description = "Port exposed by the Backend task."
  type        = number
  default     = 3000
}

variable "frontend_port" {
  description = "Port exposed by the Frontend task."
  type        = number
  default     = 3000
}

variable "directus_hostname" {
  description = "Public hostname routed to the Directus target group."
  type        = string
}

variable "backend_hostname" {
  description = "Public hostname routed to the Backend target group."
  type        = string
}

variable "frontend_hostname" {
  description = "Public hostname routed to the Frontend target group."
  type        = string
}

variable "certificate_domains" {
  description = "Staging hostnames included in the ACM certificate."
  type        = list(string)
}
