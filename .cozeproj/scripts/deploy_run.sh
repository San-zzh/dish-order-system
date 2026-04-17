#!/bin/bash
set -Eeuo pipefail

cd "${COZE_WORKSPACE_PATH}"

port="${DEPLOY_RUN_PORT:-3000}"
echo "Starting Static File Server on port ${port} for WeApp preview..."

# 使用 npx serve 提供 dist 目录
npx serve -s dist -l "${port}"
