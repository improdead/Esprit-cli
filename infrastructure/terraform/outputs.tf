# Terraform Outputs

# VPC
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

# Security Groups
output "alb_security_group_id" {
  description = "ALB security group ID"
  value       = aws_security_group.alb.id
}

output "orchestrator_security_group_id" {
  description = "Orchestrator security group ID"
  value       = aws_security_group.orchestrator.id
}

output "sandbox_security_group_id" {
  description = "Sandbox security group ID"
  value       = aws_security_group.sandbox.id
}

# Load Balancer
output "alb_dns_name" {
  description = "ALB DNS name (use this for API calls)"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB zone ID (for Route53 alias records)"
  value       = aws_lb.main.zone_id
}

# ECS
output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  description = "ECS cluster ARN"
  value       = aws_ecs_cluster.main.arn
}

output "orchestrator_service_name" {
  description = "Orchestrator ECS service name"
  value       = aws_ecs_service.orchestrator.name
}

output "sandbox_task_definition" {
  description = "Sandbox task definition ARN"
  value       = aws_ecs_task_definition.sandbox.arn
}

# ECR
output "orchestrator_ecr_url" {
  description = "Orchestrator ECR repository URL"
  value       = aws_ecr_repository.orchestrator.repository_url
}

output "sandbox_ecr_url" {
  description = "Sandbox ECR repository URL"
  value       = aws_ecr_repository.sandbox.repository_url
}

# S3
output "scan_results_bucket" {
  description = "S3 bucket for scan results"
  value       = aws_s3_bucket.scan_results.id
}

# API Gateway (if enabled)
output "api_gateway_url" {
  description = "API Gateway invoke URL"
  value       = var.domain_name != "" ? "https://${aws_api_gateway_stage.main[0].invoke_url}" : null
}

output "custom_domain_url" {
  description = "Custom domain URL"
  value       = var.domain_name != "" && var.certificate_arn != "" ? "https://${var.domain_name}" : null
}

# CloudWatch
output "orchestrator_log_group" {
  description = "Orchestrator CloudWatch log group"
  value       = aws_cloudwatch_log_group.orchestrator.name
}

output "sandbox_log_group" {
  description = "Sandbox CloudWatch log group"
  value       = aws_cloudwatch_log_group.sandbox.name
}

# For backend .env configuration
output "backend_env_config" {
  description = "Environment variables for backend configuration"
  value       = <<-EOT
    # Add these to your backend .env file:
    AWS_REGION=${local.region}
    ECS_CLUSTER_NAME=${aws_ecs_cluster.main.name}
    ECS_TASK_DEFINITION=${aws_ecs_task_definition.sandbox.family}
    ECS_SUBNETS=${jsonencode(aws_subnet.private[*].id)}
    ECS_SECURITY_GROUPS=${jsonencode([aws_security_group.sandbox.id])}
    S3_BUCKET=${aws_s3_bucket.scan_results.id}
    API_URL=http://${aws_lb.main.dns_name}
  EOT
  sensitive   = false
}
