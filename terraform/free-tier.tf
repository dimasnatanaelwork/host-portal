# Add lifecycle rules to minimize costs
resource "aws_s3_bucket_lifecycle_configuration" "portfolio_lifecycle" {
  bucket = aws_s3_bucket.portfolio_website.id

  rule {
    id     = "cost-optimization"
    status = "Enabled"

    # Optional: Transition to cheaper storage after 30 days
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    # Optional: Delete old versions after 90 days
    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}