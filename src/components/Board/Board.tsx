import { useMemo, useState, useRef } from 'react'
import { Search, LayoutGrid, FileText, Link, Upload, Loader2, AlertCircle, File, GitBranch } from 'lucide-react'
import { useBoardStore } from '../../lib/store'
import { fileAPI } from '../../lib/api'
import type { Content } from '../../lib/api'
import MindMapPanel from './MindMapPanel'

type ViewMode = 'grid' | 'mindmap'

interface BoardHeaderProps {
  boardName: string
  onSearch: (q: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

function BoardHeader({ boardName, onSearch, viewMode, onViewModeChange }: BoardHeaderProps) {
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
          <button 
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
            title="网格视图"
          >
            <LayoutGrid size={14} />
          </button>
          <button 
            onClick={() => onViewModeChange('mindmap')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'mindmap' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
            title="思维导图视图"
          >
            <GitBranch size={14} />
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

interface AddButtonsProps {
  onAdd: (type: 'note' | 'link' | 'file') => void
  isUploading: boolean
}

function AddButtons({ onAdd, isUploading }: AddButtonsProps) {
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
      <button 
        onClick={() => onAdd('file')} 
        disabled={isUploading}
        className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-md text-[13px] text-white/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        <span>{isUploading ? '上传中...' : '添加文件'}</span>
      </button>
    </div>
  )
}

function ContentCard({ item }: { item: Content }) {
  const isFile = item.type === 'file'
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 transition">
      <div className="flex items-start gap-2">
        {isFile && <File size={14} className="text-white/40 mt-0.5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-white/80 font-medium mb-1 truncate">{item.title}</div>
          <div className="text-[12px] text-white/40 line-clamp-3 whitespace-pre-wrap">{item.content}</div>
          {isFile && item.fileSize && (
            <div className="mt-1 text-[10px] text-white/30">
              {formatFileSize(item.fileSize)}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 text-[10px] text-white/30 uppercase">{item.type}</div>
    </div>
  )
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

interface BoardProps {
  boardId: string
}

export default function Board({ boardId }: BoardProps) {
  const [query, setQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  // File upload handler
  const onFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)
    
    try {
      // Use the centralized fileAPI for upload
      const result = await fileAPI.upload(boardId, file)
      
      // Create content entry with file details from server response
      const id = `${Date.now()}`
      const newContent: Content = {
        id,
        boardId,
        title: result.title || file.name,
        content: result.content || `文件: ${file.name}`,
        type: 'file',
        filePath: result.filePath,
        fileSize: result.fileSize || file.size,
        mimeType: result.mimeType || file.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      addContent(boardId, newContent)
      
    } catch (error) {
      console.error('File upload error:', error)
      const errorMessage = error instanceof Error ? error.message : '上传失败，请重试'
      setUploadError(errorMessage)
      
      // Auto-clear error after 5 seconds
      setTimeout(() => setUploadError(null), 5000)
    } finally {
      setIsUploading(false)
    }
  }

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
    // Reset input so same file can be uploaded again
    event.target.value = ''
  }

  const handleAdd = (type: 'note' | 'link' | 'file') => {
    if (type === 'file') {
      // Trigger file input click
      fileInputRef.current?.click()
      return
    }
    
    const id = `${Date.now()}`
    const title = type === 'note' ? '新笔记' : '新链接'
    const content = type === 'note' ? '在这里写下你的想法…' : 'https://example.com'
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

  // MindMap view - render MindMapPanel instead
  if (viewMode === 'mindmap') {
    return (
      <MindMapPanel boardId={boardId} boardTitle={boardName} onViewModeChange={setViewMode} />
    )
  }
  
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="*/*"
      />
      
      <BoardHeader boardName={boardName} onSearch={setQuery} viewMode={viewMode} onViewModeChange={setViewMode} />
      
      {/* Upload error message */}
      {uploadError && (
        <div className="mx-5 mt-3 flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-md text-[13px] text-red-400">
          <AlertCircle size={14} />
          <span>{uploadError}</span>
        </div>
      )}
      
      {filtered.length === 0 ? (
        <>
          <EmptyState />
          <AddButtons onAdd={handleAdd} isUploading={isUploading} />
        </>
      ) : (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => <ContentCard key={item.id} item={item} />)}
        </div>
      )}
      
      {/* Upload overlay spinner */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-white/60" />
            <span className="text-white/70 text-sm">正在上传文件...</span>
          </div>
        </div>
      )}
    </div>
  )
}