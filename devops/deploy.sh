#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Pulling latest changes..."
git -C "$REPO_DIR" pull --ff-only

echo "==> Building and starting containers..."
docker compose -f "$REPO_DIR/web/docker-compose.yml" up --build -d

echo "==> Pruning dangling images..."
docker image prune -f

echo "==> Done."
