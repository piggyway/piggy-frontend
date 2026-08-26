# GitHub Actions staging deployment role

Creates the account-level GitHub OIDC provider and one shared, least-privilege
staging deployment role. Trust is limited to the configured repositories and
GitHub environment. The role can push release images, register task-definition
revisions, update the configured ECS services, and pass only their task roles.

The role cannot read application secrets or modify the network, database, load
balancer, or Terraform state.
