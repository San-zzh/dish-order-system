#!/bin/bash

cd "${COZE_WORKSPACE_PATH}"

# 设置项目域名环境变量
if [ -n "${COZE_PROJECT_DOMAIN_DEFAULT:-}" ]; then
    export PROJECT_DOMAIN="$COZE_PROJECT_DOMAIN_DEFAULT"
    echo "✅ PROJECT_DOMAIN 已设置: $PROJECT_DOMAIN"
else
    # 默认使用硬编码的域名
    export PROJECT_DOMAIN="https://dish-api-237436-9-1414911774.sh.run.tcloudbase.com"
    echo "✅ PROJECT_DOMAIN 使用默认值: $PROJECT_DOMAIN"
fi

echo "✅ 初始化完成"
