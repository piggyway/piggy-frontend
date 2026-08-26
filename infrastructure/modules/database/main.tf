resource "aws_db_subnet_group" "this" {
  name        = var.db_subnet_group_name
  description = var.description
  subnet_ids  = var.subnet_ids

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_db_instance" "this" {
  identifier = var.db_instance_identifier

  engine         = "postgres"
  engine_version = var.engine_version
  instance_class = var.instance_class

  # Fail instead of silently entering paid RDS Extended Support after the
  # configured PostgreSQL major version reaches end of standard support.
  engine_lifecycle_support = "open-source-rds-extended-support-disabled"

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.database_name
  username = var.master_username
  port     = 5432

  manage_master_user_password = true

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = var.vpc_security_group_ids
  publicly_accessible    = false
  multi_az               = false

  # AWS Free Plan currently restricts newly created RDS instances to one day
  # of automated backup retention. Revisit this when the account is upgraded.
  backup_retention_period = 1
  backup_window           = "15:00-15:30"
  maintenance_window      = "sun:16:00-sun:16:30"

  auto_minor_version_upgrade  = true
  allow_major_version_upgrade = false
  apply_immediately           = false

  deletion_protection       = true
  skip_final_snapshot       = false
  final_snapshot_identifier = var.final_snapshot_identifier
  copy_tags_to_snapshot     = true

  performance_insights_enabled = false
  monitoring_interval          = 0

  lifecycle {
    prevent_destroy = true

    # RDS may advance the minor version automatically. Update this module's
    # pinned version after verifying the new minor instead of downgrading it.
    ignore_changes = [engine_version]
  }
}

data "aws_iam_policy_document" "bootstrap_master_secret_read" {
  statement {
    sid = "ReadRDSManagedMasterSecret"

    actions = [
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetSecretValue",
    ]

    resources = [aws_db_instance.this.master_user_secret[0].secret_arn]
  }
}

resource "aws_iam_policy" "bootstrap_master_secret_read" {
  name        = "${var.name_prefix}-database-bootstrap-master-secret-read"
  description = "Allow the one-off staging database bootstrap task to read only the RDS-managed master credential"
  policy      = data.aws_iam_policy_document.bootstrap_master_secret_read.json
}
