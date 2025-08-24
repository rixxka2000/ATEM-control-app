#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Move into that directory
cd "$SCRIPT_DIR" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running npm install..."
  npm install
else
  echo "Dependencies already installed."
fi

# Run npm start
npm start