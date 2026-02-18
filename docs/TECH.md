# YouMind Clone - 技术文档

**版本：** v1.0  
**日期：** 2026 年 2 月 18 日  
**状态：** 初始版本

---

## 1. 系统架构

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Board     │  │    Chat     │  │   Sidebar   │     │
│  │  Component  │  │  Component  │  │  Component  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                     React 18 + TypeScript                │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Server (Go)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Handler   │  │   Model     │  │   Service   │     │
│  │   (HTTP)    │  │  (SQLite)   │  │  (Business) │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                     Go 1.21 + Gin                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Database (SQLite)                     │
│  - boards                                                │
│  - chats                                                 │
│  - messages                                              │
└─────────────────────────────────────────────────────────┘
```

### 1.2 数据流

**创建看板：**
```
User → Board.tsx → api.createBoard() → POST /api/boards
→ Handler.CreateBoard() → model.Board.Create() → SQLite
→ 返回 Board ID → 更新 UI
```

**发送消息：**
```
User → ChatPanel.tsx → api.sendMessage() → POST /api/chats/:id/messages
→ Handler.SendMessage() → model.Message.Create() → SQLite
→ WebSocket Broadcast → 其他客户端接收
```

---

## 2. 前端技术细节

### 2.1 组件结构

```
src/
├── components/
│   ├── Board/
│   │   ├── Board.tsx          # 看板主组件
│   │   ├── BoardCard.tsx      # 看板卡片
│   │   └── BoardForm.tsx      # 看板表单
│   ├── Chat/
│   │   ├── ChatPanel.tsx      # 聊天面板
│   │   ├── MessageList.tsx    # 消息列表
│   │   └── MessageInput.tsx   # 消息输入
│   └── Sidebar/
│       ├── Sidebar.tsx        # 侧边栏
│       ├── BoardList.tsx      # 看板列表
│       └── QuickActions.tsx   # 快速操作
├── lib/
│   ├── api.ts                 # API 客户端
│   ├── api-config.ts          # API 配置
│   └── mock.ts                # Mock 数据
├── types/
│   └── index.ts               # TypeScript 类型定义
├── App.tsx                    # 根组件
├── main.tsx                   # 入口文件
└── index.css                  # 全局样式
```

### 2.2 核心组件 API

#### Board.tsx

```typescript
interface BoardProps {
  id: string;
  title: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function Board({ id, title, onEdit, onDelete }: BoardProps) {
  // 看板组件实现
}
```

#### ChatPanel.tsx

```typescript
interface ChatPanelProps {
  chatId: string;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
}

function ChatPanel({ chatId, messages, onSendMessage }: ChatPanelProps) {
  // 聊天面板实现
}
```

### 2.3 API 客户端

```typescript
// src/lib/api.ts

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = {
  // Board APIs
  async getBoards(): Promise<Board[]> {
    const res = await fetch(`${API_BASE}/api/boards`);
    return res.json();
  },

  async createBoard(title: string): Promise<Board> {
    const res = await fetch(`${API_BASE}/api/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return res.json();
  },

  // Chat APIs
  async getChats(): Promise<Chat[]> {
    const res = await fetch(`${API_BASE}/api/chats`);
    return res.json();
  },

  async sendMessage(chatId: string, content: string): Promise<Message> {
    const res = await fetch(`${API_BASE}/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return res.json();
  },
};
```

### 2.4 类型定义

```typescript
// src/types/index.ts

export interface Board {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  board_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
```

---

## 3. 后端技术细节

### 3.1 项目结构

```
internal/
├── handler/
│   ├── board_handler.go       # Board HTTP 处理器
│   └── chat_handler.go        # Chat HTTP 处理器
├── model/
│   ├── board.go               # Board 数据模型
│   ├── chat.go                # Chat 数据模型
│   └── message.go             # Message 数据模型
├── service/
│   ├── board_service.go       # Board 业务逻辑
│   └── chat_service.go        # Chat 业务逻辑
└── main.go                    # 入口文件
```

### 3.2 HTTP Handler

```go
// internal/handler/board_handler.go

type BoardHandler struct {
    boardService *service.BoardService
}

func NewBoardHandler(bs *service.BoardService) *BoardHandler {
    return &BoardHandler{boardService: bs}
}

func (h *BoardHandler) GetBoards(c *gin.Context) {
    boards, err := h.boardService.GetAll()
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    c.JSON(200, boards)
}

func (h *BoardHandler) CreateBoard(c *gin.Context) {
    var req struct {
        Title string `json:"title" binding:"required"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    board, err := h.boardService.Create(req.Title)
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }
    c.JSON(201, board)
}
```

### 3.3 数据模型

```go
// internal/model/board.go

type Board struct {
    ID          uint      `json:"id" gorm:"primaryKey"`
    Title       string    `json:"title" gorm:"not null"`
    Description string    `json:"description"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}

func (Board) TableName() string {
    return "boards"
}
```

### 3.4 数据库迁移

```go
// internal/model/migrate.go

func AutoMigrate(db *gorm.DB) error {
    return db.AutoMigrate(
        &Board{},
        &Chat{},
        &Message{},
    )
}
```

---

## 4. 数据库设计

### 4.1 ER 图

```
┌─────────────┐       ┌─────────────┐
│   boards    │       │    chats    │
├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ board_id    │
│ title       │       │ id (PK)     │
│ description │       │ title       │
│ created_at  │       │ created_at  │
│ updated_at  │       └──────┬──────┘
└─────────────┘              │
                             │
                             ▼
                      ┌─────────────┐
                      │  messages   │
                      ├─────────────┤
                      │ id (PK)     │
                      │ chat_id (FK)│
                      │ role        │
                      │ content     │
                      │ created_at  │
                      └─────────────┘
```

### 4.2 SQL Schema

```sql
-- boards 表
CREATE TABLE boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- chats 表
CREATE TABLE chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- messages 表
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);
```

---

## 5. 部署配置

### 5.1 Docker Compose

```yaml
# infra/docker/docker-compose.yml

version: '3.8'

services:
  frontend:
    build:
      context: ../../
      dockerfile: infra/docker/Dockerfile.frontend
    ports:
      - "5173:5173"
    volumes:
      - ../../src:/app/src
    environment:
      - VITE_API_URL=http://localhost:8080

  backend:
    build:
      context: ../../
      dockerfile: infra/docker/Dockerfile.backend
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    environment:
      - DATABASE_URL=/app/data/youmind.db
      - GIN_MODE=release
```

### 5.2 环境变量

```bash
# .env.example

# Frontend
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws

# Backend
DATABASE_URL=./youmind.db
GIN_MODE=debug
PORT=8080
```

---

## 6. 开发指南

### 6.1 本地开发

```bash
# 1. 克隆项目
git clone git@github.com:mjscjj/youmind-clone.git
cd youmind-clone

# 2. 安装前端依赖
npm install

# 3. 安装后端依赖
cd internal && go mod download

# 4. 启动前端开发服务器
npm run dev

# 5. 启动后端服务器 (新终端)
cd internal && go run main.go
```

### 6.2 添加新功能

**前端：**
1. 在 `src/components/` 创建新组件
2. 在 `src/types/index.ts` 添加类型定义
3. 在 `src/lib/api.ts` 添加 API 方法
4. 在路由中注册新页面

**后端：**
1. 在 `internal/model/` 创建数据模型
2. 在 `internal/handler/` 创建 HTTP 处理器
3. 在 `internal/service/` 创建业务逻辑
4. 在 `main.go` 中注册路由

### 6.3 代码规范

**TypeScript:**
```typescript
// 使用接口定义对象
interface User {
  id: string;
  name: string;
}

// 使用类型别名定义联合类型
type Role = 'user' | 'admin';

// 使用泛型定义通用类型
interface Response<T> {
  data: T;
  error?: string;
}
```

**Go:**
```go
// 使用大驼峰命名导出
type Board struct {
    ID uint
}

// 使用小驼峰命名不导出
type boardInternal struct {
    id uint
}

// 错误处理
if err != nil {
    return nil, err
}
```

---

## 7. 测试

### 7.1 前端测试

```typescript
// src/components/Board/Board.test.tsx

import { render, screen } from '@testing-library/react';
import Board from './Board';

describe('Board', () => {
  it('renders board title', () => {
    render(<Board id="1" title="Test Board" />);
    expect(screen.getByText('Test Board')).toBeInTheDocument();
  });
});
```

### 7.2 后端测试

```go
// internal/handler/board_handler_test.go

func TestCreateBoard(t *testing.T) {
    router := setupRouter()
    
    w := httptest.NewRecorder()
    req, _ := http.NewRequest("POST", "/api/boards", 
        strings.NewReader(`{"title":"Test"}`))
    
    router.ServeHTTP(w, req)
    
    assert.Equal(t, 201, w.Code)
}
```

---

## 8. 故障排查

### 8.1 常见问题

**问题 1: 前端无法连接后端**

```bash
# 检查后端是否运行
curl http://localhost:8080/api/boards

# 检查 CORS 配置
# 确保后端允许前端域名
```

**问题 2: 数据库锁定**

```bash
# 删除数据库文件
rm youmind.db

# 重新运行迁移
go run main.go
```

**问题 3: WebSocket 连接失败**

```bash
# 检查 WebSocket 端点
wscat -c ws://localhost:8080/ws

# 检查防火墙设置
```

---

## 9. 性能优化

### 9.1 前端优化

- [ ] 代码分割 (Code Splitting)
- [ ] 懒加载 (Lazy Loading)
- [ ] 图片优化
- [ ] 缓存策略

### 9.2 后端优化

- [ ] 数据库索引
- [ ] 查询优化
- [ ] 连接池
- [ ] 缓存层 (Redis)

---

## 10. 安全考虑

### 10.1 已实现

- [x] SQL 注入防护 (GORM)
- [x] XSS 防护 (React 自动转义)
- [x] CORS 配置

### 10.2 待实现

- [ ] JWT 认证
- [ ] API 限流
- [ ] CSRF 防护
- [ ] 输入验证

---

**文档状态：** ✅ 完成  
**最后更新：** 2026 年 2 月 18 日
