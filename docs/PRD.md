# YouMind Clone - 项目需求文档 (PRD)

**版本：** v1.0  
**日期：** 2026 年 2 月 18 日  
**状态：** 初始版本

---

## 1. 项目概述

### 1.1 产品定位

YouMind Clone 是心湃智能 (agent.paiqingnian.cn) 的开源克隆版本，一个 AI 智能体管理平台。

### 1.2 核心价值

- **AI 智能体管理** - 创建、配置、部署 AI 智能体
- **看板系统** - 可视化管理智能体任务
- **实时聊天** - 与智能体实时交互
- **低代码配置** - 无需编程即可配置智能体

### 1.3 目标用户

| 用户类型 | 需求 | 使用场景 |
|---------|------|---------|
| 个人用户 | 快速创建 AI 助手 | 个人任务自动化 |
| 开发团队 | 协作管理 AI 智能体 | 团队项目管理 |
| 企业用户 | 私有化部署 | 企业内部 AI 服务 |

---

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 看板管理 (Board)

**功能描述：**
可视化的看板系统，用于管理 AI 智能体任务。

**用户故事：**
- 作为用户，我希望创建多个看板来组织不同的项目
- 作为用户，我希望在看板上添加、编辑、删除卡片
- 作为用户，我希望拖拽卡片改变状态

**功能列表：**
- [x] 创建看板
- [x] 编辑看板名称
- [x] 删除看板
- [x] 看板列表展示
- [ ] 看板拖拽排序
- [ ] 看板权限管理

**技术实现：**
- 前端：React + TypeScript
- 状态管理：React Context
- 数据存储：SQLite (本地) / PostgreSQL (生产)

#### 2.1.2 聊天面板 (Chat)

**功能描述：**
与 AI 智能体实时聊天的界面。

**用户故事：**
- 作为用户，我希望发送消息给智能体
- 作为用户，我希望看到智能体的实时回复
- 作为用户，我希望查看历史聊天记录

**功能列表：**
- [x] 发送消息
- [x] 接收回复
- [x] 聊天历史记录
- [ ] 消息编辑
- [ ] 消息删除
- [ ] 文件上传
- [ ] 代码高亮

**技术实现：**
- WebSocket 实时通信
- Markdown 渲染
- 代码高亮 (Prism.js)

#### 2.1.3 侧边栏 (Sidebar)

**功能描述：**
导航和快速访问面板。

**功能列表：**
- [x] 看板列表
- [x] 智能体列表
- [x] 快速创建按钮
- [ ] 搜索功能
- [ ] 收藏夹
- [ ] 最近访问

---

### 2.2 后端功能

#### 2.2.1 API 接口

**Board API:**
```go
GET    /api/boards          // 获取看板列表
POST   /api/boards          // 创建看板
GET    /api/boards/:id      // 获取看板详情
PUT    /api/boards/:id      // 更新看板
DELETE /api/boards/:id      // 删除看板
```

**Chat API:**
```go
GET    /api/chats           // 获取聊天列表
POST   /api/chats           // 创建聊天
GET    /api/chats/:id       // 获取聊天记录
POST   /api/chats/:id/messages  // 发送消息
WS     /ws                  // WebSocket 连接
```

#### 2.2.2 数据模型

**Board:**
```go
type Board struct {
    ID          uint      `json:"id"`
    Title       string    `json:"title"`
    Description string    `json:"description"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}
```

**Message:**
```go
type Message struct {
    ID        uint      `json:"id"`
    ChatID    uint      `json:"chat_id"`
    Role      string    `json:"role"` // user/assistant
    Content   string    `json:"content"`
    CreatedAt time.Time `json:"created_at"`
}
```

---

## 3. 非功能需求

### 3.1 性能要求

| 指标 | 要求 | 测量方式 |
|------|------|---------|
| 页面加载时间 | < 2 秒 | Lighthouse |
| API 响应时间 | < 200ms | 后端日志 |
| WebSocket 延迟 | < 50ms | 客户端测量 |
| 并发用户数 | > 100 | 压力测试 |

### 3.2 安全要求

- [ ] 用户认证 (JWT)
- [ ] API 限流
- [ ] SQL 注入防护
- [ ] XSS 防护
- [ ] CORS 配置
- [ ] HTTPS 支持

### 3.3 兼容性要求

**浏览器：**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**设备：**
- Desktop (1920x1080+)
- Tablet (768x1024+)
- Mobile (375x667+)

---

## 4. 技术架构

### 4.1 技术栈

**前端：**
```
React 18
TypeScript 5
Vite 5
Tailwind CSS 3
React Router 6
```

**后端：**
```
Go 1.21
Gin (Web 框架)
SQLite / PostgreSQL
WebSocket
```

**基础设施：**
```
Docker
Docker Compose
Nginx (反向代理)
```

### 4.2 项目结构

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
│   └── types/            # TypeScript 类型
├── internal/             # 后端代码
│   ├── handler/         # HTTP 处理器
│   └── model/           # 数据模型
├── infra/               # 基础设施
│   └── docker/          # Docker 配置
└── docs/                # 文档
    ├── PRD.md          # 产品需求
    └── TECH.md         # 技术文档
```

---

## 5. 开发计划

### 5.1 第一阶段 (MVP) - 已完成 ✅

- [x] 项目初始化
- [x] 基础 UI 框架
- [x] 看板 CRUD
- [x] 聊天功能
- [x] 后端 API

### 5.2 第二阶段 - 进行中 🚧

- [ ] 用户认证系统
- [ ] 数据持久化
- [ ] WebSocket 实时通信
- [ ] 错误处理
- [ ] 单元测试

### 5.3 第三阶段 - 计划中 📋

- [ ] 智能体配置界面
- [ ] 文件上传
- [ ] 搜索功能
- [ ] 性能优化
- [ ] 部署文档

---

## 6. 验收标准

### 6.1 功能验收

- [ ] 所有核心功能正常工作
- [ ] 无严重 Bug
- [ ] 用户体验流畅

### 6.2 性能验收

- [ ] Lighthouse 分数 > 90
- [ ] API P95 < 200ms
- [ ] 页面加载 < 2 秒

### 6.3 代码质量

- [ ] TypeScript 无类型错误
- [ ] Go 代码通过 lint
- [ ] 单元测试覆盖率 > 70%

---

## 7. 风险与缓解

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| API 变更 | 高 | 中 | 抽象 API 层，使用适配器 |
| 性能问题 | 中 | 低 | 早期性能测试，代码审查 |
| 安全问题 | 高 | 中 | 安全编码规范，定期审计 |

---

## 8. 附录

### 8.1 参考资料

- [心湃智能官网](https://agent.paiqingnian.cn)
- [React 官方文档](https://react.dev)
- [Go 官方文档](https://go.dev)

### 8.2 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-02-18 | 初始版本 | mjscjj |

---

**文档状态：** ✅ 完成  
**最后更新：** 2026 年 2 月 18 日
