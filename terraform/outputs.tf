output "website_url" {
  description = "URL of the portfolio website"
  value       = aws_s3_bucket_website_configuration.portfolio_website.website_endpoint
}

output "cloudfront_url" {
  description = "CloudFront distribution URL"
  value       = aws_cloudfront_distribution.portfolio_distribution.domain_name
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.portfolio_website.bucket
}