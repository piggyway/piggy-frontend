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

module "database_bootstrap" {
  source = "../../modules/database-bootstrap"

  name_prefix = "piggyway-staging"
  aws_region  = var.aws_region

  database_address            = module.database.address
  database_port               = module.database.port
  database_name               = module.database.database_name
  database_master_secret_arn  = module.database.master_user_secret_arn
  directus_runtime_secret_arn = module.runtime_secrets.secret_arns["directus"]
  backend_runtime_secret_arn  = module.runtime_secrets.secret_arns["backend"]

  directus_repository_arn = module.ecr.repository_arns["directus"]
  backend_repository_arn  = module.ecr.repository_arns["backend"]
  directus_image = join("@", [
    module.ecr.repository_urls["directus"],
    "sha256:fd26df4d6dc07c018209510a547302a8413e1791926cbece3db1a97b4b65aa14",
  ])
  backend_image = join("@", [
    module.ecr.repository_urls["backend"],
    "sha256:9dd48002066dc49386c90aa1eb26773c150f4ca409171c1b357fea06ea4f33a9",
  ])
  postgres_image = "public.ecr.aws/docker/library/postgres@sha256:075f7ba66bc9b3ce7d6b8b635208ff61cd7cf1a67d71ec530eec5d7ae0cbe571"

  directus_public_url = "https://cms-staging.piggyway.com.au"
}

resource "aws_ecs_cluster" "this" {
  name = "piggyway-staging"

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [configuration, setting]
  }
}
