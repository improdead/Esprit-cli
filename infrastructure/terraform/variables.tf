# Esprit Infrastructure Variables

variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

# ECS Configuration
variable "sandbox_cpu" {
  description = "CPU units for sandbox task (1024 = 1 vCPU)"
  type        = number
  default     = 2048
}

variable "sandbox_memory" {
  description = "Memory for sandbox task in MB"
  type        = number
  default     = 4096
}

variable "orchestrator_cpu" {
  description = "CPU units for orchestrator task"
  type        = number
  default     = 512
}

variable "orchestrator_memory" {
  description = "Memory for orchestrator task in MB"
  type        = number
  default     = 1024
}

variable "orchestrator_desired_count" {
  description = "Number of orchestrator instances"
  type        = number
  default     = 2
}

# Container Configuration
variable "sandbox_image" {
  description = "Docker image for sandbox container"
  type        = string
  default     = "ghcr.io/usestrix/strix-sandbox:0.1.10"
}

variable "orchestrator_image" {
  description = "Docker image for orchestrator (will be built and pushed)"
  type        = string
  default     = "" # Set after ECR push
}

# Domain Configuration
variable "domain_name" {
  description = "Domain name for the API (e.g., api.esprit.dev)"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default     = ""
}

# Secrets (passed via environment, not stored in state)
variable "supabase_url" {
  description = "Supabase project URL"
  type        = string
  sensitive   = true
}

variable "supabase_service_key" {
  description = "Supabase service role key"
  type        = string
  sensitive   = true
}

variable "llm_api_key" {
  description = "LLM provider API key (Anthropic/OpenAI)"
  type        = string
  sensitive   = true
}

variable "llm_provider" {
  description = "LLM provider (anthropic, openai)"
  type        = string
  default     = "anthropic"
}

variable "llm_model" {
  description = "LLM model to use"
  type        = string
  default     = "claude-sonnet-4-20250514"
}

# Rate Limiting
variable "api_rate_limit" {
  description = "API requests per second limit"
  type        = number
  default     = 100
}

variable "api_burst_limit" {
  description = "API burst limit"
  type        = number
  default     = 200
}
