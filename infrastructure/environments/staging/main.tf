module "network" {
  source = "../../modules/network"

  name_prefix           = "piggyway-staging"
  vpc_cidr              = "10.20.0.0/16"
  public_subnets        = local.existing_public_subnets
  app_subnets           = local.existing_app_subnets
  database_subnets      = local.database_subnets
  security_groups       = local.existing_security_groups
  cloudflare_ipv4_cidrs = local.cloudflare_ipv4_cidrs
}

module "ecr" {
  source = "../../modules/ecr"

  repositories = {
    frontend = "piggyway-staging-frontend"
    backend  = "piggyway-staging-backend"
    directus = "piggyway-staging-directus"
  }
}

module "database" {
  source = "../../modules/database"

  name_prefix               = "piggyway-staging"
  db_subnet_group_name      = "piggyway-staging-db-subnet-group"
  description               = "Private subnets for Piggyway staging RDS"
  subnet_ids                = values(module.network.database_subnet_ids)
  db_instance_identifier    = "piggyway-staging-postgres"
  engine_version            = "16.14"
  instance_class            = "db.t4g.micro"
  allocated_storage         = 20
  max_allocated_storage     = 50
  database_name             = "piggyway"
  master_username           = "piggy_admin"
  vpc_security_group_ids    = [module.network.security_group_ids["rds"]]
  final_snapshot_identifier = "piggyway-staging-postgres-final"
}

module "runtime_secrets" {
  source = "../../modules/secrets"

  name_prefix        = "piggyway-staging"
  secret_path_prefix = "piggyway/staging"
  services           = ["frontend", "backend", "directus"]
}

resource "aws_ecs_cluster" "this" {
  name = "piggyway-staging"

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [configuration, setting]
  }
}
