#!/bin/bash

# Set NODE_OPTIONS environment variable
export NODE_OPTIONS="--openssl-legacy-provider --no-deprecation"

# Build packages in order
echo "Building api-client package..."
cd packages/api-client
yarn build

echo "Building composables package..."
cd ../composables
yarn build

echo "Building theme package..."
cd ../theme
yarn build

echo "All packages built successfully!" 