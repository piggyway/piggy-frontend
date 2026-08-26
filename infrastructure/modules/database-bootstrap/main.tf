locals {
  database_users_command = <<-EOT
    export PGPASSWORD="$MASTER_PASSWORD"
    psql \
      --host "$DB_HOST" \
      --port "$DB_PORT" \
      --dbname "$DB_NAME" \
      --username "$MASTER_USERNAME" \
      --set ON_ERROR_STOP=on \
      --set database_name="$DB_NAME" \
      --set directus_password="$DIRECTUS_DB_PASSWORD" \
      --set backend_password="$BACKEND_DB_PASSWORD" <<'SQL'
    SELECT format('CREATE ROLE piggyway_directus LOGIN PASSWORD %L', :'directus_password')
    WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'piggyway_directus')
    \gexec

    SELECT format('CREATE ROLE piggyway_backend LOGIN PASSWORD %L', :'backend_password')
    WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'piggyway_backend')
    \gexec

    ALTER ROLE piggyway_directus WITH LOGIN PASSWORD :'directus_password';
    ALTER ROLE piggyway_backend WITH LOGIN PASSWORD :'backend_password';

    SELECT format(
      'GRANT CONNECT ON DATABASE %I TO piggyway_directus, piggyway_backend',
      :'database_name'
    )
    \gexec
    REVOKE CREATE ON SCHEMA public FROM PUBLIC;
    GRANT USAGE, CREATE ON SCHEMA public TO piggyway_directus;
    GRANT USAGE ON SCHEMA public TO piggyway_backend;
    SQL
  EOT

  database_permissions_command = <<-EOT
    export PGPASSWORD="$DIRECTUS_DB_PASSWORD"
    psql \
      --host "$DB_HOST" \
      --port "$DB_PORT" \
      --dbname "$DB_NAME" \
      --username piggyway_directus \
      --set ON_ERROR_STOP=on <<'SQL'
    SELECT format(
      'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE %I.%I TO piggyway_backend',
      schemaname,
      tablename
    )
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT LIKE 'directus\_%' ESCAPE '\'
    \gexec

    SELECT format(
      'GRANT USAGE, SELECT, UPDATE ON SEQUENCE %I.%I TO piggyway_backend',
      schemaname,
      sequencename
    )
    FROM pg_sequences
    WHERE schemaname = 'public'
      AND sequencename NOT LIKE 'directus\_%' ESCAPE '\'
    \gexec
    SQL
  EOT

  common_environment = [
    { name = "DB_HOST", value = var.database_address },
    { name = "DB_PORT", value = tostring(var.database_port) },
    { name = "DB_NAME", value = var.database_name },
  ]

  log_configuration = {
    logDriver = "awslogs"
    options = {
      awslogs-group         = aws_cloudwatch_log_group.bootstrap.name
      awslogs-region        = var.aws_region
      awslogs-stream-prefix = "bootstrap"
    }
  }
}

resource "aws_cloudwatch_log_group" "bootstrap" {
  name              = "/aws/ecs/${var.name_prefix}-database-bootstrap"
  retention_in_days = var.log_retention_days
}

data "aws_iam_policy_document" "ecs_tasks_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "execution" {
  name               = "${var.name_prefix}-database-bootstrap-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
}

data "aws_iam_policy_document" "execution" {
  statement {
    sid       = "GetECRAuthorizationToken"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    sid = "PullDirectusImage"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
    ]
    resources = [var.directus_repository_arn]
  }

  statement {
    sid = "PullBackendImage"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
    ]
    resources = [var.backend_repository_arn]
  }

  statement {
    sid = "WriteBootstrapLogs"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.bootstrap.arn}:*"]
  }

  statement {
    sid = "ReadBootstrapSecrets"
    actions = [
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetSecretValue",
    ]
    resources = [
      var.database_master_secret_arn,
      var.directus_runtime_secret_arn,
      var.backend_runtime_secret_arn,
    ]
  }
}

resource "aws_iam_role_policy" "execution" {
  name   = "${var.name_prefix}-database-bootstrap-execution"
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.execution.json
}

resource "aws_iam_role" "task" {
  name               = "${var.name_prefix}-database-bootstrap-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
}

resource "aws_ecs_task_definition" "database_users" {
  family                   = "${var.name_prefix}-database-users"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn
  skip_destroy             = true

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name        = "database-users"
      image       = var.postgres_image
      essential   = true
      command     = ["sh", "-ceu", local.database_users_command]
      environment = local.common_environment
      secrets = [
        { name = "MASTER_USERNAME", valueFrom = "${var.database_master_secret_arn}:username::" },
        { name = "MASTER_PASSWORD", valueFrom = "${var.database_master_secret_arn}:password::" },
        { name = "DIRECTUS_DB_PASSWORD", valueFrom = "${var.directus_runtime_secret_arn}:DB_PASSWORD::" },
        { name = "BACKEND_DB_PASSWORD", valueFrom = "${var.backend_runtime_secret_arn}:DB_PASSWORD::" },
      ]
      logConfiguration = local.log_configuration
    }
  ])
}

resource "aws_ecs_task_definition" "directus_schema" {
  family                   = "${var.name_prefix}-directus-schema"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 1024
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn
  skip_destroy             = true

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "directus-schema"
      image     = var.directus_image
      essential = true
      command   = ["sh", "/directus/directus-sync-cmd/bootstrap-schema.sh"]
      environment = [
        { name = "DB_CLIENT", value = "pg" },
        { name = "DB_HOST", value = var.database_address },
        { name = "DB_PORT", value = tostring(var.database_port) },
        { name = "DB_DATABASE", value = var.database_name },
        { name = "DB_USER", value = "piggyway_directus" },
        { name = "DB_HEALTHCHECK_THRESHOLD", value = "2000" },
        { name = "DB_SSL", value = "true" },
        { name = "DB_SSL__CA_FILE", value = "/directus/certs/ap-southeast-2-bundle.pem" },
        { name = "DB_SSL__REJECT_UNAUTHORIZED", value = "true" },
        { name = "NODE_EXTRA_CA_CERTS", value = "/directus/certs/ap-southeast-2-bundle.pem" },
        { name = "DIRECTUS_URL", value = "http://127.0.0.1:8055" },
        { name = "PUBLIC_URL", value = var.directus_public_url },
        { name = "EXTENSIONS_AUTO_RELOAD", value = "false" },
      ]
      secrets = [
        { name = "SECRET", valueFrom = "${var.directus_runtime_secret_arn}:SECRET::" },
        { name = "DB_PASSWORD", valueFrom = "${var.directus_runtime_secret_arn}:DB_PASSWORD::" },
        { name = "ADMIN_EMAIL", valueFrom = "${var.directus_runtime_secret_arn}:ADMIN_EMAIL::" },
        { name = "ADMIN_PASSWORD", valueFrom = "${var.directus_runtime_secret_arn}:ADMIN_PASSWORD::" },
        { name = "DIRECTUS_ADMIN_EMAIL", valueFrom = "${var.directus_runtime_secret_arn}:ADMIN_EMAIL::" },
        { name = "DIRECTUS_ADMIN_PASSWORD", valueFrom = "${var.directus_runtime_secret_arn}:ADMIN_PASSWORD::" },
      ]
      logConfiguration = local.log_configuration
    }
  ])
}

resource "aws_ecs_task_definition" "database_permissions" {
  family                   = "${var.name_prefix}-database-permissions"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn
  skip_destroy             = true

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name        = "database-permissions"
      image       = var.postgres_image
      essential   = true
      command     = ["sh", "-ceu", local.database_permissions_command]
      environment = local.common_environment
      secrets = [
        { name = "DIRECTUS_DB_PASSWORD", valueFrom = "${var.directus_runtime_secret_arn}:DB_PASSWORD::" },
      ]
      logConfiguration = local.log_configuration
    }
  ])
}

resource "aws_ecs_task_definition" "backend_schema" {
  family                   = "${var.name_prefix}-backend-schema"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn
  skip_destroy             = true

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "backend-schema"
      image     = var.backend_image
      essential = true
      command   = ["bun", "run", "db:schema:staging"]
      environment = [
        { name = "STAGING_SEED_CONFIRM", value = "piggyway-staging" },
      ]
      secrets = [
        { name = "DATABASE_URL", valueFrom = "${var.directus_runtime_secret_arn}:DATABASE_URL::" },
      ]
      logConfiguration = local.log_configuration
    }
  ])
}

resource "aws_ecs_task_definition" "backend_migration" {
  family                   = "${var.name_prefix}-backend-migration"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn
  skip_destroy             = true

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "backend-migration"
      image     = var.backend_image
      essential = true
      command   = ["bun", "run", "db:migrate"]
      environment = [
        { name = "STAGING_MIGRATION_CONFIRM", value = "piggyway-staging" },
        { name = "STAGING_DATABASE_NAME", value = var.migration_database_name },
      ]
      secrets = [
        { name = "DATABASE_URL", valueFrom = "${var.backend_runtime_secret_arn}:DATABASE_URL::" },
        { name = "MIGRATION_DB_PASSWORD", valueFrom = "${var.directus_runtime_secret_arn}:DB_PASSWORD::" },
      ]
      logConfiguration = local.log_configuration
    }
  ])
}

resource "aws_ecs_task_definition" "backend_seed" {
  family                   = "${var.name_prefix}-backend-seed"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn
  skip_destroy             = true

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "backend-seed"
      image     = var.backend_image
      essential = true
      command   = ["bun", "run", "db:seed:staging"]
      environment = [
        { name = "STAGING_SEED_CONFIRM", value = "piggyway-staging" },
      ]
      secrets = [
        { name = "DATABASE_URL", valueFrom = "${var.backend_runtime_secret_arn}:DATABASE_URL::" },
      ]
      logConfiguration = local.log_configuration
    }
  ])
}
