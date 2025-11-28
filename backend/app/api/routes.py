"""
API routes for the Esprit Backend service.
"""

import httpx
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.auth import CurrentUser
from app.core.config import settings
from app.models.schemas import (
    LLMGenerateRequest,
    LLMGenerateResponse,
    QuotaCheckResponse,
    SandboxCreateRequest,
    SandboxCreateResponse,
    SandboxStatusResponse,
    UsageResponse,
)
from app.services.llm_service import llm_service
from app.services.sandbox_service import sandbox_service
from app.services.usage_service import usage_service

router = APIRouter()


# GitHub OAuth models
class GitHubCallbackRequest(BaseModel):
    code: str


class GitHubCallbackResponse(BaseModel):
    access_token: str
    username: str


# Health check
@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Sandbox endpoints
@router.post("/sandbox", response_model=SandboxCreateResponse)
async def create_sandbox(
    request: SandboxCreateRequest,
    user: CurrentUser,
):
    """
    Create a new sandbox for a penetration test scan.

    This spins up an ECS Fargate task with the Esprit sandbox container.
    """
    # Check quota first
    quota = await usage_service.check_quota(user.sub)
    if not quota.has_quota:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=quota.message or "Quota exceeded",
        )

    # Create sandbox
    result = await sandbox_service.create_sandbox(request, user.sub)

    # Increment scan count
    await usage_service.increment_scan_count(user.sub)

    return result


@router.get("/sandbox/{sandbox_id}", response_model=SandboxStatusResponse)
async def get_sandbox_status(
    sandbox_id: str,
    user: CurrentUser,
):
    """Get the status of a sandbox."""
    result = await sandbox_service.get_sandbox_status(sandbox_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sandbox not found",
        )
    return result


@router.delete("/sandbox/{sandbox_id}")
async def destroy_sandbox(
    sandbox_id: str,
    user: CurrentUser,
):
    """Stop and clean up a sandbox."""
    success = await sandbox_service.destroy_sandbox(sandbox_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sandbox not found or already stopped",
        )
    return {"status": "destroyed"}


# LLM Proxy endpoints
@router.post("/llm/generate", response_model=LLMGenerateResponse)
async def generate_llm_response(
    request: LLMGenerateRequest,
    user: CurrentUser,
):
    """
    Proxy LLM request using our API key.

    This allows users to run scans without needing their own API keys.
    """
    # Check token quota
    quota = await usage_service.check_quota(user.sub)
    if quota.tokens_remaining <= 0:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Token quota exceeded. Upgrade your plan for more tokens.",
        )

    result = await llm_service.generate(request, user.sub)

    # Track token usage
    await usage_service.add_tokens_used(user.sub, result.tokens_used)

    return result


# Usage endpoints
@router.get("/user/usage", response_model=UsageResponse)
async def get_user_usage(user: CurrentUser):
    """Get current user's usage stats for this month."""
    return await usage_service.get_usage(user.sub)


@router.get("/user/quota", response_model=QuotaCheckResponse)
async def check_user_quota(user: CurrentUser):
    """Check if user has remaining quota for a new scan."""
    return await usage_service.check_quota(user.sub)


# GitHub OAuth endpoints
@router.post("/github/callback", response_model=GitHubCallbackResponse)
async def github_callback(
    request: GitHubCallbackRequest,
    user: CurrentUser,
):
    """
    Exchange GitHub OAuth code for access token.

    This is called from the frontend after GitHub redirects back.
    """
    try:
        async with httpx.AsyncClient() as client:
            # Exchange code for token
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": settings.github_client_id,
                    "client_secret": settings.github_client_secret,
                    "code": request.code,
                },
                headers={"Accept": "application/json"},
            )

            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to exchange code for token",
                )

            token_data = token_response.json()
            access_token = token_data.get("access_token")

            if not access_token:
                error = token_data.get("error_description", "Unknown error")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"GitHub OAuth error: {error}",
                )

            # Get user info
            user_response = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
            )

            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to fetch GitHub user info",
                )

            github_user = user_response.json()

            return GitHubCallbackResponse(
                access_token=access_token,
                username=github_user.get("login", ""),
            )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"GitHub API request failed: {str(e)}",
        )
