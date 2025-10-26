# #!/bin/bash
# echo "🚀 Deploying to Staging Environment..."

# # Build for staging
# export VITE_API_HOST=https://staging-wa.janustech.co
# export VITE_BPORTAL_HOST=https://staging-business.janustech.co

# # Build the app
# npm run build

# # Copy to server
# echo "📤 Copying files to server..."
# gcloud compute scp --recurse --zone=asia-southeast1-a dist janus:/home/dimasnatanael/merchantportal_staging

# # Run deployment commands on server
# echo "🔧 Running deployment commands on server..."
# gcloud compute ssh janus --zone=asia-southeast1-a --command="
#     cd /var/www/merchantportal_fe_staging/
#     sudo rm -rf dist/
#     sudo cp -R /home/dimasnatanael/merchantportal_staging/dist/ .
#     sudo chown -R www-data:www-data dist/
#     sudo systemctl reload apache2
#     cd /home/dimasnatanael/merchantportal_staging
#     rm -rf dist/
#     exit
# "

# echo "✅ Staging deployment completed!"