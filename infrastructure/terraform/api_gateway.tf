# API Gateway (optional - for rate limiting and custom domain)
# If you use ALB directly, you can skip this

# API Gateway REST API
resource "aws_api_gateway_rest_api" "main" {
  count = var.domain_name != "" ? 1 : 0

  name        = "${local.name_prefix}-api"
  description = "Esprit API Gateway"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name = "${local.name_prefix}-api"
  }
}

# VPC Link for private integration
resource "aws_api_gateway_vpc_link" "main" {
  count = var.domain_name != "" ? 1 : 0

  name        = "${local.name_prefix}-vpc-link"
  target_arns = [aws_lb.main.arn]

  tags = {
    Name = "${local.name_prefix}-vpc-link"
  }
}

# Proxy resource to forward all requests
resource "aws_api_gateway_resource" "proxy" {
  count = var.domain_name != "" ? 1 : 0

  rest_api_id = aws_api_gateway_rest_api.main[0].id
  parent_id   = aws_api_gateway_rest_api.main[0].root_resource_id
  path_part   = "{proxy+}"
}

# ANY method for proxy
resource "aws_api_gateway_method" "proxy" {
  count = var.domain_name != "" ? 1 : 0

  rest_api_id   = aws_api_gateway_rest_api.main[0].id
  resource_id   = aws_api_gateway_resource.proxy[0].id
  http_method   = "ANY"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

# Integration with ALB via VPC Link
resource "aws_api_gateway_integration" "proxy" {
  count = var.domain_name != "" ? 1 : 0

  rest_api_id = aws_api_gateway_rest_api.main[0].id
  resource_id = aws_api_gateway_resource.proxy[0].id
  http_method = aws_api_gateway_method.proxy[0].http_method

  type                    = "HTTP_PROXY"
  integration_http_method = "ANY"
  uri                     = "http://${aws_lb.main.dns_name}/{proxy}"
  connection_type         = "VPC_LINK"
  connection_id           = aws_api_gateway_vpc_link.main[0].id

  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
  }
}

# Root method (for /health, etc.)
resource "aws_api_gateway_method" "root" {
  count = var.domain_name != "" ? 1 : 0

  rest_api_id   = aws_api_gateway_rest_api.main[0].id
  resource_id   = aws_api_gateway_rest_api.main[0].root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "root" {
  count = var.domain_name != "" ? 1 : 0

  rest_api_id = aws_api_gateway_rest_api.main[0].id
  resource_id = aws_api_gateway_rest_api.main[0].root_resource_id
  http_method = aws_api_gateway_method.root[0].http_method

  type                    = "HTTP_PROXY"
  integration_http_method = "ANY"
  uri                     = "http://${aws_lb.main.dns_name}/"
  connection_type         = "VPC_LINK"
  connection_id           = aws_api_gateway_vpc_link.main[0].id
}

# Deployment
resource "aws_api_gateway_deployment" "main" {
  count = var.domain_name != "" ? 1 : 0

  rest_api_id = aws_api_gateway_rest_api.main[0].id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.proxy[0].id,
      aws_api_gateway_method.proxy[0].id,
      aws_api_gateway_integration.proxy[0].id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_method.proxy,
    aws_api_gateway_integration.proxy,
    aws_api_gateway_method.root,
    aws_api_gateway_integration.root,
  ]
}

# Stage with throttling
resource "aws_api_gateway_stage" "main" {
  count = var.domain_name != "" ? 1 : 0

  deployment_id = aws_api_gateway_deployment.main[0].id
  rest_api_id   = aws_api_gateway_rest_api.main[0].id
  stage_name    = var.environment

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId       = "$context.requestId"
      ip              = "$context.identity.sourceIp"
      caller          = "$context.identity.caller"
      user            = "$context.identity.user"
      requestTime     = "$context.requestTime"
      httpMethod      = "$context.httpMethod"
      resourcePath    = "$context.resourcePath"
      status          = "$context.status"
      protocol        = "$context.protocol"
      responseLength  = "$context.responseLength"
      integrationLatency = "$context.integrationLatency"
    })
  }

  tags = {
    Name = "${local.name_prefix}-api-stage"
  }
}

# Method throttling settings
resource "aws_api_gateway_method_settings" "main" {
  count = var.domain_name != "" ? 1 : 0

  rest_api_id = aws_api_gateway_rest_api.main[0].id
  stage_name  = aws_api_gateway_stage.main[0].stage_name
  method_path = "*/*"

  settings {
    throttling_rate_limit  = var.api_rate_limit
    throttling_burst_limit = var.api_burst_limit
    metrics_enabled        = true
    logging_level          = "INFO"
    data_trace_enabled     = false
  }
}

# Custom domain (optional)
resource "aws_api_gateway_domain_name" "main" {
  count = var.domain_name != "" && var.certificate_arn != "" ? 1 : 0

  domain_name              = var.domain_name
  regional_certificate_arn = var.certificate_arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name = "${local.name_prefix}-domain"
  }
}

# Base path mapping
resource "aws_api_gateway_base_path_mapping" "main" {
  count = var.domain_name != "" && var.certificate_arn != "" ? 1 : 0

  api_id      = aws_api_gateway_rest_api.main[0].id
  stage_name  = aws_api_gateway_stage.main[0].stage_name
  domain_name = aws_api_gateway_domain_name.main[0].domain_name
}
