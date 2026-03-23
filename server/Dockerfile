# 微信云托管 Dockerfile - 极简版
FROM node:18-slim

WORKDIR /app

# 安装必要的编译工具
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# 复制 package.json
COPY package*.json ./

# 使用 npm 安装依赖（更稳定）
RUN npm install

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 暴露端口 3000
EXPOSE 3000

# 启动服务
CMD ["node", "dist/main.js"]
