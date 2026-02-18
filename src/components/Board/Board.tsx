import { Search, LayoutGrid, List, FileText, Link, Upload, Sparkles } from 'lucide-react'

interface BoardHeaderProps {
  boardName: string
}

function BoardHeader({ boardName }: BoardHeaderProps) {
  return (
    <div className="h-12 flex items-center justify-between px-5 border-b border-white/5">
      <h1 className="text-[15px] font-medium text-white">{boardName}</h1>
      
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="搜索资料..."
            className="w-56 bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-[13px] text-white/70 placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors"
          />
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/5 rounded-md p-0.5">
          <button className="p-1.5 rounded bg-white/10 text-white">
            <LayoutGrid size={14} />
          </button>
          <button className="p-1.5 rounded text-white/40 hover:text-white/70">
            <List size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-5">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/20">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </div>
      <h3 className="text-[17px] font-medium text-white mb-2">资料是创意的起点</h3>
      <p className="text-white/40 text-center max-w-md text-[13px] leading-relaxed mb-8">
        添加文件、链接或笔记，或让 AI 自动收集资料
      </p>
    </div>
  )
}

function AddButtons() {
  return (
    <div className="flex items-center justify-center gap-2.5 pb-6">
      <button className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-md text-[13px] text-white/60 transition-all">
        <FileText size={14} />
        <span>新建笔记</span>
      </button>
      <button className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-md text-[13px] text-white/60 transition-all">
        <Link size={14} />
        <span>添加链接</span>
      </button>
      <button className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-md text-[13px] text-white/60 transition-all">
        <Upload size={14} />
        <span>添加文件</span>
      </button>
    </div>
  )
}

interface BoardProps {
  boardName: string
}

export default function Board({ boardName }: BoardProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
      <BoardHeader boardName={boardName} />
      <EmptyState />
      <AddButtons />
    </div>
  )
}
