# 微信云托管 Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package.json
COPY package*.json ./

# 安装依赖
RUN npm install -g pnpm && pnpm install

# 复制源代码
COPY . .

# 构建
RUN pnpm build

# 暴露端口 3000（NestJS 默认端口）
EXPOSE 3000

# 启动服务
CMD ["node", "dist/main.js"]
