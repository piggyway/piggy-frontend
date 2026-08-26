variable "role_name" {
  description = "Name of the shared GitHub Actions staging deployment role."
  type        = string
}

variable "github_repositories" {
  description = "GitHub repositories allowed to assume the role, in owner/name form."
  type        = list(string)
}

variable "github_environment" {
  description = "GitHub environment included in each allowed OIDC subject."
  type        = string
}

variable "ecr_repository_arns" {
  description = "ECR repositories that the deployment role may push to."
  type        = list(string)
}

variable "ecs_service_arns" {
  description = "ECS services that the deployment role may update."
  type        = list(string)
}

variable "ecs_run_task_definition_arns" {
  description = "One-off ECS task-definition families that GitHub Actions may run."
  type        = list(string)
}

variable "ecs_run_task_cluster_arns" {
  description = "ECS clusters where GitHub Actions may run approved one-off tasks."
  type        = list(string)
}

variable "ecs_pass_role_arns" {
  description = "ECS execution and task roles that GitHub Actions may pass."
  type        = list(string)
}
