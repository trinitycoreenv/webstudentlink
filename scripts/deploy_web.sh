#!/usr/bin/env bash
set -euo pipefail

APP_DIR=${APP_DIR:-/var/www/web}
cd "$APP_DIR"

BRANCH=$(git rev-parse --abbrev-ref HEAD || echo main)

echo "Pulling latest from origin/$BRANCH..."
git fetch --all --tags
if ! git pull --ff-only origin "$BRANCH"; then
  git reset --hard "origin/$BRANCH"
fi

npm ci --legacy-peer-deps
npm run build

pm2 reload webstudentlink || pm2 start npm --name "webstudentlink" -- start
pm2 save

echo "Web deploy completed."