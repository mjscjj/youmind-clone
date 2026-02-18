import { FileText, Layout, FolderOpen, Lightbulb } from 'lucide-react'
import type { Content } from '../../lib/types'

interface SearchResultsProps {
  results: Content[]
  onSelectResult: (boardId: string, contentId: string) => void
  isLoading?: boolean
}

export default function SearchResults({ results, onSelectResult, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="absolute top-12 left-0 w-[300px] bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 p-2 text-white/50 text-xs text-center">
        Searching...
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-12 left-2 w-[220px] bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 p-3 text-white/50 text-xs text-center">
        No results found.
      </div>
    )
  }

  return (
    <div className="absolute top-12 left-2 w-[220px] max-h-[300px] overflow-y-auto custom-scrollbar bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 flex flex-col gap-0.5 p-1">
      {results.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectResult(item.boardId, item.id)}
          className="w-full text-left px-2 py-2 rounded md hover:bg-white/5 group transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <FileText size={12} className="text-white/40 group-hover:text-indigo-400" />
            <span className="text-xs font-medium text-white/90 truncate">{item.title}</span>
          </div>
          <p className="text-[10px] text-white/40 truncate pl-5">
            {item.content}
          </p>
        </button>
      ))}
    </div>
  )
}
