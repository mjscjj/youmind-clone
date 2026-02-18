import { useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
} from 'reactflow'
import type { Node, Edge, NodeProps } from 'reactflow'
import 'reactflow/dist/style.css'
import { FileText, File, Lightbulb, CheckSquare, RefreshCw, LayoutGrid } from 'lucide-react'
import { useBoardStore } from '../../lib/store'

// Custom Node Component
function ContentNode({ data }: NodeProps<ContentNodeData>) {
  const { title, type, content, isSelected } = data
  
  const getIcon = () => {
    switch (type) {
      case 'note':
        return <FileText size={14} className="text-blue-400" />
      case 'file':
        return <File size={14} className="text-green-400" />
      case 'idea':
        return <Lightbulb size={14} className="text-yellow-400" />
      case 'task':
        return <CheckSquare size={14} className="text-purple-400" />
      default:
        return <FileText size={14} className="text-white/50" />
    }
  }
  
  const getTypeColor = () => {
    switch (type) {
      case 'note':
        return 'border-blue-500/30 hover:border-blue-500/50'
      case 'file':
        return 'border-green-500/30 hover:border-green-500/50'
      case 'idea':
        return 'border-yellow-500/30 hover:border-yellow-500/50'
      case 'task':
        return 'border-purple-500/30 hover:border-purple-500/50'
      default:
        return 'border-white/10 hover:border-white/20'
    }
  }
  
  return (
    <div
      className={`
        bg-[#1a1a1a] border rounded-lg p-3 min-w-[180px] max-w-[250px]
        transition-all duration-200 cursor-pointer
        ${getTypeColor()}
        ${isSelected ? 'ring-2 ring-white/30 shadow-lg' : ''}
      `}
    >
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="!bg-white/20 !w-2 !h-2" />
      <Handle type="target" position={Position.Left} className="!bg-white/20 !w-2 !h-2" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <span className="text-[12px] text-white/50 uppercase font-medium">{type}</span>
      </div>
      
      {/* Title */}
      <h3 className="text-[13px] text-white/90 font-medium mb-1 truncate">{title}</h3>
      
      {/* Content Preview */}
      <p className="text-[11px] text-white/40 line-clamp-3 whitespace-pre-wrap">
        {content}
      </p>
      
      {/* Handles for connections */}
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-white/20 !w-2 !h-2" />
    </div>
  )
}

// Board Header Node
function BoardHeaderNode({ data }: NodeProps<{ title: string; count: number }>) {
  return (
    <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-xl p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="!bg-violet-400 !w-3 !h-3" />
      <h2 className="text-[15px] text-white font-semibold mb-1">{data.title}</h2>
      <p className="text-[12px] text-white/50">{data.count} items</p>
      <Handle type="source" position={Position.Bottom} className="!bg-violet-400 !w-3 !h-3" />
    </div>
  )
}

// Node types registry
const nodeTypes = {
  content: ContentNode,
  boardHeader: BoardHeaderNode,
}

interface ContentNodeData {
  title: string
  type: string
  content: string
  isSelected?: boolean
}

interface MindMapPanelProps {
  boardId: string
  boardTitle: string
  onViewModeChange?: (mode: 'grid' | 'mindmap') => void
}

export default function MindMapPanel({ boardId, boardTitle, onViewModeChange }: MindMapPanelProps) {
  const contents = useBoardStore((s) => s.contents[boardId] || [])
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  
  // Convert contents to nodes
  const { initialNodes, initialEdges } = useMemo(() => {
    if (contents.length === 0) {
      return { initialNodes: [], initialEdges: [] }
    }
    
    // Create board header node at center top
    const headerNode: Node = {
      id: 'board-header',
      type: 'boardHeader',
      position: { x: 400, y: 50 },
      data: { title: boardTitle, count: contents.length },
      draggable: false,
    }
    
    // Create content nodes in a radial layout
    const contentNodes: Node[] = contents.map((content, index) => {
      // Calculate position in a circle around the header
      const totalItems = contents.length
      const angle = (2 * Math.PI * index) / totalItems - Math.PI / 2 // Start from top
      const radius = 250 // Distance from center
      const x = 400 + radius * Math.cos(angle)
      const y = 250 + radius * Math.sin(angle)
      
      return {
        id: content.id,
        type: 'content',
        position: { x, y },
        data: {
          title: content.title,
          type: content.type,
          content: content.content.slice(0, 150),
        } as ContentNodeData,
      }
    })
    
    // Create edges from header to each content
    const contentEdges: Edge[] = contents.map((content) => ({
      id: `edge-${content.id}`,
      source: 'board-header',
      target: content.id,
      animated: false,
      style: { stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(255,255,255,0.3)',
      },
    }))
    
    return {
      initialNodes: [headerNode, ...contentNodes],
      initialEdges: contentEdges,
    }
  }, [contents, boardTitle])
  
  // Update nodes when contents change
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes)
      setEdges(initialEdges)
    }
  }, [initialNodes, initialEdges, setNodes, setEdges])
  
  // Handle node click for selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: n.id === node.id,
        },
      }))
    )
  }, [setNodes])
  
  // Fit view on initial load
  const onInit = useCallback(() => {
    // Could add fitView logic here if needed
  }, [])
  
  if (contents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a]">
        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-5">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/20">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="20" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="20" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 7V9M12 15V17M7 12H9M15 12H17" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <h3 className="text-[17px] font-medium text-white mb-2">思维导图视图</h3>
        <p className="text-white/40 text-center max-w-md text-[13px] leading-relaxed">
          添加笔记、文件或链接后，即可在此查看思维导图
        </p>
      </div>
    )
  }
  
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-5 border-b border-white/5">
        <h1 className="text-[15px] font-medium text-white">{boardTitle} - 思维导图</h1>
        <div className="flex items-center gap-2">
          {onViewModeChange && (
            <button
              onClick={() => onViewModeChange('grid')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[13px] transition-colors"
              title="返回网格视图"
            >
              <LayoutGrid size={14} />
              <span>网格视图</span>
            </button>
          )}
          <button
            onClick={() => {
              setNodes(initialNodes)
              setEdges(initialEdges)
            }}
            className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="重置布局"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      
      {/* React Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onInit={onInit}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{
            style: { stroke: 'rgba(255,255,255,0.15)' },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="rgba(255,255,255,0.05)" gap={20} />
          <Controls 
            className="!bg-white/5 !border-white/10 !rounded-lg"
            showZoom={true}
            showFitView={true}
            showInteractive={false}
          />
          <MiniMap 
            className="!bg-white/5 !border-white/10 !rounded-lg"
            nodeColor="rgba(255,255,255,0.3)"
            maskColor="rgba(0,0,0,0.7)"
          />
        </ReactFlow>
      </div>
    </div>
  )
}
