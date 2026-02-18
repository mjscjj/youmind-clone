# YouMind Clone 技术方案 v1.0

**基于 73 张截图深度分析 + 完整功能体验**

---

## 1. 界面架构分析 (基于截图)

### 1.1 三栏布局规格

根据截图测量，YouMind 采用固定 + 自适应三栏布局：

```
┌────────────────────────────────────────────────────────────────────────┐
│                           视口：1920×1080 (典型)                        │
├──────────────┬─────────────────────────────────┬───────────────────────┤
│   Sidebar    │       Main Content Area         │     Chat Panel        │
│   260px      │         flex: 1                 │      380px            │
│   (固定)     │       min: 600px                │      (固定)           │
│              │       max: 1200px               │                       │
├──────────────┼─────────────────────────────────┼───────────────────────┤
│ Logo 48×48   │ Header 64px                     │ AI Avatar 72px        │
│              │ ─────────────────               │ ─────────────         │
│ Navigation   │ Content Area                    │ Messages Container    │
│ - 项目列表   │ - Grid View (截图 02-grid)      │ - 可滚动              │
│ - 技能入口   │ - List View (截图 03-list)      │ - 自动底部            │
│ - 设置       │ - Empty State (截图 01-empty)   │                       │
│              │                                 │                       │
│ User 72px    │ Action Bar 80px                 │ Input Area 140px      │
│ (底部固定)   │ - 新建笔记                      │ - 文本输入            │
│              │ - 添加链接                      │ - 技能选择器          │
│              │ - 添加文件                      │ - 发送按钮            │
└──────────────┴─────────────────────────────────┴───────────────────────┘
```

### 1.2 颜色系统 (从截图提取)

```css
:root {
  /* 背景色 - 深色主题 */
  --bg-primary: #0f0f0f;         /* 主背景，最暗 */
  --bg-secondary: #141414;       /* 次级背景 */
  --bg-tertiary: #1a1a1a;        /* 卡片/面板背景 */
  --bg-hover: #252525;           /* 悬停状态 */
  --bg-active: #2a2a2a;          /* 激活状态 */
  
  /* 文字色 */
  --text-primary: #ffffff;       /* 主文字 */
  --text-secondary: rgba(255,255,255,0.65);  /* 次文字 */
  --text-tertiary: rgba(255,255,255,0.45);   /* 辅助文字 */
  --text-disabled: rgba(255,255,255,0.25);   /* 禁用文字 */
  
  /* 边框色 */
  --border-light: #2a2a2a;       /* 默认边框 */
  --border-hover: #3a3a3a;       /* 悬停边框 */
  --border-active: #6366f1;      /* 激活边框 (indigo) */
  
  /* 强调色 - Indigo/Violet 渐变 */
  --accent-start: #6366f1;       /* Indigo 500 */
  --accent-end: #8b5cf6;         /* Violet 500 */
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  
  /* 功能色 */
  --success: #10b981;            /* Emerald 500 */
  --warning: #f59e0b;            /* Amber 500 */
  --error: #ef4444;              /* Red 500 */
  --info: #3b82f6;               /* Blue 500 */
}
```

### 1.3 核心界面组件 (从 73 张截图识别)

| 组件 | 截图位置 | 复杂度 | 优先级 |
|------|---------|--------|--------|
| Sidebar 导航 | 02-boards/* | 中 | P0 |
| Board 列表 | 02-boards/01-boards-list.jpg | 低 | P0 |
| Board 详情 | 02-boards/02-board-detail.jpg | 中 | P0 |
| Empty State | 03-content/01-empty-state.jpg | 低 | P0 |
| Content Card | 03-content/* | 中 | P0 |
| Note Editor | 03-content/04-note-editor.jpg | 高 | P1 |
| Link Card | 03-content/05-link-card.jpg | 中 | P0 |
| Chat Panel | 04-ai-chat/* | 高 | P0 |
| Skill Selector | 04-ai-chat/02-input-focused.png | 中 | P0 |
| Thinking State | 04-ai-chat/03-ai-thinking.png | 低 | P1 |
| Skills Market | 05-skills/01-skills-market.jpg | 中 | P1 |
| Settings | 06-settings/* | 低 | P2 |

---

## 2. 前端技术方案

### 2.1 技术栈选型

| 层级 | 技术 | 版本 | 选择理由 |
|------|------|------|---------|
| 框架 | React | 18.3 | 生态成熟，YouMind 同款 |
| 语言 | TypeScript | 5.4 | 类型安全，大型项目必备 |
| 构建 | Vite | 5.2 | 极速开发体验，HMR |
| 状态 | Zustand | 4.5 | 轻量，API 简单 |
| 服务端状态 | TanStack Query | 5.3 | 缓存/同步/乐观更新 |
| UI 组件 | Radix UI | latest | 无样式，完全可定制 |
| 样式 | Tailwind CSS | 3.4 | 原子化 CSS，开发效率高 |
| 富文本 | Tiptap | 2.3 | 基于 ProseMirror，可扩展 |
| 图表 | Recharts | 2.12 | React 友好，够用 |
| 动画 | Framer Motion | 11.0 | 声明式动画 |

### 2.2 项目结构

```
youmind-clone/
├── src/
│   ├── app/                    # 应用层
│   │   ├── App.tsx             # 根组件
│   │   ├── providers/          # 全局 Provider
│   │   │   ├── QueryProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── AuthProvider.tsx
│   │   └── routes.tsx          # 路由配置
│   │
│   ├── features/               # 功能模块 (按业务划分)
│   │   ├── boards/             # 看板功能
│   │   │   ├── components/
│   │   │   │   ├── BoardList.tsx
│   │   │   │   ├── BoardCard.tsx
│   │   │   │   ├── CreateBoardModal.tsx
│   │   │   │   └── BoardSettings.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBoards.ts
│   │   │   │   └── useBoard.ts
│   │   │   ├── api/
│   │   │   │   └── boards.api.ts
│   │   │   └── types/
│   │   │       └── board.types.ts
│   │   │
│   │   ├── content/            # 内容功能
│   │   │   ├── components/
│   │   │   │   ├── ContentGrid.tsx
│   │   │   │   ├── ContentList.tsx
│   │   │   │   ├── ContentCard.tsx
│   │   │   │   ├── NoteEditor.tsx
│   │   │   │   ├── LinkCard.tsx
│   │   │   │   └── FileUpload.tsx
│   │   │   └── ...
│   │   │
│   │   ├── chat/               # AI 对话功能
│   │   │   ├── components/
│   │   │   │   ├── ChatPanel.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── SkillSelector.tsx
│   │   │   │   └── ThinkingIndicator.tsx
│   │   │   └── ...
│   │   │
│   │   ├── skills/             # 技能系统
│   │   │   └── ...
│   │   │
│   │   └── settings/           # 设置
│   │       └── ...
│   │
│   ├── components/             # 通用组件
│   │   ├── ui/                 # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── ...
│   │   ├── layout/             # 布局组件
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ThreeColumnLayout.tsx
│   │   └── shared/             # 共享组件
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── hooks/                  # 通用 Hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── useClickOutside.ts
│   │
│   ├── lib/                    # 工具库
│   │   ├── api.ts              # API 客户端
│   │   ├── utils.ts            # 工具函数
│   │   └── constants.ts        # 常量
│   │
│   ├── types/                  # 全局类型
│   │   └── index.ts
│   │
│   ├── styles/                 # 全局样式
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   └── assets/                 # 静态资源
│       └── images/
│
├── public/
├── tests/                      # 测试
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

### 2.3 核心组件实现示例

#### Sidebar 组件 (基于截图还原)

```tsx
// src/features/layout/Sidebar.tsx
import { useState } from 'react'
import { Layout, FolderOpen, Lightbulb, Plus, Settings, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Board {
  id: string
  name: string
  icon?: string
}

interface SidebarProps {
  boards: Board[]
  selectedBoardId?: string
  onSelectBoard: (boardId: string) => void
  onCreateBoard: () => void
}

export function Sidebar({ boards, selectedBoardId, onSelectBoard, onCreateBoard }: SidebarProps) {
  return (
    <aside className="w-[260px] h-full bg-[#0f0f0f] border-r border-[#2a2a2a] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <span className="text-white font-semibold text-lg">YouMind</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {/* 项目列表 */}
        <div className="px-3 pb-2">
          <span className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wider">
            项目
          </span>
        </div>
        
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => onSelectBoard(board.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative',
              selectedBoardId === board.id
                ? 'bg-[#252525] text-white'
                : 'text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white'
            )}
          >
            {selectedBoardId === board.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-r-full" />
            )}
            <span className="w-5 h-5 flex items-center justify-center">
              {board.icon || <Layout size={18} />}
            </span>
            <span className="font-medium truncate">{board.name}</span>
          </button>
        ))}

        {/* 新建项目按钮 */}
        <button
          onClick={onCreateBoard}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 border border-dashed border-[#2a2a2a] hover:border-[#3a3a3a] mt-2"
        >
          <Plus size={18} />
          <span className="font-medium">新建项目</span>
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-[#2a2a2a]">
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-white truncate">用户名</p>
            <p className="text-xs text-[#a0a0a0] truncate">Free Plan</p>
          </div>
          <Settings size={16} className="text-[#a0a0a0]" />
        </button>
      </div>
    </aside>
  )
}
```

#### ChatPanel 组件 (基于截图还原)

```tsx
// src/features/chat/ChatPanel.tsx
import { useState } from 'react'
import { Sparkles, Send, Mic, ChevronDown, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  thinking?: {
    content: string
    duration: number
  }
}

interface ChatPanelProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isLoading?: boolean
}

export function ChatPanel({ messages, onSendMessage, isLoading }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const [showSkills, setShowSkills] = useState(false)
  const [expandedThinking, setExpandedThinking] = useState<string | null>(null)

  return (
    <aside className="w-[380px] h-full bg-[#0f0f0f] border-l border-[#2a2a2a] flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">深度研究助手</h3>
            <p className="text-xs text-[#a0a0a0]">随时为你提供研究支持</p>
          </div>
        </div>
        <button className="p-2 text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={14} className="text-white" />
              </div>
            )}
            
            <div className={cn(
              'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
              message.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : 'bg-[#1a1a1a] text-white'
            )}>
              {message.thinking && (
                <button
                  onClick={() => setExpandedThinking(
                    expandedThinking === message.id ? null : message.id
                  )}
                  className="flex items-center gap-1 text-xs text-[#a0a0a0] hover:text-white mb-2 transition-colors"
                >
                  <span>思考了 {message.thinking.duration}秒</span>
                  <ChevronDown 
                    size={12} 
                    className={cn(
                      'transform transition-transform',
                      expandedThinking === message.id ? 'rotate-180' : ''
                    )} 
                  />
                </button>
              )}
              
              {expandedThinking === message.id && message.thinking && (
                <div className="mb-2 p-3 bg-[#0f0f0f] rounded-lg border border-[#2a2a2a] text-xs text-[#a0a0a0]">
                  {message.thinking.content}
                </div>
              )}
              
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-[#a0a0a0] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-[#a0a0a0] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[#a0a0a0] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#2a2a2a] p-4">
        <div className="relative">
          <div className="flex items-end gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-2 focus-within:border-indigo-500 transition-colors">
            {/* Skill Button */}
            <button
              onClick={() => setShowSkills(!showSkills)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#252525] hover:bg-[#2a2a2a] rounded-lg text-xs text-[#a0a0a0] hover:text-white transition-colors flex-shrink-0"
            >
              <Sparkles size={12} className="text-indigo-400" />
              <span>深度研究</span>
            </button>
            
            {/* Input */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onSendMessage(input)
                  setInput('')
                }
              }}
              placeholder="描述任务或输入 / 使用技能"
              className="flex-1 bg-transparent text-sm text-white placeholder-[#666] resize-none outline-none py-1.5 min-h-[24px] max-h-[120px]"
              rows={1}
            />
            
            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="p-2 text-[#666] hover:text-white hover:bg-[#252525] rounded-lg transition-colors">
                <Mic size={16} />
              </button>
              <button
                onClick={() => {
                  onSendMessage(input)
                  setInput('')
                }}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          
          {/* Skills Dropdown */}
          {showSkills && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#252525] border border-[#2a2a2a] rounded-xl shadow-xl overflow-hidden z-10">
              <div className="px-3 py-2 text-xs text-[#666] border-b border-[#2a2a2a]">可用技能</div>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#2a2a2a] transition-colors text-left">
                <Sparkles size={16} className="text-indigo-400" />
                <div>
                  <div className="text-sm text-white">深度研究</div>
                  <div className="text-xs text-[#666]">针对特定主题进行深度调研</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#2a2a2a] transition-colors text-left">
                <FolderOpen size={16} className="text-emerald-400" />
                <div>
                  <div className="text-sm text-white">智能总结</div>
                  <div className="text-xs text-[#666]">自动总结资料和笔记</div>
                </div>
              </button>
            </div>
          )}
        </div>
        
        <p className="mt-2 text-xs text-[#666] text-center">
          AI 助手可能会生成不准确的信息，请验证重要信息。
        </p>
      </div>
    </aside>
  )
}
```

---

## 3. 后端技术方案 (Go)

### 3.1 技术栈选型

| 组件 | 技术 | 版本 | 选择理由 |
|------|------|------|---------|
| 语言 | Go | 1.22 LTS | 高性能，并发强，部署简单 |
| Web 框架 | Gin | 1.10 | 高性能，生态成熟 |
| ORM | GORM | 2.5 | Go 首选 ORM，功能完整 |
| 数据库 | PostgreSQL | 16 | 成熟稳定，JSON 支持好 |
| 缓存 | Redis | 7.2 | 高性能，数据结构丰富 |
| 搜索 | Meilisearch | 1.7 | 轻量，易用，Go 客户端完善 |
| 向量库 | Qdrant | 1.8 | 开源，性能好，Go SDK |
| 队列 | Asynq | 0.23 | Redis 基础，Go 原生 |
| 存储 | MinIO | latest | S3 兼容，自托管 |
| 配置 | Viper | 1.18 | 支持多格式，热加载 |
| 日志 | Zap | 1.27 | Uber 出品，高性能 |
| 验证 | Go-Playground | 10.15 | 标签验证，功能强大 |

### 3.2 服务架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway (Gin)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Auth       │  │   Boards     │  │   Content    │          │
│  │   Handler    │  │   Handler    │  │   Handler    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Chat       │  │   Skills     │  │   Search     │          │
│  │   Handler    │  │   Handler    │  │   Handler    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   User       │  │   File       │  │   AI         │          │
│  │   Handler    │  │   Handler    │  │   Handler    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Service Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Board Svc    │  │ Content Svc  │  │  Chat Svc    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                                │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│  PostgreSQL  │    Redis     │   Qdrant     │   MinIO (S3)     │
│  (GORM)      │  (Cache)     │  (Vectors)   │   (Files)        │
└──────────────┴──────────────┴──────────────┴──────────────────┘
```

### 3.3 Go 后端项目结构

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # 应用入口
├── internal/
│   ├── config/
│   │   └── config.go            # 配置加载 (Viper)
│   ├── handler/                 # HTTP 处理器
│   │   ├── board_handler.go
│   │   ├── content_handler.go
│   │   ├── chat_handler.go
│   │   ├── skill_handler.go
│   │   └── user_handler.go
│   ├── service/                 # 业务逻辑层
│   │   ├── board_service.go
│   │   ├── content_service.go
│   │   ├── chat_service.go
│   │   ├── skill_service.go
│   │   └── ai_service.go
│   ├── repository/              # 数据访问层
│   │   ├── board_repo.go
│   │   ├── content_repo.go
│   │   └── user_repo.go
│   ├── model/                   # 数据模型
│   │   ├── user.go
│   │   ├── board.go
│   │   ├── content.go
│   │   ├── message.go
│   │   └── skill.go
│   ├── middleware/              # 中间件
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── ratelimit.go
│   │   └── logger.go
│   ├── ai/                      # AI 集成
│   │   ├── llm_router.go
│   │   ├── rag_pipeline.go
│   │   └── skills/
│   │       └── deep_research.go
│   └── pkg/                     # 工具包
│       ├── database/
│       │   ├── postgres.go
│       │   └── redis.go
│       ├── qdrant/
│       │   └── client.go
│       └── minio/
│           └── client.go
├── pkg/                         # 可复用公共包
├── migrations/                  # 数据库迁移
│   └── 001_init.sql
├── configs/
│   └── config.yaml
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

### 3.4 Go 核心代码示例

#### main.go - 应用入口

```go
// cmd/server/main.go
package main

import (
	"log"
	"os"

	"youmind-clone/internal/config"
	"youmind-clone/internal/handler"
	"youmind-clone/internal/middleware"
	"youmind-clone/internal/pkg/database"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 初始化数据库
	if err := database.InitPostgres(cfg.DatabaseURL); err != nil {
		log.Fatalf("Failed to init database: %v", err)
	}

	// 初始化 Redis
	if err := database.InitRedis(cfg.RedisURL); err != nil {
		log.Fatalf("Failed to init Redis: %v", err)
	}

	// 创建 Gin 路由
	r := gin.Default()

	// 全局中间件
	r.Use(middleware.CORS())
	r.Use(middleware.Logger())
	r.Use(middleware.RateLimit())

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1 路由组
	v1 := r.Group("/api/v1")
	{
		// 认证路由
		auth := v1.Group("/auth")
		{
			auth.POST("/login", handler.Login)
			auth.POST("/register", handler.Register)
			auth.POST("/refresh", handler.RefreshToken)
		}

		// 需要认证的路由
		protected := v1.Group("")
		protected.Use(middleware.Auth())
		{
			// Boards
			protected.GET("/boards", handler.ListBoards)
			protected.POST("/boards", handler.CreateBoard)
			protected.GET("/boards/:id", handler.GetBoard)
			protected.PUT("/boards/:id", handler.UpdateBoard)
			protected.DELETE("/boards/:id", handler.DeleteBoard)

			// Contents
			protected.GET("/boards/:id/contents", handler.ListContents)
			protected.POST("/contents", handler.CreateContent)
			protected.GET("/contents/:id", handler.GetContent)
			protected.PUT("/contents/:id", handler.UpdateContent)
			protected.DELETE("/contents/:id", handler.DeleteContent)

			// Sessions/Chat
			protected.POST("/sessions", handler.CreateSession)
			protected.GET("/sessions/:id", handler.GetSession)
			protected.POST("/sessions/:id/messages", handler.SendMessage)

			// Skills
			protected.GET("/skills", handler.ListSkills)
			protected.POST("/skills/:id/invoke", handler.InvokeSkill)

			// User
			protected.GET("/user/profile", handler.GetProfile)
			protected.PUT("/user/profile", handler.UpdateProfile)
		}
	}

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
```

#### handler/board_handler.go - Board 处理器

```go
// internal/handler/board_handler.go
package handler

import (
	"net/http"
	"strconv"

	"youmind-clone/internal/model"
	"youmind-clone/internal/service"

	"github.com/gin-gonic/gin"
)

type BoardHandler struct {
	boardService *service.BoardService
}

func NewBoardHandler(bs *service.BoardService) *BoardHandler {
	return &BoardHandler{boardService: bs}
}

// ListBoards 获取用户的看板列表
// GET /api/v1/boards
func (h *BoardHandler) ListBoards(c *gin.Context) {
	userID := c.GetString("userID")

	boards, err := h.boardService.ListByUser(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": boards,
	})
}

// CreateBoard 创建新看板
// POST /api/v1/boards
func (h *BoardHandler) CreateBoard(c *gin.Context) {
	userID := c.GetString("userID")

	var req struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
		Type        string `json:"type" default:"custom"`
		Icon        string `json:"icon"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	board := &model.Board{
		OwnerID:     userID,
		Name:        req.Name,
		Description: req.Description,
		Type:        req.Type,
		Icon:        req.Icon,
	}

	if err := h.boardService.Create(c.Request.Context(), board); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": board,
	})
}

// GetBoard 获取看板详情
// GET /api/v1/boards/:id
func (h *BoardHandler) GetBoard(c *gin.Context) {
	boardID := c.Param("id")

	board, err := h.boardService.GetByID(c.Request.Context(), boardID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Board not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": board,
	})
}

// UpdateBoard 更新看板
// PUT /api/v1/boards/:id
func (h *BoardHandler) UpdateBoard(c *gin.Context) {
	boardID := c.Param("id")

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Icon        string `json:"icon"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	updates := map[string]interface{}{}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.Icon != "" {
		updates["icon"] = req.Icon
	}

	if err := h.boardService.Update(c.Request.Context(), boardID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Board updated",
	})
}

// DeleteBoard 删除看板
// DELETE /api/v1/boards/:id
func (h *BoardHandler) DeleteBoard(c *gin.Context) {
	boardID := c.Param("id")

	if err := h.boardService.Delete(c.Request.Context(), boardID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Board deleted",
	})
}
```

#### service/board_service.go - Board 服务层

```go
// internal/service/board_service.go
package service

import (
	"context"
	"errors"
	"time"

	"youmind-clone/internal/model"
	"youmind-clone/internal/repository"

	"github.com/google/uuid"
)

type BoardService struct {
	boardRepo *repository.BoardRepository
}

func NewBoardService(br *repository.BoardRepository) *BoardService {
	return &BoardService{boardRepo: br}
}

func (s *BoardService) ListByUser(ctx context.Context, userID string) ([]model.Board, error) {
	return s.boardRepo.FindByUserID(ctx, userID)
}

func (s *BoardService) GetByID(ctx context.Context, boardID string) (*model.Board, error) {
	board, err := s.boardRepo.FindByID(ctx, boardID)
	if err != nil {
		return nil, err
	}
	if board == nil {
		return nil, errors.New("board not found")
	}
	return board, nil
}

func (s *BoardService) Create(ctx context.Context, board *model.Board) error {
	board.ID = uuid.New().String()
	board.CreatedAt = time.Now()
	board.UpdatedAt = time.Now()
	board.State = "active"

	return s.boardRepo.Create(ctx, board)
}

func (s *BoardService) Update(ctx context.Context, boardID string, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	return s.boardRepo.Update(ctx, boardID, updates)
}

func (s *BoardService) Delete(ctx context.Context, boardID string) error {
	return s.boardRepo.Delete(ctx, boardID)
}

func (s *BoardService) Archive(ctx context.Context, boardID string) error {
	return s.boardRepo.Update(ctx, boardID, map[string]interface{}{
		"state":        "archived",
		"archived_at":  time.Now(),
		"updated_at":   time.Now(),
	})
}
```

#### model/board.go - Board 模型

```go
// internal/model/board.go
package model

import "time"

type Board struct {
	ID          string     `json:"id" gorm:"primaryKey"`
	OwnerID     string     `json:"owner_id" gorm:"not null;index"`
	Name        string     `json:"name" gorm:"not null"`
	Description string     `json:"description"`
	Icon        string     `json:"icon"`
	CoverImage  string     `json:"cover_image"`
	Type        string     `json:"type" gorm:"default:'custom'"` // research, collection, inspiration, custom
	State       string     `json:"state" gorm:"default:'active'"` // active, archived
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	ArchivedAt  *time.Time `json:"archived_at,omitempty"`

	// 关联字段 (不存入数据库)
	ContentCount int64 `json:"content_count" gorm:"-"`
}

func (Board) TableName() string {
	return "boards"
}
```

#### repository/board_repo.go - Board 数据访问层

```go
// internal/repository/board_repo.go
package repository

import (
	"context"

	"youmind-clone/internal/model"
	"youmind-clone/internal/pkg/database"

	"gorm.io/gorm"
)

type BoardRepository struct {
	db *gorm.DB
}

func NewBoardRepository(db *gorm.DB) *BoardRepository {
	return &BoardRepository{db: db}
}

func (r *BoardRepository) FindByUserID(ctx context.Context, userID string) ([]model.Board, error) {
	var boards []model.Board
	err := r.db.WithContext(ctx).
		Where("owner_id = ? AND state = ?", userID, "active").
		Order("updated_at DESC").
		Find(&boards).Error
	return boards, err
}

func (r *BoardRepository) FindByID(ctx context.Context, boardID string) (*model.Board, error) {
	var board model.Board
	err := r.db.WithContext(ctx).First(&board, "id = ?", boardID).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &board, nil
}

func (r *BoardRepository) Create(ctx context.Context, board *model.Board) error {
	return r.db.WithContext(ctx).Create(board).Error
}

func (r *BoardRepository) Update(ctx context.Context, boardID string, updates map[string]interface{}) error {
	return r.db.WithContext(ctx).
		Model(&model.Board{}).
		Where("id = ?", boardID).
		Updates(updates).Error
}

func (r *BoardRepository) Delete(ctx context.Context, boardID string) error {
	return r.db.WithContext(ctx).
		Delete(&model.Board{}, "id = ?", boardID).Error
}
```

#### middleware/auth.go - JWT 认证中间件

```go
// internal/middleware/auth.go
package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Missing authorization header",
			})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid authorization format",
			})
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte("your-secret-key"), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid or expired token",
			})
			c.Abort()
			return
		}

		// 将用户信息存入上下文
		c.Set("userID", claims.UserID)
		c.Set("email", claims.Email)

		c.Next()
	}
}
```

### 3.5 数据库 Schema (Go + GORM)

```go
// internal/model/user.go
package model

import "time"

type User struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	Email     string    `json:"email" gorm:"uniqueIndex;not null"`
	DisplayName string  `json:"display_name" gorm:"not null"`
	AvatarURL string    `json:"avatar_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Subscription  *Subscription  `json:"subscription,omitempty" gorm:"foreignKey:UserID"`
	Preferences   *UserPreferences `json:"preferences,omitempty" gorm:"foreignKey:UserID"`
	Boards        []Board        `json:"boards,omitempty" gorm:"foreignKey:OwnerID"`
}

type Subscription struct {
	ID        string    `json:"id" gorm:"primaryKey"`
	UserID    string    `json:"user_id" gorm:"uniqueIndex;not null"`
	Tier      string    `json:"tier" gorm:"default:'free'"` // free, pro, team
	Credits   int       `json:"credits" gorm:"default:100"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	User User `json:"-" gorm:"foreignKey:UserID"`
}

type UserPreferences struct {
	ID           string `json:"id" gorm:"primaryKey"`
	UserID       string `json:"user_id" gorm:"uniqueIndex;not null"`
	Theme        string `json:"theme" gorm:"default:'dark'"` // dark, light, auto
	Language     string `json:"language" gorm:"default:'zh-CN'"`
	DefaultAgent string `json:"default_agent" gorm:"default:'research'"`
	AutoSave     bool   `json:"auto_save" gorm:"default:true"`

	User User `json:"-" gorm:"foreignKey:UserID"`
}
```

```go
// internal/model/content.go
package model

import "time"

type ContentType string

const (
	ContentTypeNote     ContentType = "note"
	ContentTypeLink     ContentType = "link"
	ContentTypeFile     ContentType = "file"
	ContentTypeYoutube  ContentType = "youtube"
	ContentTypePodcast  ContentType = "podcast"
	ContentTypePDF      ContentType = "pdf"
)

type Content struct {
	ID          string      `json:"id" gorm:"primaryKey"`
	BoardID     string      `json:"board_id" gorm:"not null;index"`
	Type        ContentType `json:"type" gorm:"not null;index"`
	Title       string      `json:"title" gorm:"not null"`
	Description string      `json:"description"`
	Content     string      `json:"content,omitempty" gorm:"type:text"`
	SourceURL   string      `json:"source_url"`
	FileID      string      `json:"file_id"`
	FileSize    int64       `json:"file_size"`
	MimeType    string      `json:"mime_type"`
	AIGenerated bool        `json:"ai_generated" gorm:"default:false"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`

	Board Board `json:"-" gorm:"foreignKey:BoardID"`
}
```

```go
// internal/model/message.go
package model

import (
	"time"
	"encoding/json"
)

type MessageRole string

const (
	MessageRoleUser      MessageRole = "user"
	MessageRoleAssistant MessageRole = "assistant"
	MessageRoleSystem    MessageRole = "system"
)

type Thinking struct {
	Content  string `json:"content"`
	Duration int    `json:"duration"` // seconds
}

type Message struct {
	ID         string      `json:"id" gorm:"primaryKey"`
	SessionID  string      `json:"session_id" gorm:"not null;index"`
	Role       MessageRole `json:"role" gorm:"not null"`
	Content    string      `json:"content" gorm:"type:text;not null"`
	Thinking   json.RawMessage `json:"thinking,omitempty"` // JSON column
	TokenCount int         `json:"token_count" gorm:"default:0"`
	CreatedAt  time.Time   `json:"created_at"`

	Session Session `json:"-" gorm:"foreignKey:SessionID"`
}
```

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  displayName   String
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  subscription  Subscription?
  preferences   UserPreferences?
  boards        Board[]
  contents      Content[]
  sessions      Session[]
  
  @@map("users")
}

model Subscription {
  id          String   @id @default(uuid())
  userId      String   @unique
  tier        String   @default("free") // free, pro, team
  credits     Int      @default(100)
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("subscriptions")
}

model UserPreferences {
  id            String  @id @default(uuid())
  userId        String  @unique
  theme         String  @default("dark") // dark, light, auto
  language      String  @default("zh-CN")
  defaultAgent  String  @default("research")
  autoSave      Boolean @default(true)
  
  user          User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("user_preferences")
}

model Board {
  id          String   @id @default(uuid())
  ownerId     String
  name        String
  description String?
  icon        String?
  coverImage  String?
  type        String   @default("custom") // research, collection, inspiration, custom
  state       String   @default("active") // active, archived
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  archivedAt  DateTime?
  
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  contents    Content[]
  sessions    Session[]
  collaborators BoardCollaborator[]
  
  @@index([ownerId])
  @@map("boards")
}

model BoardCollaborator {
  id        String   @id @default(uuid())
  boardId   String
  userId    String
  role      String   @default("viewer") // viewer, editor, admin
  addedAt   DateTime @default(now())
  
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  
  @@unique([boardId, userId])
  @@map("board_collaborators")
}

model Content {
  id          String   @id @default(uuid())
  boardId     String
  type        String   // note, link, file, youtube, podcast, pdf
  title       String
  description String?
  content     String?  @db.Text
  sourceUrl   String?
  fileId      String?
  fileSize    Int?
  mimeType    String?
  aiGenerated Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  board       Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  highlights  Highlight[]
  notes       ContentNote[]
  
  @@index([boardId])
  @@index([type])
  @@map("contents")
}

model Highlight {
  id        String   @id @default(uuid())
  contentId String
  text      String   @db.Text
  position  Json     // { start: number, end: number }
  color     String   @default("yellow")
  createdAt DateTime @default(now())
  
  content   Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  @@index([contentId])
  @@map("highlights")
}

model ContentNote {
  id        String   @id @default(uuid())
  contentId String
  content   String   @db.Text
  position  Json?    // { start: number, end: number }
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  content   Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
  
  @@index([contentId])
  @@map("content_notes")
}

model Session {
  id          String   @id @default(uuid())
  boardId     String
  userId      String
  agentType   String   @default("research")
  model       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  board       Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  messages    Message[]
  
  @@index([boardId])
  @@index([userId])
  @@map("sessions")
}

model Message {
  id         String   @id @default(uuid())
  sessionId  String
  role       String   // user, assistant, system
  content    String   @db.Text
  thinking   Json?    // { content: string, duration: number }
  tokenCount Int      @default(0)
  createdAt  DateTime @default(now())
  
  session    Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@index([sessionId])
  @@map("messages")
}

model Skill {
  id          String   @id @default(uuid())
  name        String
  nameEn      String?
  category    String   // learning, writing, research, visual, summary, thinking, news, education, tools, visualization
  description String
  icon        String
  command     String?  @unique // e.g., "/research"
  systemPrompt String  @db.Text
  parameters  Json?    // { temperature, max_tokens, tools }
  isOfficial  Boolean  @default(false)
  isCustom    Boolean  @default(false)
  usageCount  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([category])
  @@map("skills")
}
```

---

## 4. AI 集成方案

### 4.1 LLM 路由策略

```typescript
// src/lib/ai/llm-router.ts

interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'moonshot'
  model: string
  temperature: number
  maxTokens: number
}

const LLM_ROUTES: Record<string, LLMConfig> = {
  // 深度研究 - 使用最强模型
  'deep-research': {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.3,
    maxTokens: 8000,
  },
  
  // 日常对话 - 使用性价比模型
  'casual-chat': {
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
  },
  
  // 文本摘要 - 使用长上下文模型
  'summarization': {
    provider: 'google',
    model: 'gemini-1.5-pro',
    temperature: 0.3,
    maxTokens: 4000,
  },
  
  // 代码生成 - 使用代码专用模型
  'code-generation': {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.2,
    maxTokens: 4000,
  },
}

export function getLLMConfig(skillType: string): LLMConfig {
  return LLM_ROUTES[skillType] || LLM_ROUTES['casual-chat']
}
```

### 4.2 RAG Pipeline

```typescript
// src/lib/ai/rag-pipeline.ts

import { embed } from './embedding'
import { searchVectors } from './vector-search'

interface RAGContext {
  query: string
  boardId?: string
  topK?: number
}

export async function buildRAGContext({ query, boardId, topK = 5 }: RAGContext): Promise<string> {
  // 1. 生成 Query Embedding
  const queryEmbedding = await embed(query)
  
  // 2. 向量相似度搜索
  const results = await searchVectors({
    embedding: queryEmbedding,
    boardId,
    topK,
  })
  
  // 3. 构建上下文
  const contexts = results.map((result, i) => `
[来源 ${i + 1}]
标题：${result.title}
内容：${result.content}
---
  `).join('\n')
  
  return `基于以下资料回答用户问题：

${contexts}

用户问题：${query}
`
}
```

### 4.3 技能系统实现

```typescript
// src/lib/ai/skills/deep-research.ts

import { LLMProvider } from '../llm-provider'
import { buildRAGContext } from '../rag-pipeline'
import { webSearch } from '../tools/web-search'

export interface DeepResearchParams {
  topic: string
  boardId: string
  includeWebSearch?: boolean
}

export async function executeDeepResearch({
  topic,
  boardId,
  includeWebSearch = true,
}: DeepResearchParams): Promise<{
  report: string
  thinking: string
  sources: string[]
}> {
  // 1. 思考过程
  const thinking = await generateThinking(topic)
  
  // 2. 检索内部资料
  const ragContext = await buildRAGContext({
    query: topic,
    boardId,
    topK: 10,
  })
  
  // 3. 外部搜索 (可选)
  let webResults = ''
  if (includeWebSearch) {
    webResults = await webSearch(topic)
  }
  
  // 4. 生成研究报告
  const report = await LLMProvider.generate({
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: `${ragContext}\n\n网络搜索结果:\n${webResults}\n\n研究主题：${topic}` }
    ],
    config: {
      temperature: 0.3,
      maxTokens: 8000,
    },
  })
  
  // 5. 提取引用来源
  const sources = extractSources(report)
  
  return { report, thinking, sources }
}

const SYSTEM_PROMPT = `你是一位专业的研究分析师。请基于提供的资料生成一份结构化的研究报告。

报告结构：
1. 执行摘要 (200 字以内)
2. 核心发现 (3-5 个关键点)
3. 详细分析 (分章节，每章节有明确标题)
4. 数据来源 (列出所有引用的来源)
5. 后续建议 (可选的深入研究方向)

要求：
- 使用 Markdown 格式
- 关键数据标注来源
- 保持客观中立
- 如有不确定信息，明确标注`
```

---

## 5. 开发路线图

### Phase 1: MVP (2 周)

**目标：** 核心功能可用，可以演示

| 周次 | 任务 | 产出 |
|------|------|------|
| W1 | 项目初始化 + 基础布局 | Sidebar, Header, ThreeColumnLayout |
| W1 | Board 列表 + 详情 | BoardList, BoardCard, BoardDetail |
| W1 | Content 基础组件 | ContentCard, EmptyState |
| W2 | Chat Panel 基础 | ChatPanel, MessageList, ChatInput |
| W2 | API 集成 | Boards API, Contents API |
| W2 | 简单 AI 对话 | 调用 OpenAI API |

**验收标准：**
- ✅ 三栏布局完整
- ✅ 可以创建/查看 Board
- ✅ 可以发送消息并获得 AI 回复
- ✅ UI 还原度 > 80%

### Phase 2: 功能完善 (3 周)

| 周次 | 任务 | 产出 |
|------|------|------|
| W3 | 内容管理完整功能 | NoteEditor, LinkCard, FileUpload |
| W3 | 技能系统 | SkillSelector, Skills Market |
| W4 | AI 高级功能 | Thinking State, Streaming Response |
| W4 | 搜索功能 | Search Bar, Search Results |
| W5 | 用户系统 | Auth, User Settings |
| W5 | 数据持久化 | PostgreSQL 集成 |

**验收标准：**
- ✅ 所有核心功能可用
- ✅ AI 思考过程可展开
- ✅ 技能选择器工作
- ✅ 数据可持久化

### Phase 3: 优化与增强 (2 周)

| 周次 | 任务 | 产出 |
|------|------|------|
| W6 | 性能优化 | 虚拟滚动，懒加载 |
| W6 | RAG 集成 | 向量搜索，上下文检索 |
| W7 | 协作功能 | 实时协作，评论 |
| W7 | 文件处理 | PDF 解析，OCR |

---

## 5.1 5 Subagent 并发开发分工方案

### 分工策略

基于 73 张截图分析的功能模块，将开发任务拆分为 5 个独立子任务，每个 subagent 负责一个完整的功能模块（前端 + 后端）。

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Project Coordinator (主代理)                      │
│  - 任务分解与分配                                                        │
│  - 进度跟踪与汇总                                                        │
│  - 代码审查与合并                                                        │
│  - 冲突解决                                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────┬───────────┬───────────┬───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │Agent A  │ │Agent B  │ │Agent C  │ │Agent D  │ │Agent E  │
   │Layout   │ │Content  │ │AI Chat  │ │Backend  │ │Infra    │
   │& UI     │ │Mgmt     │ │& Skills │ │Core API │ │& Deploy │
   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Subagent A: 布局与基础 UI

**负责人:** Agent A  
**任务范围:** 基于截图还原整体布局和基础 UI 组件  
**截图参考:** `screenshots/02-boards/*`, `screenshots/07-interactions/*`

#### 前端任务
```
src/
├── components/
│   ├── layout/
│   │   ├── ThreeColumnLayout.tsx    ⭐ 核心布局 (260px + flex + 380px)
│   │   ├── Sidebar.tsx              ⭐ 左侧导航 (截图还原)
│   │   ├── Header.tsx               顶部栏
│   │   └── index.ts
│   ├── ui/
│   │   ├── Button.tsx               ⭐ 基础按钮 (primary/secondary/ghost)
│   │   ├── Input.tsx                ⭐ 输入框
│   │   ├── Modal.tsx                ⭐ 弹窗组件
│   │   ├── Dropdown.tsx             ⭐ 下拉菜单
│   │   ├── Card.tsx                 ⭐ 卡片容器
│   │   └── index.ts
│   └── shared/
│       ├── EmptyState.tsx           ⭐ 空状态 (截图 01-empty-state.jpg)
│       ├── LoadingSpinner.tsx       加载动画
│       └── ErrorBoundary.tsx        错误边界
├── styles/
│   ├── globals.css                  ⭐ 全局样式 (从截图提取颜色)
│   └── variables.css                ⭐ CSS Variables
└── lib/
    └── utils.ts                     cn() 工具函数
```

#### 交付物
- ✅ 三栏布局组件 (精确像素还原)
- ✅ 10+ 基础 UI 组件
- ✅ 颜色系统 (CSS Variables)
- ✅ 响应式断点配置

#### 预计工时：3 天

---

### Subagent B: 内容管理模块

**负责人:** Agent B  
**任务范围:** Board 和 Content 的完整功能  
**截图参考:** `screenshots/02-boards/*`, `screenshots/03-content/*`

#### 前端任务
```
src/features/boards/
├── components/
│   ├── BoardList.tsx            ⭐ 看板列表 (截图 01-boards-list.jpg)
│   ├── BoardCard.tsx            ⭐ 看板卡片
│   ├── BoardDetail.tsx          ⭐ 看板详情页 (截图 02-board-detail.jpg)
│   ├── CreateBoardModal.tsx     ⭐ 新建看板弹窗
│   ├── BoardSettings.tsx        看板设置
│   └── BoardArchive.tsx         归档看板
├── hooks/
│   ├── useBoards.ts             ⭐ Board 列表查询
│   ├── useBoard.ts              ⭐ 单个 Board 操作
│   └── index.ts
├── api/
│   └── boards.api.ts            ⭐ API 调用
└── types/
    └── board.types.ts           ⭐ TypeScript 类型

src/features/content/
├── components/
│   ├── ContentGrid.tsx          ⭐ 网格视图 (截图 02-grid-view.jpg)
│   ├── ContentList.tsx          ⭐ 列表视图 (截图 03-list-view.jpg)
│   ├── ContentCard.tsx          ⭐ 内容卡片
│   ├── NoteEditor.tsx           ⭐ 笔记编辑器 (截图 04-note-editor.jpg)
│   ├── LinkCard.tsx             ⭐ 链接卡片 (截图 05-link-card.jpg)
│   ├── FileUpload.tsx           ⭐ 文件上传 (截图 06-file-upload.jpg)
│   └── ContentActions.tsx       内容操作菜单
├── hooks/
│   ├── useContents.ts           ⭐ Content CRUD
│   └── useContent.ts
├── api/
│   └── contents.api.ts
└── types/
    └── content.types.ts
```

#### 后端任务 (Go)
```
internal/
├── handler/
│   ├── board_handler.go         ⭐ Board CRUD 处理器
│   └── content_handler.go       ⭐ Content CRUD 处理器
├── service/
│   ├── board_service.go         ⭐ Board 业务逻辑
│   └── content_service.go       ⭐ Content 业务逻辑
├── repository/
│   ├── board_repo.go            ⭐ Board 数据访问
│   └── content_repo.go          ⭐ Content 数据访问
└── model/
    ├── board.go                 ⭐ Board Model
    └── content.go               ⭐ Content Model
```

#### API 端点
```
GET    /api/v1/boards              # 列表
POST   /api/v1/boards              # 创建
GET    /api/v1/boards/:id          # 详情
PUT    /api/v1/boards/:id          # 更新
DELETE /api/v1/boards/:id          # 删除

GET    /api/v1/boards/:id/contents # 看板内容列表
POST   /api/v1/contents            # 创建内容
GET    /api/v1/contents/:id        # 详情
PUT    /api/v1/contents/:id        # 更新
DELETE /api/v1/contents/:id        # 删除
```

#### 交付物
- ✅ Board 完整 CRUD (前端 + 后端)
- ✅ Content 完整 CRUD (前端 + 后端)
- ✅ 5 种内容类型展示组件
- ✅ 笔记编辑器 (Tiptap 集成)

#### 预计工时：5 天

---

### Subagent C: AI 对话与技能系统

**负责人:** Agent C  
**任务范围:** AI 聊天面板和技能系统  
**截图参考:** `screenshots/04-ai-chat/*`, `screenshots/05-skills/*`

#### 前端任务
```
src/features/chat/
├── components/
│   ├── ChatPanel.tsx            ⭐ 聊天面板 (截图 01-welcome-initial.png)
│   ├── MessageList.tsx          ⭐ 消息列表 (截图 05-conversation.png)
│   ├── MessageBubble.tsx        ⭐ 消息气泡
│   ├── ChatInput.tsx            ⭐ 输入框 (截图 02-input-focused.png)
│   ├── SkillSelector.tsx        ⭐ 技能选择器 (截图展开状态)
│   ├── ThinkingIndicator.tsx    ⭐ 思考状态 (截图 03-ai-thinking.png)
│   └── StreamingText.tsx        流式文本显示
├── hooks/
│   ├── useChat.ts               ⭐ 聊天状态管理
│   ├── useSendMessage.ts        ⭐ 发送消息
│   └── useStreaming.ts          ⭐ 流式响应
├── api/
│   └── chat.api.ts              ⭐ SSE 流式 API
└── types/
    └── chat.types.ts

src/features/skills/
├── components/
│   ├── SkillsMarket.tsx         ⭐ 技能市场 (截图 01-skills-market.jpg)
│   ├── SkillCategory.tsx        ⭐ 技能分类
│   ├── SkillCard.tsx            ⭐ 技能卡片
│   ├── SkillDetail.tsx          ⭐ 技能详情 (截图 03-skill-detail.jpg)
│   └── SkillExecution.tsx       ⭐ 技能执行中 (截图 04-skill-execution.jpg)
├── hooks/
│   └── useSkills.ts             ⭐ 技能列表
├── api/
│   └── skills.api.ts
└── types/
    └── skill.types.ts
```

#### 后端任务 (Go)
```
internal/
├── handler/
│   ├── chat_handler.go          ⭐ Chat 处理器
│   ├── session_handler.go       ⭐ Session 处理器
│   └── skill_handler.go         ⭐ Skill 处理器
├── service/
│   ├── chat_service.go          ⭐ Chat 业务逻辑
│   ├── ai_service.go            ⭐ AI 集成核心
│   └── skill_service.go         ⭐ Skill 业务逻辑
├── ai/
│   ├── llm_router.go            ⭐ LLM 路由
│   ├── rag_pipeline.go          ⭐ RAG 检索增强
│   └── skills/
│       ├── deep_research.go     ⭐ 深度研究技能
│       ├── summarization.go     ⭐ 摘要技能
│       └── writer.go            ⭐ 写作技能
├── repository/
│   ├── session_repo.go          ⭐ Session 数据访问
│   └── message_repo.go          ⭐ Message 数据访问
└── model/
    ├── session.go               ⭐ Session Model
    ├── message.go               ⭐ Message Model
    └── skill.go                 ⭐ Skill Model
```

#### AI 集成
```go
// 多模型路由
type LLMRouter struct {
    openai   *OpenAI
    anthropic *Anthropic
    google   *Google
}

// RAG Pipeline
func BuildRAGContext(query string, boardID string) (string, error) {
    // 1. 生成 Embedding
    // 2. 向量搜索
    // 3. 构建上下文
}

// 技能执行
func ExecuteSkill(skillID string, params map[string]any) (*SkillResult, error) {
    // 1. 加载技能配置
    // 2. 构建 Prompt
    // 3. 调用 LLM
    // 4. 解析结果
}
```

#### API 端点
```
POST   /api/v1/sessions              # 创建会话
GET    /api/v1/sessions/:id          # 获取会话
POST   /api/v1/sessions/:id/messages # 发送消息 (SSE)
GET    /api/v1/skills                # 技能列表
POST   /api/v1/skills/:id/invoke     # 调用技能
```

#### 交付物
- ✅ ChatPanel 完整功能 (含思考状态)
- ✅ 技能选择器组件
- ✅ 流式响应支持 (SSE)
- ✅ 3 个 AI 技能实现
- ✅ RAG Pipeline

#### 预计工时：6 天

---

### Subagent D: 后端核心 API

**负责人:** Agent D  
**任务范围:** 用户系统、认证、搜索、文件等后端核心功能  
**截图参考:** `screenshots/06-settings/*`

#### 后端任务 (Go)
```
internal/
├── handler/
│   ├── auth_handler.go            ⭐ 认证处理器
│   ├── user_handler.go            ⭐ 用户处理器
│   ├── search_handler.go          ⭐ 搜索处理器
│   └── file_handler.go            ⭐ 文件处理器
├── service/
│   ├── auth_service.go            ⭐ JWT 认证服务
│   ├── user_service.go            ⭐ 用户服务
│   ├── search_service.go          ⭐ 搜索服务
│   └── file_service.go            ⭐ 文件服务
├── repository/
│   ├── user_repo.go               ⭐ 用户数据访问
│   └── subscription_repo.go       ⭐ 订阅数据访问
├── middleware/
│   ├── auth.go                    ⭐ JWT 认证中间件
│   ├── cors.go                    ⭐ CORS 中间件
│   ├── ratelimit.go               ⭐ 限流中间件
│   └── logger.go                  ⭐ 日志中间件
├── pkg/
│   ├── database/
│   │   ├── postgres.go            ⭐ PG 连接池
│   │   └── redis.go               ⭐ Redis 连接
│   ├── qdrant/
│   │   └── client.go              ⭐ 向量数据库客户端
│   └── minio/
│       └── client.go              ⭐ 对象存储客户端
└── model/
    ├── user.go                    ⭐ User Model
    ├── subscription.go            ⭐ Subscription Model
    └── file.go                    ⭐ File Model
```

#### 核心功能
```go
// 1. JWT 认证
func GenerateToken(userID string) (string, error)
func ValidateToken(tokenString string) (*Claims, error)

// 2. 文件上传 (直传 S3)
func GetPresignedURL(filename string, mimeType string) (string, error)
func ProcessFile(fileID string) error  // 异步处理

// 3. 全文搜索
func SearchContents(query string, boardID string) ([]Content, error)
func SemanticSearch(query string, topK int) ([]Content, error)

// 4. 用户订阅
func CheckCredits(userID string) (int, error)
func DeductCredits(userID string, amount int) error
```

#### API 端点
```
# 认证
POST   /api/v1/auth/register         # 注册
POST   /api/v1/auth/login            # 登录
POST   /api/v1/auth/refresh          # 刷新 Token

# 用户
GET    /api/v1/user/profile          # 个人资料
PUT    /api/v1/user/profile          # 更新资料
GET    /api/v1/user/subscription     # 订阅信息

# 搜索
GET    /api/v1/search                # 全文搜索
POST   /api/v1/search/semantic       # 语义搜索

# 文件
POST   /api/v1/files/upload          # 获取上传 URL
GET    /api/v1/files/:id             # 文件信息
DELETE /api/v1/files/:id             # 删除文件
```

#### 交付物
- ✅ 完整认证系统 (JWT)
- ✅ 用户系统
- ✅ 文件上传 (S3 直传)
- ✅ 搜索功能
- ✅ 中间件 (CORS/限流/日志)

#### 预计工时：5 天

---

### Subagent E: 基础设施与部署

**负责人:** Agent E  
**任务范围:** 开发环境、CI/CD、监控、文档

#### 任务清单
```
infra/
├── docker/
│   ├── Dockerfile.frontend        ⭐ 前端镜像
│   ├── Dockerfile.backend         ⭐ 后端镜像
│   └── docker-compose.yml         ⭐ 本地开发环境
├── k8s/
│   ├── deployment.yaml            ⭐ K8s 部署配置
│   ├── service.yaml               ⭐ 服务配置
│   └── ingress.yaml               ⭐ Ingress 配置
├── github-actions/
│   ├── ci-frontend.yml            ⭐ 前端 CI
│   ├── ci-backend.yml             ⭐ 后端 CI
│   └── cd.yml                     ⭐ CD 配置
├── monitoring/
│   ├── prometheus.yml             ⭐ Prometheus 配置
│   └── grafana-dashboard.json     ⭐ Grafana 面板
└── scripts/
    ├── setup.sh                   ⭐ 环境初始化
    └── deploy.sh                  ⭐ 部署脚本

docs/
├── API.md                         ⭐ API 文档 (Swag)
├── DEVELOPMENT.md                 ⭐ 开发指南
├── DEPLOYMENT.md                  ⭐ 部署指南
└── ARCHITECTURE.md                ⭐ 架构文档
```

#### Docker Compose (本地开发)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: youmind
      POSTGRES_USER: youmind
      POSTGRES_PASSWORD: youmind123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  backend:
    build:
      context: ../backend
      dockerfile: ../infra/docker/Dockerfile.backend
    environment:
      DATABASE_URL: postgres://youmind:youmind123@postgres:5432/youmind
      REDIS_URL: redis://redis:6379
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ../frontend
      dockerfile: ../infra/docker/Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
  qdrant_data:
  minio_data:
```

#### GitHub Actions CI/CD
```yaml
# .github/workflows/ci-backend.yml
name: CI - Backend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: go test ./... -race -coverprofile=coverage.out
      - uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          push: false
          tags: youmind-backend:${{ github.sha }}
```

#### 交付物
- ✅ Docker Compose 本地开发环境
- ✅ GitHub Actions CI/CD
- ✅ API 文档 (Swagger)
- ✅ 监控配置 (Prometheus + Grafana)
- ✅ 部署脚本

#### 预计工时：3 天

---

## 5.2 协作流程

### Git 分支策略

```
main (受保护)
  │
  ├── develop (集成分支)
  │     │
  │     ├── feature/agent-a-layout
  │     ├── feature/agent-b-content
  │     ├── feature/agent-b-boards
  │     ├── feature/agent-c-chat
  │     ├── feature/agent-d-auth
  │     └── feature/agent-e-docker
  │
  └── release/v1.0.0 (发布分支)
```

### 代码审查流程

```
1. Subagent 完成模块开发
         ↓
2. 创建 Pull Request 到 develop
         ↓
3. 主代理 Code Review
         ↓
4. 自动化测试 (CI)
         ↓
5. 合并到 develop
         ↓
6. 集成测试
         ↓
7. 发布到 main
```

### 每日站会 (Subagent 同步)

每个 subagent 每日汇报：
```
1. 昨日完成
2. 今日计划
3. 遇到的阻塞
4. 需要的协助
```

### 接口对齐

**API 接口定义优先：**
1. Agent D 先定义 OpenAPI/Swagger 规范
2. 所有 subagent 基于统一 API 规范开发
3. 使用 Mock Server 并行开发

**TypeScript 类型共享：**
```typescript
// packages/types/src/index.ts
// 所有前端 subagent 共享的类型定义
export interface Board { ... }
export interface Content { ... }
export interface Message { ... }
```

---

## 5.3 进度跟踪

### 任务看板 (Kanban)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   To Do      │  In Progress │    Review    │    Done      │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ Agent A:     │ Agent B:     │ Agent C:     │ Agent E:     │
│ - Responsive │ - NoteEditor │ - ChatPanel  │ - Docker     │
│              │ - Tiptap     │ - SSE        │ - CI/CD      │
│              │              │              │              │
│ Agent D:     │ Agent A:     │ Agent B:     │              │
│ - Search API │ - Modal      │ - BoardList  │              │
│ - File S3    │ - Dropdown   │ - ContentCard│              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### 关键里程碑

| 里程碑 | 时间 | 验收标准 |
|--------|------|---------|
| MVP v0.1 | Week 2 | 三栏布局 + Board CRUD + 简单 AI 对话 |
| Alpha v0.5 | Week 4 | 所有核心功能可用 + 数据持久化 |
| Beta v1.0 | Week 7 | 性能优化 + RAG + 完整测试 |

### 风险管理

| 风险 | 影响 | 应对 |
|------|------|------|
| Subagent 进度不一致 | 高 | 每日同步，及时调整 |
| 接口定义变更 | 中 | API 优先，版本控制 |
| 代码合并冲突 | 中 | 小步提交，频繁合并 |
| AI API 成本高 | 高 | 本地 Mock + 限流 |

---

## 6. 技术风险与应对

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| 浏览器截图不稳定 | 中 | 中 | 手动补充截图，使用 Playwright 自动化 |
| AI API 成本高 | 高 | 高 | 使用本地模型 (Ollama) 做开发测试 |
| 实时协作复杂 | 高 | 中 | 使用 Yjs 库，降低实现难度 |
| 文件处理耗时 | 中 | 高 | 异步队列处理，显示进度 |
| 向量搜索效果差 | 中 | 中 | 调整 Embedding 模型，添加重排序 |

---

## 7. 成本估算

### 开发成本

| 角色 | 人周 | 单价 | 小计 |
|------|------|------|------|
| 前端开发 (React) | 5 | ¥20k | ¥100k |
| 后端开发 (Go) | 4 | ¥22k | ¥88k |
| UI 设计 | 2 | ¥15k | ¥30k |
| 测试 | 2 | ¥15k | ¥30k |
| **合计** | | | **¥248k** |

> Go 后端开发单价略高，但性能更好、运维成本更低

### 基础设施成本 (月)

| 服务 | 配置 | 月费 |
|------|------|------|
| 服务器 | 4C8G × 2 (Go 编译后二进制，资源占用低) | ¥400 |
| 数据库 | PostgreSQL 高可用 | ¥300 |
| Redis | 主从 | ¥100 |
| 对象存储 | 100GB | ¥50 |
| AI API | 按量 | ¥2000 |
| **合计** | | **¥2850/月** |

### Go vs Node.js 对比

| 维度 | Go | Node.js |
|------|-----|---------|
| 性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 并发 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 部署 | ⭐⭐⭐⭐⭐ (单二进制) | ⭐⭐⭐ (需 Node 环境) |
| 开发效率 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 生态丰富度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 运维成本 | ⭐⭐⭐⭐⭐ (低) | ⭐⭐⭐ (中) |

---

## 8. 下一步行动

### 立即可开始

#### 8.1 前端初始化

```bash
# 1. 创建 Vite + React + TypeScript 项目
npm create vite@latest youmind-clone -- --template react-ts
cd youmind-clone

# 2. 安装核心依赖
npm install

# 3. 安装 UI 相关
npm install zustand @tanstack/react-query @radix-ui/react-dialog
npm install lucide-react framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. 启动开发服务器
npm run dev
```

#### 8.2 后端初始化 (Go)

```bash
# 1. 创建后端项目目录
mkdir -p youmind-backend && cd youmind-backend

# 2. 初始化 Go module
go mod init youmind-clone

# 3. 安装核心依赖
go get -u github.com/gin-gonic/gin
go get -u gorm.io/gorm
go get -u github.com/lib/pq
go get -u github.com/joho/godotenv
go get -u github.com/golang-jwt/jwt/v5
go get -u github.com/google/uuid
go get -u go.uber.org/zap
go get -u github.com/spf13/viper
go get -u github.com/redis/go-redis/v9

# 4. 安装开发工具
go install github.com/swaggo/swag/cmd/swag@latest
go install github.com/cosmtrek/air@latest  # 热重载

# 5. 创建项目结构
mkdir -p cmd/server internal/{config,handler,service,repository,model,middleware,ai,pkg/{database,qdrant,minio}}

# 6. 创建 .env 文件
cat > .env << EOF
DATABASE_URL=postgres://user:pass@localhost:5432/youmind?sslmode=disable
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
PORT=8080
EOF

# 7. 启动后端 (开发模式，热重载)
air
```

#### 8.3 数据库初始化

```bash
# 1. 使用 Docker 启动 PostgreSQL 和 Redis
docker run -d \
  --name youmind-db \
  -e POSTGRES_USER=youmind \
  -e POSTGRES_PASSWORD=youmind123 \
  -e POSTGRES_DB=youmind \
  -p 5432:5432 \
  postgres:16

docker run -d \
  --name youmind-redis \
  -p 6379:6379 \
  redis:7

# 2. 运行 GORM 自动迁移 (Go 代码中)
# 在 main.go 中添加:
#   db.AutoMigrate(&model.User{}, &model.Board{}, &model.Content{}, ...)
```

#### 8.4 第一周任务清单

**前端 (Week 1):**
- [ ] 项目初始化 + Tailwind 配置
- [ ] 基于截图还原颜色系统 (CSS Variables)
- [ ] 创建基础布局组件 (ThreeColumnLayout)
- [ ] 实现 Sidebar 组件 (从截图提取样式)
- [ ] 实现 BoardList + BoardCard 组件
- [ ] 实现 EmptyState 组件

**后端 (Week 1):**
- [ ] Go 项目初始化
- [ ] 配置 Gin 路由
- [ ] 实现 User Model + Repository
- [ ] 实现 Board Model + Repository + Service + Handler
- [ ] JWT 认证中间件
- [ ] 数据库迁移

**联调 (Week 1 周末):**
- [ ] 前端调用后端 API 获取 Board 列表
- [ ] 创建新 Board 并显示
- [ ] 基础认证流程打通

---

### 开发环境要求

| 工具 | 版本 | 用途 |
|------|------|------|
| Node.js | 20 LTS | 前端开发 |
| Go | 1.22 LTS | 后端开发 |
| PostgreSQL | 16 | 主数据库 |
| Redis | 7.2 | 缓存/会话 |
| Docker | 24+ | 容器化部署 |
| Git | latest | 版本控制 |

---

**文档版本：** v1.0  
**创建时间：** 2026-02-18  
**基于：** 73 张截图 + 完整功能体验 + TECHNICAL_SPEC.md
