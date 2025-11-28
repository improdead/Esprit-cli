# IAM Roles and Policies

# ECS Task Execution Role (used by ECS to pull images, write logs)
resource "aws_iam_role" "ecs_execution" {
  name = "${local.name_prefix}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Allow ECS to read secrets from Secrets Manager
resource "aws_iam_role_policy" "ecs_execution_secrets" {
  name = "${local.name_prefix}-ecs-secrets-policy"
  role = aws_iam_role.ecs_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          aws_secretsmanager_secret.supabase.arn,
          aws_secretsmanager_secret.llm.arn
        ]
      }
    ]
  })
}

# ECS Task Role for Orchestrator (permissions the container needs)
resource "aws_iam_role" "orchestrator_task" {
  name = "${local.name_prefix}-orchestrator-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Orchestrator needs to manage sandbox ECS tasks
resource "aws_iam_role_policy" "orchestrator_ecs" {
  name = "${local.name_prefix}-orchestrator-ecs-policy"
  role = aws_iam_role.orchestrator_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecs:RunTask",
          "ecs:StopTask",
          "ecs:DescribeTasks",
          "ecs:ListTasks"
        ]
        Resource = "*"
        Condition = {
          ArnEquals = {
            "ecs:cluster" = aws_ecs_cluster.main.arn
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "ecs:DescribeTaskDefinition"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:PassRole"
        ]
        Resource = [
          aws_iam_role.ecs_execution.arn,
          aws_iam_role.sandbox_task.arn
        ]
      }
    ]
  })
}

# Orchestrator needs access to S3 for scan results
resource "aws_iam_role_policy" "orchestrator_s3" {
  name = "${local.name_prefix}-orchestrator-s3-policy"
  role = aws_iam_role.orchestrator_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.scan_results.arn,
          "${aws_s3_bucket.scan_results.arn}/*"
        ]
      }
    ]
  })
}

# Orchestrator CloudWatch Logs
resource "aws_iam_role_policy" "orchestrator_logs" {
  name = "${local.name_prefix}-orchestrator-logs-policy"
  role = aws_iam_role.orchestrator_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.orchestrator.arn}:*"
      }
    ]
  })
}

# ECS Task Role for Sandbox (minimal permissions)
resource "aws_iam_role" "sandbox_task" {
  name = "${local.name_prefix}-sandbox-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Sandbox needs minimal S3 access to upload scan artifacts
resource "aws_iam_role_policy" "sandbox_s3" {
  name = "${local.name_prefix}-sandbox-s3-policy"
  role = aws_iam_role.sandbox_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.scan_results.arn}/*"
      }
    ]
  })
}

# Sandbox CloudWatch Logs
resource "aws_iam_role_policy" "sandbox_logs" {
  name = "${local.name_prefix}-sandbox-logs-policy"
  role = aws_iam_role.sandbox_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.sandbox.arn}:*"
      }
    ]
  })
}
