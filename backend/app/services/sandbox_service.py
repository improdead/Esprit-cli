"""
Sandbox management service for AWS ECS.

Handles creation, monitoring, and destruction of scan sandboxes.
"""

import uuid
from datetime import datetime, timedelta, timezone

import boto3
import structlog
from botocore.exceptions import ClientError

from app.core.config import get_settings
from app.models.schemas import SandboxCreateRequest, SandboxCreateResponse, SandboxStatusResponse

logger = structlog.get_logger()
settings = get_settings()


class SandboxService:
    """Service for managing ECS sandbox tasks."""

    def __init__(self) -> None:
        self.ecs_client = boto3.client(
            "ecs",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
        self.ec2_client = boto3.client(
            "ec2",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )

    async def create_sandbox(
        self,
        request: SandboxCreateRequest,
        user_id: str,
    ) -> SandboxCreateResponse:
        """
        Create a new sandbox (ECS Fargate task) for a scan.
        """
        sandbox_id = f"sandbox-{uuid.uuid4().hex[:12]}"

        try:
            # Run ECS task
            response = self.ecs_client.run_task(
                cluster=settings.ecs_cluster_name,
                taskDefinition=settings.ecs_task_definition,
                launchType="FARGATE",
                networkConfiguration={
                    "awsvpcConfiguration": {
                        "subnets": settings.ecs_subnets,
                        "securityGroups": settings.ecs_security_groups,
                        "assignPublicIp": "ENABLED",
                    }
                },
                overrides={
                    "containerOverrides": [
                        {
                            "name": "sandbox",
                            "environment": [
                                {"name": "SCAN_ID", "value": request.scan_id},
                                {"name": "TARGET", "value": request.target},
                                {"name": "TARGET_TYPE", "value": request.target_type},
                                {"name": "SCAN_TYPE", "value": request.scan_type},
                                {"name": "USER_ID", "value": user_id},
                                {"name": "SANDBOX_ID", "value": sandbox_id},
                                # The sandbox will call back to our API for LLM requests
                                {"name": "LLM_PROXY_URL", "value": f"{settings.app_name}/api/v1/llm/generate"},
                            ],
                        }
                    ]
                },
                tags=[
                    {"key": "SandboxId", "value": sandbox_id},
                    {"key": "UserId", "value": user_id},
                    {"key": "ScanId", "value": request.scan_id},
                ],
            )

            task_arn = response["tasks"][0]["taskArn"] if response["tasks"] else None

            logger.info(
                "Sandbox created",
                sandbox_id=sandbox_id,
                task_arn=task_arn,
                user_id=user_id,
            )

            return SandboxCreateResponse(
                sandbox_id=sandbox_id,
                status="creating",
                expires_at=datetime.now(tz=timezone.utc) + timedelta(hours=2),
            )

        except ClientError as e:
            logger.error("Failed to create sandbox", error=str(e))
            raise

    async def get_sandbox_status(self, sandbox_id: str) -> SandboxStatusResponse | None:
        """
        Get the status of a sandbox.
        """
        try:
            # List tasks with the sandbox tag
            response = self.ecs_client.list_tasks(
                cluster=settings.ecs_cluster_name,
                desiredStatus="RUNNING",
            )

            if not response["taskArns"]:
                return SandboxStatusResponse(
                    sandbox_id=sandbox_id,
                    status="stopped",
                )

            # Describe tasks to find our sandbox
            tasks_response = self.ecs_client.describe_tasks(
                cluster=settings.ecs_cluster_name,
                tasks=response["taskArns"],
            )

            for task in tasks_response["tasks"]:
                # Check tags for matching sandbox ID
                tags = {t["key"]: t["value"] for t in task.get("tags", [])}
                if tags.get("SandboxId") == sandbox_id:
                    # Get public IP
                    public_ip = None
                    attachments = task.get("attachments", [])
                    for attachment in attachments:
                        if attachment["type"] == "ElasticNetworkInterface":
                            for detail in attachment.get("details", []):
                                if detail["name"] == "networkInterfaceId":
                                    eni_id = detail["value"]
                                    # Get ENI details for public IP
                                    eni_response = self.ec2_client.describe_network_interfaces(
                                        NetworkInterfaceIds=[eni_id]
                                    )
                                    if eni_response["NetworkInterfaces"]:
                                        association = eni_response["NetworkInterfaces"][0].get("Association", {})
                                        public_ip = association.get("PublicIp")

                    status = "running" if task["lastStatus"] == "RUNNING" else "creating"
                    tool_server_url = f"http://{public_ip}:5000" if public_ip else None

                    return SandboxStatusResponse(
                        sandbox_id=sandbox_id,
                        status=status,
                        tool_server_url=tool_server_url,
                        public_ip=public_ip,
                        started_at=task.get("startedAt"),
                    )

            return SandboxStatusResponse(
                sandbox_id=sandbox_id,
                status="stopped",
            )

        except ClientError as e:
            logger.error("Failed to get sandbox status", error=str(e))
            return None

    async def destroy_sandbox(self, sandbox_id: str) -> bool:
        """
        Stop and clean up a sandbox.
        """
        try:
            # Find and stop the task
            response = self.ecs_client.list_tasks(
                cluster=settings.ecs_cluster_name,
                desiredStatus="RUNNING",
            )

            for task_arn in response.get("taskArns", []):
                # Check if this is our sandbox
                tags_response = self.ecs_client.list_tags_for_resource(resourceArn=task_arn)
                tags = {t["key"]: t["value"] for t in tags_response.get("tags", [])}

                if tags.get("SandboxId") == sandbox_id:
                    self.ecs_client.stop_task(
                        cluster=settings.ecs_cluster_name,
                        task=task_arn,
                        reason="Sandbox destroyed by user",
                    )
                    logger.info("Sandbox destroyed", sandbox_id=sandbox_id)
                    return True

            return False

        except ClientError as e:
            logger.error("Failed to destroy sandbox", error=str(e))
            return False


# Singleton instance
sandbox_service = SandboxService()
