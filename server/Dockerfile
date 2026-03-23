# 微信云托管 Dockerfile - 优化版
FROM node:18-alpine

WORKDIR /app

# 安装编译原生模块所需的工具
RUN apk add --no-cache python3 make g++

# 复制 package.json
COPY package*.json ./

# 安装依赖
RUN npm install -g pnpm && pnpm install

# 复制源代码
COPY . .

# 构建 NestJS 项目
RUN pnpm build

# 暴露端口 3000
EXPOSE 3000

# 启动服务
CMD ["node", "dist/main.js"]
