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

  lifecycle_keep_count = 10
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
  migration_database_name     = module.database_migration.rehearsal_database_name
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

module "database_migration" {
  source = "../../modules/database-migration"

  name_prefix = "piggyway-staging"
  aws_region  = var.aws_region
  cluster_arn = aws_ecs_cluster.this.arn

  subnet_ids         = values(module.network.app_subnet_ids)
  security_group_ids = [module.network.security_group_ids["migration"]]

  database_address            = module.database.address
  database_port               = module.database.port
  rehearsal_database_name     = "piggyway_migration_rehearsal_v6"
  database_master_secret_arn  = module.database.master_user_secret_arn
  directus_runtime_secret_arn = module.runtime_secrets.secret_arns["directus"]

  postgres_image = "docker.io/library/postgres@sha256:d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2"
}

resource "aws_ecs_cluster" "this" {
  name = "piggyway-staging"

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [configuration, setting]
  }
}

module "load_balancer" {
  source = "../../modules/load-balancer"

  name_prefix       = "piggyway-staging"
  vpc_id            = module.network.vpc_id
  public_subnet_ids = values(module.network.public_subnet_ids)
  security_group_id = module.network.security_group_ids["alb"]
  directus_hostname = "cms-staging.piggyway.com.au"
  backend_hostname  = "api-staging.piggyway.com.au"
  frontend_hostname = "staging.piggyway.com.au"
  certificate_domains = [
    "staging.piggyway.com.au",
    "api-staging.piggyway.com.au",
    "cms-staging.piggyway.com.au",
  ]
}

module "directus_service" {
  source = "../../modules/ecs-service"

  name_prefix  = "piggyway-staging"
  service_name = "directus"
  aws_region   = var.aws_region
  cluster_arn  = aws_ecs_cluster.this.arn

  image = join("@", [
    module.ecr.repository_urls["directus"],
    "sha256:fd26df4d6dc07c018209510a547302a8413e1791926cbece3db1a97b4b65aa14",
  ])
  repository_arn = module.ecr.repository_arns["directus"]
  container_port = 8055
  cpu            = 256
  memory         = 1024

  subnet_ids         = values(module.network.app_subnet_ids)
  security_group_ids = [module.network.security_group_ids["directus"]]
  target_group_arn   = module.load_balancer.directus_target_group_arn

  runtime_secret_arn = module.runtime_secrets.secret_arns["directus"]
  secret_keys = {
    SECRET      = "SECRET"
    DB_PASSWORD = "DB_PASSWORD"
  }
  environment = {
    DB_CLIENT                   = "pg"
    DB_HOST                     = module.database.address
    DB_PORT                     = tostring(module.database.port)
    DB_DATABASE                 = module.database_migration.rehearsal_database_name
    DB_USER                     = "piggyway_directus"
    DB_HEALTHCHECK_THRESHOLD    = "2000"
    DB_SSL                      = "true"
    DB_SSL__CA_FILE             = "/directus/certs/ap-southeast-2-bundle.pem"
    DB_SSL__REJECT_UNAUTHORIZED = "true"
    NODE_EXTRA_CA_CERTS         = "/directus/certs/ap-southeast-2-bundle.pem"
    PUBLIC_URL                  = "https://cms-staging.piggyway.com.au"
    EXTENSIONS_AUTO_RELOAD      = "false"
    WEBSOCKETS_ENABLED          = "true"
    MAX_PAYLOAD_SIZE            = "10000000"
    TELEMETRY                   = "false"
  }
  health_check_command = [
    "CMD-SHELL",
    "node -e \"fetch('http://127.0.0.1:8055/server/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))\"",
  ]
}

module "backend_service" {
  source = "../../modules/ecs-service"

  name_prefix  = "piggyway-staging"
  service_name = "backend"
  aws_region   = var.aws_region
  cluster_arn  = aws_ecs_cluster.this.arn

  image = join("@", [
    module.ecr.repository_urls["backend"],
    "sha256:9dd48002066dc49386c90aa1eb26773c150f4ca409171c1b357fea06ea4f33a9",
  ])
  repository_arn = module.ecr.repository_arns["backend"]
  container_port = 3000
  cpu            = 256
  memory         = 512

  subnet_ids                     = values(module.network.app_subnet_ids)
  security_group_ids             = [module.network.security_group_ids["backend"]]
  target_group_arn               = module.load_balancer.backend_target_group_arn
  service_discovery_registry_arn = module.network.backend_discovery_service_arn

  runtime_secret_arn = module.runtime_secrets.secret_arns["backend"]
  secret_keys = {
    DATABASE_URL          = "DATABASE_URL"
    FRONTEND_URL          = "FRONTEND_URL"
    JWT_SECRET            = "JWT_SECRET"
    PREVIEW_SECRET        = "PREVIEW_SECRET"
    STRIPE_SECRET_KEY     = "STRIPE_SECRET_KEY"
    STRIPE_WEBHOOK_SECRET = "STRIPE_WEBHOOK_SECRET"
    TOKEN_AUD             = "TOKEN_AUD"
    TOKEN_ISS             = "TOKEN_ISS"
  }
  environment = {
    NODE_ENV = "production"
    PORT     = "3000"
  }
  health_check_command = [
    "CMD-SHELL",
    "bun --eval \"fetch('http://127.0.0.1:3000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))\"",
  ]
}

module "frontend_service" {
  source = "../../modules/ecs-service"

  name_prefix  = "piggyway-staging"
  service_name = "frontend"
  aws_region   = var.aws_region
  cluster_arn  = aws_ecs_cluster.this.arn

  image = join("@", [
    module.ecr.repository_urls["frontend"],
    "sha256:ab3e93565bea7bfba3c9556a1b275b0e9dc57d6c1e6c9492291888a61e887c88",
  ])
  repository_arn = module.ecr.repository_arns["frontend"]
  container_port = 3000
  cpu            = 512
  memory         = 1024

  subnet_ids         = values(module.network.app_subnet_ids)
  security_group_ids = [module.network.security_group_ids["frontend"]]
  target_group_arn   = module.load_balancer.frontend_target_group_arn

  runtime_secret_arn = module.runtime_secrets.secret_arns["frontend"]
  secret_keys = {
    GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET"
    NEXTAUTH_SECRET      = "NEXTAUTH_SECRET"
    PREVIEW_SECRET       = "PREVIEW_SECRET"
    STRIPE_SECRET_KEY    = "STRIPE_SECRET_KEY"
  }
  environment = {
    API_BASE_URL                       = "http://backend.piggyway-staging.local:3000"
    GOOGLE_CLIENT_ID                   = "824335691426-8qc8qf33r97j12p0oa3hlatcr1psucju.apps.googleusercontent.com"
    NEXTAUTH_URL                       = "https://staging.piggyway.com.au"
    NEXT_PUBLIC_API_BASE_URL           = "https://api-staging.piggyway.com.au"
    NEXT_PUBLIC_APP_ENV                = "staging"
    NEXT_PUBLIC_APP_URL                = "https://staging.piggyway.com.au"
    NEXT_PUBLIC_SITE_URL               = "https://staging.piggyway.com.au"
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_51RztDm2MVUQW2ivytetjd1dakTP35LChNqpC3i3I0UdkOsapa7UJGlVgsOCj94opHFMA0nXQEpiBuJmOsry775tt00DvCZqQ6A"
    NEXT_PUBLIC_TURNSTILE_SITE_KEY     = "1x00000000000000000000AA"
    NEXT_TELEMETRY_DISABLED            = "1"
  }
  health_check_command = [
    "CMD-SHELL",
    "wget -q -O /dev/null \"http://$HOSTNAME:3000/api/health\"",
  ]
}

module "github_deploy" {
  source = "../../modules/github-oidc"

  role_name = "piggyway-staging-github-deploy"
  github_repositories = [
    "piggyway/piggy-backend",
    "piggyway/piggy-cms",
    "piggyway/piggy-frontend",
  ]
  github_environment = "staging"

  ecr_repository_arns = values(module.ecr.repository_arns)
  ecs_service_arns = [
    module.backend_service.service_arn,
    module.directus_service.service_arn,
    module.frontend_service.service_arn,
  ]
  ecs_run_task_definition_arns = [
    replace(
      module.database_bootstrap.backend_migration_task_definition_arn,
      "/:[0-9]+$/",
      ":*",
    ),
  ]
  ecs_run_task_cluster_arns = [aws_ecs_cluster.this.arn]
  ecs_pass_role_arns = [
    module.backend_service.execution_role_arn,
    module.backend_service.task_role_arn,
    module.database_bootstrap.execution_role_arn,
    module.database_bootstrap.task_role_arn,
    module.directus_service.execution_role_arn,
    module.directus_service.task_role_arn,
    module.frontend_service.execution_role_arn,
    module.frontend_service.task_role_arn,
  ]
}
