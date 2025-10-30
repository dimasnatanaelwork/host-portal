variable "bucket_name" {
  description = "Name of the S3 bucket for the portfolio website"
  type        = string
  default     = "my-portfolio-website-12345" # Change this to unique name
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}