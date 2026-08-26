variable "name_prefix" {
  description = "Name prefix for IAM resources."
  type        = string
}

variable "secret_path_prefix" {
  description = "Secrets Manager path prefix without a trailing slash."
  type        = string
}

variable "services" {
  description = "Services that receive isolated runtime secret containers and read policies."
  type        = set(string)
}
