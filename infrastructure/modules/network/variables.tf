variable "name_prefix" {
  description = "Name prefix used by staging network resources."
  type        = string
}

variable "vpc_cidr" {
  description = "IPv4 CIDR of the staging VPC."
  type        = string
}

variable "public_subnets" {
  description = "Existing public subnets keyed by availability zone."
  type = map(object({
    cidr_block        = string
    availability_zone = string
    name              = string
  }))
}

variable "app_subnets" {
  description = "Existing private Fargate application subnets keyed by availability zone."
  type = map(object({
    cidr_block        = string
    availability_zone = string
    name              = string
  }))
}

variable "database_subnets" {
  description = "Private database subnets keyed by availability zone."
  type = map(object({
    cidr_block        = string
    availability_zone = string
    name              = string
  }))
}

variable "cloudflare_ipv4_cidrs" {
  description = "Official Cloudflare proxy IPv4 ranges allowed to reach the ALB."
  type        = list(string)

  validation {
    condition     = length(var.cloudflare_ipv4_cidrs) > 0
    error_message = "At least one Cloudflare IPv4 CIDR must be configured."
  }
}

variable "security_groups" {
  description = "Existing staging security groups keyed by service."
  type = map(object({
    name        = string
    description = string
  }))
}
