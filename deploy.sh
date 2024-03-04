#!/bin/bash

# Check if there are changes
if git pull origin main | grep -q 'Already up to date'; then
  echo "No changes. Exiting."
  exit 0
fi

# Restart the Docker containers
echo "Restarting containers."
docker-compose -f docker-compose.yaml up -d

echo "Done."

