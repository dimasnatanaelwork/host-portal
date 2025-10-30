#!/bin/bash

set -e

echo "Building Vue.js application..."

# Install dependencies
npm install

# Run type checking
npm run type-check

# Build the project
npm run build

# Create a build info file
echo "Build date: $(date)" > dist/build-info.txt
echo "Commit: $(git rev-parse HEAD 2>/dev/null || echo 'unknown')" >> dist/build-info.txt

echo "Build completed successfully!"