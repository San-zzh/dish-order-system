# GitHub 推送指南

## 方法一：使用 Personal Access Token

### 1. 创建 Token
1. 登录 GitHub → 右上角头像 → Settings
2. 左侧菜单最下方 → Developer settings
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. 勾选 repo 权限
6. 点击 Generate token
7. **复制 Token**（只显示一次，注意保存）

### 2. 使用 Token 推送

```bash
cd /workspace/projects
git remote set-url origin https://<TOKEN>@github.com/San-zzh/dish-order-system.git
git push -u origin main
```

替换 `<TOKEN>` 为你的 Token

---

## 方法二：本地电脑推送

如果你有本地 Git 环境：

### 1. 下载项目代码
我帮你打包项目：