# YouMind Clone 推送指南

## 📦 仓库已准备就绪

项目位置：`/Users/claw/Desktop/.openclaw/.openclaw/workspace-fast/youmind-clone`

## 🚀 推送到 GitHub（3 种方法）

### 方法 1: 使用 GitHub Desktop（最简单）

1. 打开 GitHub Desktop
2. File → Add Local Repository
3. 选择文件夹：`/Users/claw/Desktop/.openclaw/.openclaw/workspace-fast/youmind-clone`
4. 输入仓库名称：`youmind-clone`
5. 点击 "Create repository"
6. 点击 "Publish repository"

### 方法 2: 使用命令行（需要 SSH 配置）

```bash
cd /Users/claw/Desktop/.openclaw/.openclaw/workspace-fast/youmind-clone

# 1. 创建 SSH Key（如果没有）
ssh-keygen -t ed25519 -C "mjscjjb@163.com"

# 2. 添加 SSH Key 到 GitHub
# 复制 ~/.ssh/id_ed25519.pub 的内容到 GitHub Settings → SSH Keys

# 3. 创建远程仓库（在 GitHub 网页上）
# 访问 https://github.com/new
# 仓库名：youmind-clone
# 不要勾选 "Initialize this repository with a README"

# 4. 推送代码
git remote add origin git@github.com:mjscjj/youmind-clone.git
git branch -M main
git push -u origin main
```

### 方法 3: 使用 GitHub CLI

```bash
# 1. 登录 GitHub
gh auth login

# 2. 创建并推送仓库
cd /Users/claw/Desktop/.openclaw/.openclaw/workspace-fast/youmind-clone
gh repo create youmind-clone --public --source=. --push
```

## 📝 已排除的文件

以下文件不会被推送（已在 .gitignore 中配置）：

- `node_modules/` - NPM 依赖
- `dist/` - 构建产物
- `*.db` - 数据库文件
- `.env*` - 环境变量
- `.vscode/` - IDE 配置
- `.DS_Store` - macOS 系统文件

## ✅ 已包含的文件

- ✅ 源代码 (`src/`, `internal/`)
- ✅ 配置文件 (`package.json`, `tsconfig.json`, `vite.config.ts`)
- ✅ 文档 (`README.md`, `FUNCTIONS.md`)
- ✅ Docker 配置 (`infra/docker/`)
- ✅ 公共资源 (`public/`)

## 📊 仓库统计

- **总文件数**: ~29 个
- **代码行数**: ~6,599 行
- **语言**: TypeScript, Go, CSS

---

**创建时间：** 2026 年 2 月 18 日
