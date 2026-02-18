import { Layout, FolderOpen, Lightbulb, User, Settings, Search, Zap, Plus, X } from 'lucide-react'
import { useBoardStore } from '../../lib/store'
import { useState, useMemo } from 'react'
import SearchResults from './SearchResults'

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-all ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/50 hover:bg-white/5 hover:text-white/80'
      }`}
    >
      <div className="w-4 h-4 flex items-center justify-center opacity-70">{icon}</div>
      <span className="truncate">{label}</span>
    </button>
  )
}

interface SidebarProps {
  selectedBoard: string
  onSelectBoard: (board: string) => void
}

export default function Sidebar({ selectedBoard, onSelectBoard }: SidebarProps) {
  const { boards, isSkillPickerOpen, setSkillPickerOpen, contents, searchQuery, setSearchQuery } = useBoardStore()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return Object.values(contents).flat().filter(content => 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [contents, searchQuery])

  return (
    <aside className="w-[240px] h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-md flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-xs select-none">Y</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight select-none">YouMind</span>
        </div>
      </div>

      {/* New Task / Skill Button */}
      <div className="p-3">
        <button 
          onClick={() => setSkillPickerOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 transition-colors py-2 rounded-md text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2 relative z-50">
        <div className="relative group">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/50 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-[13px] text-white/70 placeholder:text-white/30 focus:border-white/20 focus:bg-white/10 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
            >
              <X size={12} />
            </button>
          )}
        </div>
        {isSearchFocused && searchQuery && (
          <SearchResults 
            results={searchResults} 
            onSelectResult={(boardId, contentId) => {
              onSelectBoard(boardId)
              setSearchQuery('')
            }} 
          />
        )}
      </div>

      {/* Skills Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 py-2 space-y-0.5">
          <div className="px-2 pb-2 pt-1">
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider select-none">Skills</span>
          </div>
          <SidebarItem
            icon={<Zap size={14} className="text-yellow-400" />}
            label="AI Skills"
            active={isSkillPickerOpen}
            onClick={() => setSkillPickerOpen(true)}
          />
        </div>

        {/* Board List */}
        <div className="px-3 py-2 space-y-0.5">
          <div className="px-2 pb-2 pt-1 border-t border-white/5 mt-1">
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider select-none">Boards</span>
          </div>
          {boards.map((board) => (
            <SidebarItem
              key={board.id}
              icon={board.id === '1' ? <Layout size={14} /> : board.id === '2' ? <FolderOpen size={14} /> : <Lightbulb size={14} />}
              label={board.title}
              active={selectedBoard === board.id}
              onClick={() => onSelectBoard(board.id)}
            />
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-white/5 bg-[#050505]/50">
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 transition-colors group">
          <div className="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center text-white text-xs font-medium ring-2 ring-black">
            L
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-medium text-white/90 truncate group-hover:text-white">Leon</p>
            <p className="text-[11px] text-white/40 truncate">Pro Account</p>
          </div>
          <Settings size={14} className="text-white/30 group-hover:text-white/60 transition-colors" />
        </button>
      </div>
    </aside>
  )
}
