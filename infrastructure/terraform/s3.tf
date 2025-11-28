# S3 Bucket for scan results and reports

resource "aws_s3_bucket" "scan_results" {
  bucket = "${local.name_prefix}-scan-results-${local.account_id}"

  tags = {
    Name = "${local.name_prefix}-scan-results"
  }
}

# Enable versioning for audit trail
resource "aws_s3_bucket_versioning" "scan_results" {
  bucket = aws_s3_bucket.scan_results.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Encrypt at rest
resource "aws_s3_bucket_server_side_encryption_configuration" "scan_results" {
  bucket = aws_s3_bucket.scan_results.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block public access
resource "aws_s3_bucket_public_access_block" "scan_results" {
  bucket = aws_s3_bucket.scan_results.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle rule - delete old scan artifacts after 90 days
resource "aws_s3_bucket_lifecycle_configuration" "scan_results" {
  bucket = aws_s3_bucket.scan_results.id

  rule {
    id     = "delete-old-artifacts"
    status = "Enabled"

    filter {
      prefix = "artifacts/"
    }

    expiration {
      days = 90
    }
  }

  rule {
    id     = "transition-reports"
    status = "Enabled"

    filter {
      prefix = "reports/"
    }

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}

# CORS configuration for pre-signed URL uploads
resource "aws_s3_bucket_cors_configuration" "scan_results" {
  bucket = aws_s3_bucket.scan_results.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"] # Restrict in production
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
