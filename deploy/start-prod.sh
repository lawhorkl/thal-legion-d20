#!/usr/bin/env bash
# Starts the production stack on the shared reverse-proxy network.
set -euo pipefail

APP_DIR=${APP_DIR:-/opt/thal-legion-d20}
COMPOSE_FILE=${COMPOSE_FILE:-compose.yml}
NETWORK_NAME=${NETWORK_NAME:-web}

cd "${APP_DIR}"

echo "==> Ensuring Docker network ${NETWORK_NAME}"
docker network inspect "${NETWORK_NAME}" >/dev/null 2>&1 || docker network create "${NETWORK_NAME}"

echo "==> Pulling images"
docker compose -f "${COMPOSE_FILE}" pull

echo "==> Starting Thal Legion D20"
docker compose -f "${COMPOSE_FILE}" up -d --remove-orphans
