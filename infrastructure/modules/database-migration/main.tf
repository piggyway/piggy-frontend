locals {
  source_secret_name = "piggyway/staging/neon-migration-source"

  migration_command = <<-EOT
    export PGPASSWORD="$MASTER_PASSWORD"

    psql \
      --host "$DB_HOST" \
      --port "$DB_PORT" \
      --dbname postgres \
      --username "$MASTER_USERNAME" \
      --set ON_ERROR_STOP=on \
      --set rehearsal_database="$REHEARSAL_DATABASE" <<'SQL'
    SELECT format('CREATE DATABASE %I', :'rehearsal_database')
    WHERE NOT EXISTS (
      SELECT 1 FROM pg_database WHERE datname = :'rehearsal_database'
    )
    \gexec
    SQL

    pg_dump \
      --schema-only \
      --format=custom \
      --no-owner \
      --no-privileges \
      --file /tmp/neon.dump \
      "$NEON_SOURCE_DATABASE_URL"

    pg_restore \
      --no-owner \
      --no-privileges \
      --file /tmp/neon.sql \
      /tmp/neon.dump

    sed -i '/^SET transaction_timeout = 0;$/d' /tmp/neon.sql

    psql \
      --host "$DB_HOST" \
      --port "$DB_PORT" \
      --dbname "$REHEARSAL_DATABASE" \
      --username "$MASTER_USERNAME" \
      --set ON_ERROR_STOP=on \
      --single-transaction \
      --file /tmp/neon.sql

    psql "$NEON_SOURCE_DATABASE_URL" --tuples-only --no-align --command "
      SELECT DISTINCT directus_user_id
      FROM (
        SELECT uploaded_by AS directus_user_id FROM directus_files WHERE uploaded_by IS NOT NULL
        UNION
        SELECT modified_by AS directus_user_id FROM directus_files WHERE modified_by IS NOT NULL
      ) AS referenced_directus_users
    " | while IFS= read -r directus_user_id; do
      psql \
        --host "$DB_HOST" \
        --port "$DB_PORT" \
        --dbname "$REHEARSAL_DATABASE" \
        --username "$MASTER_USERNAME" \
        --set ON_ERROR_STOP=on \
        --command "INSERT INTO directus_users (id, email, status, provider) VALUES ('$directus_user_id'::uuid, 'migration-placeholder-$directus_user_id@example.invalid', 'suspended', 'default') ON CONFLICT (id) DO NOTHING;"
    done

    pg_dump \
      --data-only \
      --format=custom \
      --no-owner \
      --no-privileges \
      --file /tmp/neon.dump \
      --exclude-table-data=public.users \
      --exclude-table-data=public.user_addresses \
      --exclude-table-data=public.refresh_tokens \
      --exclude-table-data=public.carts \
      --exclude-table-data=public.cart_items \
      --exclude-table-data=public.cart_item_add_ons \
      --exclude-table-data=public.checkout_intents \
      --exclude-table-data=public.orders \
      --exclude-table-data=public.order_items \
      --exclude-table-data=public.order_item_add_ons \
      --exclude-table-data=public.promo_code_usage \
      --exclude-table-data=public.boarding_bookings \
      --exclude-table-data=public.boarding_booking_pets \
      --exclude-table-data=public.email_login_tokens \
      --exclude-table-data=public.directus_users \
      --exclude-table-data=public.directus_sessions \
      --exclude-table-data=public.directus_activity \
      --exclude-table-data=public.directus_revisions \
      --exclude-table-data=public.directus_access \
      --exclude-table-data=public.directus_comments \
      --exclude-table-data=public.directus_dashboards \
      --exclude-table-data=public.directus_deployment_projects \
      --exclude-table-data=public.directus_deployment_runs \
      --exclude-table-data=public.directus_deployments \
      --exclude-table-data=public.directus_flows \
      --exclude-table-data=public.directus_notifications \
      --exclude-table-data=public.directus_oauth_codes \
      --exclude-table-data=public.directus_oauth_consents \
      --exclude-table-data=public.directus_oauth_tokens \
      --exclude-table-data=public.directus_operations \
      --exclude-table-data=public.directus_panels \
      --exclude-table-data=public.directus_presets \
      --exclude-table-data=public.directus_shares \
      --exclude-table-data=public.directus_versions \
      "$NEON_SOURCE_DATABASE_URL"

    pg_restore \
      --no-owner \
      --no-privileges \
      --file /tmp/neon.sql \
      /tmp/neon.dump

    sed -i '/^SET transaction_timeout = 0;$/d' /tmp/neon.sql

    psql \
      --host "$DB_HOST" \
      --port "$DB_PORT" \
      --dbname "$REHEARSAL_DATABASE" \
      --username "$MASTER_USERNAME" \
      --set ON_ERROR_STOP=on \
      --single-transaction \
      --file /tmp/neon.sql

    psql \
      --host "$DB_HOST" \
      --port "$DB_PORT" \
      --dbname "$REHEARSAL_DATABASE" \
      --username "$MASTER_USERNAME" \
      --set ON_ERROR_STOP=on \
      --set rehearsal_database="$REHEARSAL_DATABASE" <<'SQL'
    ALTER SCHEMA public OWNER TO piggyway_directus;

    SELECT format('ALTER TABLE %I.%I OWNER TO piggyway_directus', schemaname, tablename)
    FROM pg_tables
    WHERE schemaname = 'public'
    \gexec

    SELECT format('ALTER SEQUENCE %I.%I OWNER TO piggyway_directus', schemaname, sequencename)
    FROM pg_sequences
    WHERE schemaname = 'public'
    \gexec

    SELECT format(
      'GRANT CONNECT ON DATABASE %I TO piggyway_directus, piggyway_backend',
      :'rehearsal_database'
    )
    \gexec
    GRANT USAGE ON SCHEMA public TO piggyway_backend;
    SQL

    export PGPASSWORD="$DIRECTUS_DB_PASSWORD"
    psql \
      --host "$DB_HOST" \
      --port "$DB_PORT" \
      --dbname "$REHEARSAL_DATABASE" \
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

    SELECT count(*)::int AS migrated_product_count FROM product_info;
    SQL

    rm -f /tmp/neon.dump /tmp/neon.sql
  EOT

  log_configuration = {
    logDriver = "awslogs"
    options = {
      awslogs-group         = aws_cloudwatch_log_group.this.name
      awslogs-region        = var.aws_region
      awslogs-stream-prefix = "migration"
    }
  }
}

resource "aws_secretsmanager_secret" "source" {
  name                    = local.source_secret_name
  description             = "Temporary Neon source database connection for the one-off staging migration rehearsal"
  recovery_window_in_days = 7
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/ecs/${var.name_prefix}-database-migration"
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
  name               = "${var.name_prefix}-database-migration-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
}

data "aws_iam_policy_document" "execution" {
  statement {
    sid       = "GetECRAuthorizationToken"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    sid = "WriteMigrationLogs"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.this.arn}:*"]
  }

  statement {
    sid = "ReadMigrationSecrets"
    actions = [
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetSecretValue",
    ]
    resources = [
      aws_secretsmanager_secret.source.arn,
      var.database_master_secret_arn,
      var.directus_runtime_secret_arn,
    ]
  }
}

resource "aws_iam_role_policy" "execution" {
  name   = "${var.name_prefix}-database-migration-execution"
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.execution.json
}

resource "aws_iam_role" "task" {
  name               = "${var.name_prefix}-database-migration-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
}

resource "aws_ecs_task_definition" "this" {
  family                   = "${var.name_prefix}-database-migration"
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
      name      = "database-migration"
      image     = var.postgres_image
      essential = true
      command   = ["sh", "-ceu", local.migration_command]
      environment = [
        { name = "DB_HOST", value = var.database_address },
        { name = "DB_PORT", value = tostring(var.database_port) },
        { name = "REHEARSAL_DATABASE", value = var.rehearsal_database_name },
      ]
      secrets = [
        { name = "NEON_SOURCE_DATABASE_URL", valueFrom = aws_secretsmanager_secret.source.arn },
        { name = "MASTER_USERNAME", valueFrom = "${var.database_master_secret_arn}:username::" },
        { name = "MASTER_PASSWORD", valueFrom = "${var.database_master_secret_arn}:password::" },
        { name = "DIRECTUS_DB_PASSWORD", valueFrom = "${var.directus_runtime_secret_arn}:DB_PASSWORD::" },
      ]
      logConfiguration = local.log_configuration
    }
  ])
}
