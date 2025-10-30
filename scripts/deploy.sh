#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Directories
TERRAFORM_DIR="terraform"
ANSIBLE_DIR="ansible"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

check_dependencies() {
    log "Checking dependencies..."
    
    command -v terraform >/dev/null 2>&1 || error "Terraform is not installed"
    command -v ansible >/dev/null 2>&1 || error "Ansible is not installed"
    command -v aws >/dev/null 2>&1 || error "AWS CLI is not installed"
    command -v npm >/dev/null 2>&1 || error "Node.js and npm are not installed"
    
    log "All dependencies are satisfied"
}

setup_infrastructure() {
    log "Setting up AWS infrastructure with Terraform..."
    
    cd "$PROJECT_ROOT/$TERRAFORM_DIR"
    
    terraform init
    terraform plan -out=tfplan
    terraform apply tfplan
    
    # Extract outputs
    S3_BUCKET=$(terraform output -raw s3_bucket_name)
    CLOUDFRONT_DISTRIBUTION=$(terraform output -raw cloudfront_distribution_id 2>/dev/null || echo "")
    
    cd "$PROJECT_ROOT"
    
    export S3_BUCKET
    export CLOUDFRONT_DISTRIBUTION
}

build_and_deploy() {
    log "Building and deploying application with Ansible..."
    
    cd "$PROJECT_ROOT"
    
    ansible-playbook \
        "$ANSIBLE_DIR/deploy.yml" \
        -e "s3_bucket_name=$S3_BUCKET" \
        -e "cloudfront_distribution_id=$CLOUDFRONT_DISTRIBUTION" \
        -e "project_root=$PROJECT_ROOT"
}

show_urls() {
    log "Deployment completed successfully!"
    log "Your website is available at:"
    
    cd "$PROJECT_ROOT/$TERRAFORM_DIR"
    
    WEBSITE_URL=$(terraform output -raw website_url 2>/dev/null || echo "")
    CLOUDFRONT_URL=$(terraform output -raw cloudfront_url 2>/dev/null || echo "")
    
    if [ -n "$WEBSITE_URL" ]; then
        log "S3 Website URL: http://$WEBSITE_URL"
    fi
    
    if [ -n "$CLOUDFRONT_URL" ]; then
        log "CloudFront URL: https://$CLOUDFRONT_URL"
    fi
    
    cd "$PROJECT_ROOT"
}

main() {
    log "Starting portfolio website deployment..."
    
    check_dependencies
    setup_infrastructure
    build_and_deploy
    show_urls
    
    log "Deployment process completed!"
}

# Run main function
main "$@"