variable "repositories" {
  description = "ECR repository names keyed by workload."
  type        = map(string)
}

variable "lifecycle_keep_count" {
  description = "Number of recent images retained in each repository."
  type        = number
  default     = 20
}
