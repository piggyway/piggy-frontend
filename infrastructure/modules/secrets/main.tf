resource "aws_secretsmanager_secret" "runtime" {
  for_each = var.services

  name                    = "${var.secret_path_prefix}/${each.key}"
  description             = "Piggyway staging ${each.key} runtime configuration"
  recovery_window_in_days = 7

  lifecycle {
    prevent_destroy = true
  }
}

data "aws_iam_policy_document" "read_runtime_secret" {
  for_each = var.services

  statement {
    sid = "ReadOwnRuntimeSecret"

    actions = [
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetSecretValue",
    ]

    resources = [aws_secretsmanager_secret.runtime[each.key].arn]
  }
}

resource "aws_iam_policy" "read_runtime_secret" {
  for_each = var.services

  name        = "${var.name_prefix}-${each.key}-runtime-secret-read"
  description = "Allow only the ${each.key} ECS execution role to read its staging runtime secret"
  policy      = data.aws_iam_policy_document.read_runtime_secret[each.key].json
}
