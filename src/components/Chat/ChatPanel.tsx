import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Mic, ChevronDown, MoreHorizontal } from 'lucide-react'
import { useBoardStore, type Message } from '../../lib/store'

// Simple ID generator fallback
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

function ChatMessage({ message }: { message: Message }) {
  const [showThinking, setShowThinking] = useState(false)

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13px] leading-relaxed shadow-lg">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 mb-4 animate-fade-in">
      <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
        <Sparkles size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[13px] font-medium text-white/80">深度研究助手</span>
          {message.thinking && (
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/50 transition-colors"
            >
              <span>思考了 {message.thinkingTime} 秒</span>
              <ChevronDown size={10} className={`transform transition-transform ${showThinking ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
        
        {showThinking && message.thinking && (
          <div className="mb-2.5 p-2.5 bg-white/5 rounded-lg border border-white/10 text-[12px] text-white/40 leading-relaxed">
            {message.thinking}
          </div>
        )}
        
        <div className="text-[13px] text-white/70 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  )
}

function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [input, setInput] = useState('')
  const [showSkills, setShowSkills] = useState(false)

  return (
    <div className="border-t border-white/5 p-4">
      <div className="relative">
        <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5 focus-within:border-white/20 transition-colors">
          {/* Skill Button */}
          <button 
            onClick={() => setShowSkills(!showSkills)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-[12px] text-white/60 transition-colors flex-shrink-0"
          >
            <Sparkles size={12} className="text-[#6366f1]" />
            <span>深度研究</span>
          </button>
          
          {/* Input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (input.trim()) {
                  onSend(input)
                  setInput('')
                }
              }
            }}
            placeholder="描述任务或输入 / 使用技能"
            className="flex-1 bg-transparent text-[13px] text-white/70 placeholder:text-white/30 resize-none outline-none py-1 min-h-[20px] max-h-[100px] leading-relaxed"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = target.scrollHeight + 'px'
            }}
          />
          
          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="p-2 text-white/30 hover:text-white/60 hover:bg-white/10 rounded-lg transition-colors">
              <Mic size={14} />
            </button>
            <button
              onClick={() => {
                if (input.trim()) {
                  onSend(input)
                  setInput('')
                }
              }}
              disabled={!input.trim()}
              className="p-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-md"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        
        {/* Skills Dropdown */}
        {showSkills && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-3 py-2 text-[11px] text-white/30 border-b border-white/5">可用技能</div>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left">
              <Sparkles size={14} className="text-[#6366f1]" />
              <div>
                <div className="text-[13px] text-white/80">深度研究</div>
                <div className="text-[11px] text-white/40">针对特定主题进行深度调研</div>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left">
              <Sparkles size={14} className="text-[#10b981]" />
              <div>
                <div className="text-[13px] text-white/80">智能总结</div>
                <div className="text-[11px] text-white/40">自动总结资料和笔记</div>
              </div>
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-2.5 text-[11px] text-white/30 text-center">
        AI 助手可能会生成不准确的信息，请验证重要信息。
      </div>
    </div>
  )
}

export default function ChatPanel() {
  const selectedBoardId = useBoardStore((state) => state.selectedBoardId)
  const messagesMap = useBoardStore((state) => state.messages)
  const addMessage = useBoardStore((state) => state.addMessage)
  
  const messages = selectedBoardId ? (messagesMap[selectedBoardId] || []) : []
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!selectedBoardId) return

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    }
    addMessage(selectedBoardId, userMessage)

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `我收到了关于 "${text}" 的请求。这是基于当前 "${selectedBoardId}" 看板的模拟回复。\n\n在实际系统中，这里将接入真实的 AI 模型，结合看板上下文进行深度回复。`,
        thinking: '正在分析用户请求并结合当前看板上下文...',
        thinkingTime: 1.5,
        timestamp: Date.now()
      }
      addMessage(selectedBoardId, aiMessage)
    }, 1500)
  }

  return (
    <aside className="w-[360px] h-full bg-[#0a0a0a] border-l border-white/5 flex flex-col">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center shadow-md">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-white/80">深度研究助手</h3>
            <p className="text-[11px] text-white/40">随时为你提供研究支持</p>
          </div>
        </div>
        <button className="p-2 text-white/30 hover:text-white/60 hover:bg-white/5 rounded-lg transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/30 text-[13px]">
            <Sparkles size={24} className="mb-2 opacity-50" />
            <p>开始一个新的对话...</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} />
    </aside>
  )
}
