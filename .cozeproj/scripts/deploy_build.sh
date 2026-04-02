#!/bin/bash
set -Eeuo pipefail

cd "${COZE_WORKSPACE_PATH}"
if [ -f "./.cozeproj/scripts/init_env.sh" ]; then
    echo "⚙️ Initializing environment..."
    bash ./.cozeproj/scripts/init_env.sh
else
    echo "⚠️ Warning: init_env.sh not found, skipping environment init."
fi

# 动态注入环境变量
if [ -n "${COZE_PROJECT_DOMAIN_DEFAULT:-}" ]; then
    export PROJECT_DOMAIN="$COZE_PROJECT_DOMAIN_DEFAULT"
    echo "✅ 环境变量已注入: PROJECT_DOMAIN=$PROJECT_DOMAIN"
fi

echo "Installing dependencies..."
pnpm install

echo "Building the Taro WeApp project..."
pnpm build:weapp

echo "Build completed successfully! Assets are in /dist"
