# YouMind Backend - AI 研究创作平台后端

基于 Go 的高性能后端服务，为 YouMind Clone 提供完整的 API 支持

## 🌟 特性

- 🔐 **认证系统** - JWT 认证，用户注册/登录
- 📋 **看板管理** - 完整的 CRUD 操作
- 📄 **内容管理** - 笔记、链接、文件管理
- 💬 **聊天系统** - AI 对话、技能调用
- 🗄️ **数据存储** - SQLite 数据库，GORM ORM
- 🚀 **高性能** - Gin 框架，中间件支持

## 📁 项目结构

```
youmind-backend/
├── cmd/
│   └── server/
│       └── main.go           # 应用入口
├── internal/
│   ├── handler/              # HTTP 处理器
│   │   ├── auth_handler.go   # 认证处理器
│   │   ├── board_handler.go  # 看板处理器
│   │   └── content_handler.go# 内容处理器
│   ├── service/              # 业务逻辑
│   │   └── jwt.go            # JWT 服务
│   ├── model/                # 数据模型
│   │   ├── user.go           # 用户模型
│   │   ├── board.go          # 看板模型
│   │   └── content.go        # 内容模型
│   ├── middleware/           # 中间件
│   │   └── auth.go           # 认证中间件
│   └── pkg/
│       ├── database/         # 数据库
│       ├── minio/            # 对象存储
│       └── qdrant/           # 向量数据库
├── migrations/               # 数据库迁移
├── docs/                     # 项目文档
├── go.mod                    # Go 模块
└── .env                      # 环境变量
```

## 🚀 快速开始

### 环境要求

- Go 1.23+
- SQLite 3

### 安装依赖

```bash
go mod download
```

### 配置环境变量

创建 `.env` 文件：

```bash
# 服务器配置
PORT=8080
GIN_MODE=debug

# JWT 配置
JWT_SECRET=your-secret-key-here
JWT_EXPIRE_HOURS=24

# 数据库配置
DATABASE_PATH=./data/youbind.db

# 对象存储 (可选)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# 向量数据库 (可选)
QDRANT_URL=http://localhost:6333
```

### 启动服务

```bash
go run cmd/server/main.go
```

服务将在 http://localhost:8080 启动

### 构建生产版本

```bash
go build -o youmind-backend cmd/server/main.go
```

## 📚 API 文档

### 认证接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/auth/register | 用户注册 |
| POST | /api/v1/auth/login | 用户登录 |
| POST | /api/v1/auth/refresh | 刷新 Token |
| POST | /api/v1/auth/logout | 退出登录 |

### 看板接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/v1/boards | 获取看板列表 |
| POST | /api/v1/boards | 创建看板 |
| GET | /api/v1/boards/:id | 获取看板详情 |
| PUT | /api/v1/boards/:id | 更新看板 |
| DELETE | /api/v1/boards/:id | 删除看板 |

### 内容接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/v1/contents/board/:board_id | 获取内容列表 |
| POST | /api/v1/contents | 创建内容 |
| GET | /api/v1/contents/:id | 获取内容详情 |
| PUT | /api/v1/contents/:id | 更新内容 |
| DELETE | /api/v1/contents/:id | 删除内容 |

### 聊天接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/sessions | 创建会话 |
| GET | /api/v1/sessions/:id | 获取会话详情 |
| POST | /api/v1/sessions/:id/messages | 发送消息 |
| GET | /api/v1/skills | 获取技能列表 |
| POST | /api/v1/skills/:id/invoke | 调用技能 |

### 使用示例

#### 用户注册

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### 用户登录

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### 创建看板 (需要认证)

```bash
curl -X POST http://localhost:8080/api/v1/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"我的看板","description":"看板描述"}'
```

## 📚 文档

### 核心文档

- [📋 技术规格](docs/TECHNICAL_SPEC.md) - 完整技术规格说明
- [💡 技术方案](docs/TECHNICAL_SOLUTION.md) - 技术解决方案
- [🏗️ 优化方案](docs/TECHNICAL_DOCS_OPTIMIZED.md) - 架构优化方案
- [🎨 设计规范](docs/DESIGN.md) - UI/UX 设计规范
- [📝 功能清单](../youmind-clone/FUNCTIONS.md) - 功能特性列表

### 进度报告

- [📊 项目进度](docs/PROGRESS.md) - 开发进度跟踪
- [🧪 测试报告](docs/TEST_REPORT.md) - 测试结果
- [🎯 UI 重设计](docs/UI_REDESIGN.md) - UI 改进文档

### 体验报告

- [📖 YouMind 体验](docs/YOUMIND_EXPERIENCE.md) - 原版 YouMind 体验分析
- [✨ 最终体验](docs/EXPERIENCE_FINAL.md) - 最终体验报告
- [📸 截图计划](docs/SCREENSHOT_PLAN.md) - 截图规划

## 🛠️ 技术栈

- **Go 1.23** - 编程语言
- **Gin** - Web 框架
- **GORM** - ORM 库
- **SQLite** - 数据库
- **JWT** - 认证令牌
- **Godotenv** - 环境变量管理

## 🧪 测试

### 运行测试

```bash
go test ./...
```

### 运行特定测试

```bash
go test ./internal/handler -v
```

### 代码检查

```bash
go vet ./...
```

## 📦 部署

### Docker 部署

```bash
# 构建镜像
docker build -t youmind-backend .

# 运行容器
docker run -p 8080:8080 youmind-backend
```

### 生产环境

```bash
# 设置生产模式
export GIN_MODE=release

# 构建
go build -o youmind-backend cmd/server/main.go

# 运行
./youbind-backend
```

## 🔒 安全

- 密码使用 bcrypt 加密
- JWT Token 有过期时间
- API 需要认证中间件保护
- 输入验证防止 SQL 注入

## 🤝 贡献

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开发规范

### 代码风格

- 遵循 Go 官方代码规范
- 使用 gofmt 格式化代码
- 函数命名使用驼峰式
- 错误处理要完整

### 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 📄 许可证

MIT License

## 👥 作者

- [@mjscjj](https://github.com/mjscjj)

## 🙏 致谢

- [YouMind](https://youmind.com) - 灵感来源
- [Gin](https://gin-gonic.com) - Web 框架
- [GORM](https://gorm.io) - ORM 库

---

**🎉 享受使用 YouMind Backend！**
