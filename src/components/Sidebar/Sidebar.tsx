import { Layout, FolderOpen, Lightbulb, Plus, User, Settings, Search } from 'lucide-react'

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
      <span className="w-4 h-4 flex items-center justify-center opacity-70">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

interface SidebarProps {
  selectedBoard: string
  onSelectBoard: (board: string) => void
}

const boards = [
  { id: 'research', name: '深度研究', icon: <Layout size={14} /> },
  { id: 'materials', name: '我的资料', icon: <FolderOpen size={14} /> },
  { id: 'inspiration', name: '灵感收集', icon: <Lightbulb size={14} /> },
]

export default function Sidebar({ selectedBoard, onSelectBoard }: SidebarProps) {
  return (
    <aside className="w-[240px] h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="h-12 flex items-center px-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">Y</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">YouMind</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-[13px] text-white/70 placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Board List */}
      <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        <div className="px-2.5 pb-2 pt-1">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">看板</span>
        </div>
        {boards.map((board) => (
          <SidebarItem
            key={board.id}
            icon={board.icon}
            label={board.name}
            active={selectedBoard === board.name}
            onClick={() => onSelectBoard(board.name)}
          />
        ))}
      </div>

      {/* User Section */}
      <div className="p-2 border-t border-white/5">
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-white/5 transition-colors">
          <div className="w-7 h-7 bg-gradient-to-br from-[#10b981] to-[#14b8a6] rounded-md flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-medium text-white/80 truncate">Leon</p>
            <p className="text-[11px] text-white/40 truncate">Free Plan</p>
          </div>
          <Settings size={14} className="text-white/30" />
        </button>
      </div>
    </aside>
  )
}
