# Esprit Infrastructure Makefile

.PHONY: init plan apply destroy push-orchestrator push-sandbox

# Terraform commands
init:
	cd terraform && terraform init

plan:
	cd terraform && terraform plan

apply:
	cd terraform && terraform apply

destroy:
	cd terraform && terraform destroy

# Get outputs
outputs:
	cd terraform && terraform output

# ECR login (run this before pushing images)
ecr-login:
	aws ecr get-login-password --region $$(cd terraform && terraform output -raw aws_region 2>/dev/null || echo "us-east-1") | \
		docker login --username AWS --password-stdin $$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$$(cd terraform && terraform output -raw aws_region 2>/dev/null || echo "us-east-1").amazonaws.com

# Build and push orchestrator image
push-orchestrator: ecr-login
	@ECR_URL=$$(cd terraform && terraform output -raw orchestrator_ecr_url); \
	echo "Building orchestrator image..."; \
	docker build -t esprit-orchestrator ../backend; \
	docker tag esprit-orchestrator:latest $$ECR_URL:latest; \
	echo "Pushing to $$ECR_URL..."; \
	docker push $$ECR_URL:latest; \
	echo "Done! Update your ECS service to use the new image."

# Build and push sandbox image (optional - only if customizing)
push-sandbox: ecr-login
	@ECR_URL=$$(cd terraform && terraform output -raw sandbox_ecr_url); \
	echo "Building sandbox image..."; \
	docker build -t esprit-sandbox ../cli/containers; \
	docker tag esprit-sandbox:latest $$ECR_URL:latest; \
	echo "Pushing to $$ECR_URL..."; \
	docker push $$ECR_URL:latest

# Force new deployment of orchestrator
deploy-orchestrator:
	@CLUSTER=$$(cd terraform && terraform output -raw ecs_cluster_name); \
	SERVICE=$$(cd terraform && terraform output -raw orchestrator_service_name); \
	echo "Forcing new deployment of $$SERVICE..."; \
	aws ecs update-service --cluster $$CLUSTER --service $$SERVICE --force-new-deployment; \
	echo "Deployment started. Check AWS console for status."

# View orchestrator logs
logs-orchestrator:
	@LOG_GROUP=$$(cd terraform && terraform output -raw orchestrator_log_group); \
	aws logs tail $$LOG_GROUP --follow

# View sandbox logs
logs-sandbox:
	@LOG_GROUP=$$(cd terraform && terraform output -raw sandbox_log_group); \
	aws logs tail $$LOG_GROUP --follow

# Full deployment
deploy-all: init apply push-orchestrator deploy-orchestrator
	@echo "Full deployment complete!"
	@echo "API URL: http://$$(cd terraform && terraform output -raw alb_dns_name)"

# Print backend .env config
backend-env:
	@cd terraform && terraform output -raw backend_env_config

# Help
help:
	@echo "Esprit Infrastructure Commands:"
	@echo ""
	@echo "  make init              - Initialize Terraform"
	@echo "  make plan              - Preview infrastructure changes"
	@echo "  make apply             - Apply infrastructure changes"
	@echo "  make destroy           - Destroy all infrastructure"
	@echo ""
	@echo "  make push-orchestrator - Build and push orchestrator image to ECR"
	@echo "  make push-sandbox      - Build and push sandbox image to ECR"
	@echo "  make deploy-orchestrator - Force new ECS deployment"
	@echo ""
	@echo "  make logs-orchestrator - Tail orchestrator logs"
	@echo "  make logs-sandbox      - Tail sandbox logs"
	@echo ""
	@echo "  make backend-env       - Print backend .env configuration"
	@echo "  make deploy-all        - Full deployment (init + apply + push + deploy)"
