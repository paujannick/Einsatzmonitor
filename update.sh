#!/usr/bin/env bash
set -e

# Update repository and dependencies
git pull
npm install

echo "Update completed."
