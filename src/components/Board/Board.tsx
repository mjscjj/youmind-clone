import { useMemo, useState } from 'react'
import { Search, LayoutGrid, List, FileText, Link, Upload } from 'lucide-react'
import { useBoardStore } from '../../lib/store'
import type { Content } from '../../lib/api'

interface BoardHeaderProps {
  boardName: string
  onSearch: (q: string) => void
}

function BoardHeader({ boardName, onSearch }: BoardHeaderProps) {
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
            onChange={(e) => onSearch(e.target.value)}
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

function AddButtons({ onAdd }: { onAdd: (type: 'note' | 'link' | 'file') => void }) {
  return (
    <div className="flex items-center justify-center gap-2.5 pb-6">
      <button onClick={() => onAdd('note')} className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-md text-[13px] text-white/60 transition-all">
        <FileText size={14} />
        <span>新建笔记</span>
      </button>
      <button onClick={() => onAdd('link')} className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-md text-[13px] text-white/60 transition-all">
        <Link size={14} />
        <span>添加链接</span>
      </button>
      <button onClick={() => onAdd('file')} className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-md text-[13px] text-white/60 transition-all">
        <Upload size={14} />
        <span>添加文件</span>
      </button>
    </div>
  )
}

function ContentCard({ item }: { item: Content }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 transition">
      <div className="text-[13px] text-white/80 font-medium mb-1 truncate">{item.title}</div>
      <div className="text-[12px] text-white/40 line-clamp-3 whitespace-pre-wrap">{item.content}</div>
      <div className="mt-2 text-[10px] text-white/30 uppercase">{item.type}</div>
    </div>
  )
}

interface BoardProps {
  boardId: string
}

export default function Board({ boardId }: BoardProps) {
  const [query, setQuery] = useState('')
  const boards = useBoardStore((s) => s.boards)
  const contents = useBoardStore((s) => s.contents[boardId] || [])
  const addContent = useBoardStore((s) => s.addContent)

  const board = boards.find(b => b.id === boardId)
  const boardName = board?.title || '未命名'

  const filtered = useMemo(() => {
    if (!query) return contents
    const q = query.toLowerCase()
    return contents.filter(c => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q))
  }, [query, contents])

  const handleAdd = (type: 'note' | 'link' | 'file') => {
    const id = `${Date.now()}`
    const title = type === 'note' ? '新笔记' : type === 'link' ? '新链接' : '新文件'
    const content = type === 'note' ? '在这里写下你的想法…' : type === 'link' ? 'https://example.com' : '文件已添加（示例）'
    addContent(boardId, {
      id,
      boardId,
      title,
      content,
      type: type as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
      <BoardHeader boardName={boardName} onSearch={setQuery} />
      {filtered.length === 0 ? (
        <>
          <EmptyState />
          <AddButtons onAdd={handleAdd} />
        </>
      ) : (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => <ContentCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
