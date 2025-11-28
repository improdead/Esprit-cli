# Esprit SaaS Infrastructure
# Terraform configuration for AWS ECS, ECR, API Gateway, and supporting services

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment to use S3 backend for state storage
  # backend "s3" {
  #   bucket         = "esprit-terraform-state"
  #   key            = "infrastructure/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "esprit-terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Esprit"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Locals
locals {
  account_id = data.aws_caller_identity.current.account_id
  region     = data.aws_region.current.name

  name_prefix = "esprit-${var.environment}"

  common_tags = {
    Project     = "Esprit"
    Environment = var.environment
  }
}
