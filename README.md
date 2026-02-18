# YouMind Clone - AI Agent Platform

心湃智能 (YouMind) 克隆版本 - 一个 AI 智能体平台

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
youmind-clone/
├── src/                    # 前端源代码
│   ├── components/        # React 组件
│   │   ├── Board/        # 看板组件
│   │   ├── Chat/         # 聊天组件
│   │   └── Sidebar/      # 侧边栏组件
│   ├── lib/              # 工具库
│   │   ├── api.ts        # API 客户端
│   │   └── mock.ts       # Mock 数据
│   └── types/            # TypeScript 类型定义
├── internal/             # 后端代码 (Go)
│   ├── handler/         # HTTP 处理器
│   └── model/           # 数据模型
├── public/              # 静态资源
├── infra/               # 基础设施配置
│   └── docker/          # Docker 配置
└── dist/                # 构建输出 (已忽略)
```

## 🛠️ 技术栈

### 前端
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **React Router** - 路由管理

### 后端
- **Go** - 后端服务
- **SQLite** - 数据库

## 📝 功能特性

- ✅ AI 智能体管理
- ✅ 看板系统
- ✅ 实时聊天
- ✅ 任务管理
- ✅ 数据可视化

## ⚙️ 配置

### 环境变量

创建 `.env` 文件：

```env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

## 📦 部署

### Docker 部署

```bash
cd infra/docker
docker-compose up -d
```

### Vercel 部署

```bash
npm install -g vercel
vercel deploy
```

## 🤝 贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 License

MIT License

## 📞 联系

有问题？请提 Issue 或联系作者。

---

**最后更新：** 2026 年 2 月 18 日
