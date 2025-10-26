# #!/bin/bash
# echo "🚀 Deploying to Production Environment..."

# # Build for staging
# export VITE_API_HOST=https://wa.janustech.co
# export VITE_BPORTAL_HOST=https://business.janustech.co

# # Build the app
# npm run build

# # Copy to server
# echo "📤 Copying files to server..."
# gcloud compute scp --recurse --zone=asia-southeast1-a dist janus:/home/dimasnatanael

# # Run deployment commands on server
# echo "🔧 Running deployment commands on server..."
# gcloud compute ssh janus --zone=asia-southeast1-a --command="
#     cd /var/www/merchantportal_fe/
#     sudo rm -rf dist/
#     sudo cp -R /home/dimasnatanael/dist/ .
#     sudo chown -R www-data:www-data dist/
#     sudo systemctl reload apache2
#     cd /home/dimasnatanael
#     rm -rf dist/
#     exit
# "

# echo "✅ Production deployment completed!"