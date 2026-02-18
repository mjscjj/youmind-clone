import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Board, Content } from './types'

export type ContentType = 'note' | 'task' | 'idea'

export interface BoardState {
  boards: Board[]
  selectedBoardId: string | null
  contents: Record<string, Content[]> // boardId -> contents
  searchQuery: string
  searchResults: Content[]
  
  // Deep Research State
  isDeepResearchModalOpen: boolean
  deepResearchStep: number // 0: Idle, 1: Planning, 2: Searching, 3: Analyzing, 4: Reporting
  deepResearchLogs: string[]
  deepResearchQuery: string

  setBoards: (boards: Board[]) => void
  selectBoard: (id: string) => void
  addBoard: (board: Board) => void
  updateBoard: (board: Board) => void
  removeBoard: (id: string) => void

  setContents: (boardId: string, items: Content[]) => void
  addContent: (boardId: string, item: Content) => void
  updateContent: (boardId: string, item: Content) => void
  removeContent: (boardId: string, id: string) => void

  setSearchQuery: (q: string) => void
  setSearchResults: (results: Content[]) => void
  
  // Deep Research Actions
  setDeepResearchModalOpen: (isOpen: boolean) => void
  setDeepResearchStep: (step: number) => void
  addDeepResearchLog: (log: string) => void
  setDeepResearchQuery: (query: string) => void
  resetDeepResearch: () => void
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [
        { id: 'research', title: '深度研究', description: '研究与分析', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'materials', title: '我的资料', description: '素材与引用', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'inspiration', title: '灵感收集', description: '想法与灵感', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
      selectedBoardId: 'research',
      contents: {
        research: [],
        materials: [],
        inspiration: [],
      },
      searchQuery: '',
      searchResults: [],
      
      isDeepResearchModalOpen: false,
      deepResearchStep: 0,
      deepResearchLogs: [],
      deepResearchQuery: '',

      setBoards: (boards) => set({ boards }),
      selectBoard: (id) => set({ selectedBoardId: id }),
      addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
      updateBoard: (board) => set((state) => ({ boards: state.boards.map(b => b.id === board.id ? board : b) })),
      removeBoard: (id) => set((state) => ({ boards: state.boards.filter(b => b.id !== id) })),

      setContents: (boardId, items) => set((state) => ({ contents: { ...state.contents, [boardId]: items } })),
      addContent: (boardId, item) => set((state) => {
        const currentItems = state.contents[boardId] || []
        return { contents: { ...state.contents, [boardId]: [item, ...currentItems] } }
      }),
      updateContent: (boardId, item) => set((state) => {
        const updatedItems = (state.contents[boardId] || []).map(c => c.id === item.id ? item : c)
        return { contents: { ...state.contents, [boardId]: updatedItems } }
      }),
      removeContent: (boardId, id) => set((state) => {
        const filteredItems = (state.contents[boardId] || []).filter(c => c.id !== id)
        return { contents: { ...state.contents, [boardId]: filteredItems } }
      }),

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchResults: (results) => set({ searchResults: results }),
      
      setDeepResearchModalOpen: (isOpen) => set({ isDeepResearchModalOpen: isOpen }),
      setDeepResearchStep: (step) => set({ deepResearchStep: step }),
      addDeepResearchLog: (log) => set((state) => ({ deepResearchLogs: [...state.deepResearchLogs, log] })),
      setDeepResearchQuery: (query) => set({ deepResearchQuery: query }),
      resetDeepResearch: () => set({ deepResearchStep: 0, deepResearchLogs: [], deepResearchQuery: '' }),
    }),
    {
      name: 'youmind-store',
    }
  )
)
