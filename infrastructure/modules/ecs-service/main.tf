locals {
  full_service_name = "${var.name_prefix}-${var.service_name}"

  log_configuration = {
    logDriver = "awslogs"
    options = {
      awslogs-group         = aws_cloudwatch_log_group.this.name
      awslogs-region        = var.aws_region
      awslogs-stream-prefix = var.service_name
    }
  }
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/ecs/${local.full_service_name}"
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
  name               = "${local.full_service_name}-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
}

data "aws_iam_policy_document" "execution" {
  statement {
    sid       = "GetECRAuthorizationToken"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }

  statement {
    sid = "PullServiceImage"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
    ]
    resources = [var.repository_arn]
  }

  statement {
    sid = "WriteServiceLogs"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.this.arn}:*"]
  }

  statement {
    sid = "ReadRuntimeSecret"
    actions = [
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetSecretValue",
    ]
    resources = [var.runtime_secret_arn]
  }
}

resource "aws_iam_role_policy" "execution" {
  name   = "${local.full_service_name}-execution"
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.execution.json
}

resource "aws_iam_role" "task" {
  name               = "${local.full_service_name}-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
}

resource "aws_ecs_task_definition" "this" {
  family                   = local.full_service_name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn
  skip_destroy             = true

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = var.service_name
      image     = var.image
      essential = true
      portMappings = [
        {
          name          = var.service_name
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]
      environment = [
        for name in sort(keys(var.environment)) : {
          name  = name
          value = var.environment[name]
        }
      ]
      secrets = [
        for name in sort(keys(var.secret_keys)) : {
          name      = name
          valueFrom = "${var.runtime_secret_arn}:${var.secret_keys[name]}::"
        }
      ]
      healthCheck = {
        command     = var.health_check_command
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = var.health_check_start_period
      }
      readonlyRootFilesystem = false
      logConfiguration       = local.log_configuration
    }
  ])
}

resource "aws_ecs_service" "this" {
  name                               = local.full_service_name
  cluster                            = var.cluster_arn
  task_definition                    = aws_ecs_task_definition.this.arn
  desired_count                      = var.desired_count
  launch_type                        = "FARGATE"
  platform_version                   = "LATEST"
  health_check_grace_period_seconds  = var.health_check_grace_period_seconds
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  enable_execute_command             = false
  propagate_tags                     = "SERVICE"

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = var.security_group_ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = var.service_name
    container_port   = var.container_port
  }

  dynamic "service_registries" {
    for_each = var.service_discovery_registry_arn == null ? [] : [var.service_discovery_registry_arn]

    content {
      registry_arn = service_registries.value
    }
  }

  lifecycle {
    # Application delivery registers immutable task-definition revisions
    # outside Terraform. Terraform continues to own the service itself.
    ignore_changes = [task_definition]
  }
}
