# CloudWatch Log Groups

# Orchestrator service logs
resource "aws_cloudwatch_log_group" "orchestrator" {
  name              = "/ecs/${local.name_prefix}-orchestrator"
  retention_in_days = 30

  tags = {
    Name = "${local.name_prefix}-orchestrator-logs"
  }
}

# Sandbox task logs
resource "aws_cloudwatch_log_group" "sandbox" {
  name              = "/ecs/${local.name_prefix}-sandbox"
  retention_in_days = 7 # Shorter retention for sandbox logs

  tags = {
    Name = "${local.name_prefix}-sandbox-logs"
  }
}

# API Gateway access logs
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/api-gateway/${local.name_prefix}"
  retention_in_days = 30

  tags = {
    Name = "${local.name_prefix}-api-gateway-logs"
  }
}

# CloudWatch Alarms

# High error rate alarm
resource "aws_cloudwatch_metric_alarm" "orchestrator_errors" {
  alarm_name          = "${local.name_prefix}-orchestrator-high-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "5XXError"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "High error rate on orchestrator"

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  alarm_actions = []  # Add SNS topic ARN for notifications
}

# Sandbox task failures
resource "aws_cloudwatch_metric_alarm" "sandbox_failures" {
  alarm_name          = "${local.name_prefix}-sandbox-task-failures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "TaskCount"
  namespace           = "ECS/ContainerInsights"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "High sandbox task failure rate"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = "sandbox"
  }

  alarm_actions = []  # Add SNS topic ARN for notifications
}
