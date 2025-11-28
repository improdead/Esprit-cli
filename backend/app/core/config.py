"""
Configuration settings for the Esprit Backend service.
"""

from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # App
    app_name: str = "Esprit Backend"
    debug: bool = False
    environment: Literal["development", "staging", "production", "prod", "dev"] = "development"

    # Supabase
    supabase_url: str
    supabase_service_key: str  # Service role key for backend operations

    # AWS
    aws_region: str = "us-east-1"
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None

    # ECS Configuration
    ecs_cluster_name: str = "esprit-sandboxes"
    ecs_task_definition: str = "esprit-sandbox"
    ecs_subnets: list[str] = []
    ecs_security_groups: list[str] = []

    # LLM Configuration (we provide the API key)
    llm_provider: str = "anthropic"
    llm_api_key: str
    llm_model: str = "claude-sonnet-4-20250514"

    # Rate Limiting
    redis_url: str = "redis://localhost:6379"

    # GitHub OAuth (for repo integration)
    github_client_id: str = ""
    github_client_secret: str = ""

    # S3 Configuration (for scan results)
    s3_bucket: str = ""

    # Plan Limits
    free_scans_per_month: int = 5
    free_tokens_per_month: int = 100_000
    pro_scans_per_month: int = 50
    pro_tokens_per_month: int = 1_000_000
    team_scans_per_month: int = 999999  # Unlimited
    team_tokens_per_month: int = 10_000_000


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Export settings instance for easy importing
settings = get_settings()
