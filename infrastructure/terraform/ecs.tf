# ECS Cluster and Services

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${local.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${local.name_prefix}-cluster"
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${local.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false # Set true in production

  tags = {
    Name = "${local.name_prefix}-alb"
  }
}

# ALB Target Group for Orchestrator
resource "aws_lb_target_group" "orchestrator" {
  name        = "${local.name_prefix}-orchestrator-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 3
  }

  tags = {
    Name = "${local.name_prefix}-orchestrator-tg"
  }
}

# ALB Listener - HTTP (redirect to HTTPS) - only when certificate exists
resource "aws_lb_listener" "http" {
  count = var.certificate_arn != "" ? 1 : 0

  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# ALB Listener - HTTPS
resource "aws_lb_listener" "https" {
  count = var.certificate_arn != "" ? 1 : 0

  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.orchestrator.arn
  }
}

# ALB Listener - HTTP direct (for development without HTTPS)
resource "aws_lb_listener" "http_direct" {
  count = var.certificate_arn == "" ? 1 : 0

  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.orchestrator.arn
  }
}

# Orchestrator Task Definition
resource "aws_ecs_task_definition" "orchestrator" {
  family                   = "${local.name_prefix}-orchestrator"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.orchestrator_cpu
  memory                   = var.orchestrator_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.orchestrator_task.arn

  container_definitions = jsonencode([
    {
      name  = "orchestrator"
      image = var.orchestrator_image != "" ? var.orchestrator_image : "${aws_ecr_repository.orchestrator.repository_url}:latest"

      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "ENVIRONMENT", value = var.environment },
        { name = "AWS_REGION", value = local.region },
        { name = "ECS_CLUSTER_NAME", value = aws_ecs_cluster.main.name },
        { name = "ECS_TASK_DEFINITION", value = "${local.name_prefix}-sandbox" },
        { name = "ECS_SUBNETS", value = jsonencode(aws_subnet.private[*].id) },
        { name = "ECS_SECURITY_GROUPS", value = jsonencode([aws_security_group.sandbox.id]) },
        { name = "S3_BUCKET", value = aws_s3_bucket.scan_results.id }
      ]

      secrets = [
        {
          name      = "SUPABASE_URL"
          valueFrom = "${aws_secretsmanager_secret.supabase.arn}:url::"
        },
        {
          name      = "SUPABASE_SERVICE_KEY"
          valueFrom = "${aws_secretsmanager_secret.supabase.arn}:service_key::"
        },
        {
          name      = "LLM_PROVIDER"
          valueFrom = "${aws_secretsmanager_secret.llm.arn}:provider::"
        },
        {
          name      = "LLM_API_KEY"
          valueFrom = "${aws_secretsmanager_secret.llm.arn}:api_key::"
        },
        {
          name      = "LLM_MODEL"
          valueFrom = "${aws_secretsmanager_secret.llm.arn}:model::"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.orchestrator.name
          awslogs-region        = local.region
          awslogs-stream-prefix = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name = "${local.name_prefix}-orchestrator-task"
  }
}

# Orchestrator ECS Service
resource "aws_ecs_service" "orchestrator" {
  name                               = "${local.name_prefix}-orchestrator"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.orchestrator.arn
  desired_count                      = var.orchestrator_desired_count
  launch_type                        = "FARGATE"
  platform_version                   = "LATEST"
  health_check_grace_period_seconds  = 60

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.orchestrator.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.orchestrator.arn
    container_name   = "orchestrator"
    container_port   = 8000
  }

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100

  deployment_controller {
    type = "ECS"
  }

  depends_on = [
    aws_lb_listener.http_direct
  ]

  tags = {
    Name = "${local.name_prefix}-orchestrator-service"
  }
}

# Sandbox Task Definition (used by orchestrator to run scan tasks)
resource "aws_ecs_task_definition" "sandbox" {
  family                   = "${local.name_prefix}-sandbox"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.sandbox_cpu
  memory                   = var.sandbox_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.sandbox_task.arn

  container_definitions = jsonencode([
    {
      name  = "sandbox"
      image = var.sandbox_image

      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        },
        {
          containerPort = 56789
          hostPort      = 56789
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "TOOL_SERVER_PORT", value = "5000" },
        { name = "CAIDO_PORT", value = "56789" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.sandbox.name
          awslogs-region        = local.region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "${local.name_prefix}-sandbox-task"
  }
}

# Auto Scaling for Orchestrator
resource "aws_appautoscaling_target" "orchestrator" {
  max_capacity       = 10
  min_capacity       = var.orchestrator_desired_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.orchestrator.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "orchestrator_cpu" {
  name               = "${local.name_prefix}-orchestrator-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.orchestrator.resource_id
  scalable_dimension = aws_appautoscaling_target.orchestrator.scalable_dimension
  service_namespace  = aws_appautoscaling_target.orchestrator.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
