# Secrets Manager for sensitive configuration

# Supabase credentials
resource "aws_secretsmanager_secret" "supabase" {
  name        = "${local.name_prefix}/supabase"
  description = "Supabase configuration for Esprit"

  tags = {
    Name = "${local.name_prefix}-supabase-secret"
  }
}

resource "aws_secretsmanager_secret_version" "supabase" {
  secret_id = aws_secretsmanager_secret.supabase.id
  secret_string = jsonencode({
    url         = var.supabase_url
    service_key = var.supabase_service_key
  })
}

# LLM API credentials
resource "aws_secretsmanager_secret" "llm" {
  name        = "${local.name_prefix}/llm"
  description = "LLM API configuration for Esprit"

  tags = {
    Name = "${local.name_prefix}-llm-secret"
  }
}

resource "aws_secretsmanager_secret_version" "llm" {
  secret_id = aws_secretsmanager_secret.llm.id
  secret_string = jsonencode({
    provider = var.llm_provider
    api_key  = var.llm_api_key
    model    = var.llm_model
  })
}
