import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Board, Content, Skill, Message } from './types'

export interface BoardState {
  boards: Board[]
  selectedBoardId: string | null
  contents: Record<string, Content[]> // boardId -> contents
  messages: Record<string, Message[]> // boardId -> messages
  searchQuery: string
  searchResults: Content[]
  
  // Skills State
  skills: Skill[]
  selectedSkillId: string | null
  isSkillPickerOpen: boolean

  // Deep Research State
  isDeepResearchModalOpen: boolean
  deepResearchStep: number
  deepResearchLogs: string[]
  deepResearchQuery: string
  deepResearchResult: string | null

  // Actions
  setBoards: (boards: Board[]) => void
  selectBoard: (id: string) => void
  addBoard: (board: Board) => void
  updateBoard: (board: Board) => void
  removeBoard: (id: string) => void

  setContents: (boardId: string, items: Content[]) => void
  addContent: (boardId: string, item: Content) => void
  updateContent: (boardId: string, item: Content) => void
  removeContent: (boardId: string, id: string) => void

  addMessage: (boardId: string, message: Message) => void

  setSearchQuery: (q: string) => void
  setSearchResults: (results: Content[]) => void

  // Skills Actions
  setSkills: (skills: Skill[]) => void
  selectSkill: (id: string | null) => void
  setSkillPickerOpen: (isOpen: boolean) => void
  
  // Deep Research Actions
  setDeepResearchModalOpen: (isOpen: boolean) => void
  setDeepResearchStep: (step: number) => void
  addDeepResearchLog: (log: string) => void
  setDeepResearchQuery: (query: string) => void
  setDeepResearchResult: (result: string | null) => void
  resetDeepResearch: () => void
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [
        { id: '1', title: '深度研究', description: '研究与分析', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', title: '我的资料', description: '素材与引用', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '3', title: '灵感收集', description: '想法与灵感', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ],
      selectedBoardId: '1',
      contents: {
        '1': [],
        '2': [],
        '3': [],
      },
      messages: {
        '1': [],
        '2': [],
        '3': [],
      },
      searchQuery: '',
      searchResults: [],
      
      skills: [
        { id: 'deep-research', name: '深度研究', description: '基于全网信息的深度分析与报告', icon: 'search', category: 'research' },
        { id: 'writing-assistant', name: '写作助手', description: '润色、扩写、改写你的文章', icon: 'pen-tool', category: 'writing' },
        { id: 'code-review', name: '代码审查', description: '分析代码质量与潜在问题', icon: 'code', category: 'coding' },
      ],
      selectedSkillId: null,
      isSkillPickerOpen: false,

      isDeepResearchModalOpen: false,
      deepResearchStep: 0,
      deepResearchLogs: [],
      deepResearchQuery: '',
      deepResearchResult: null,

      setBoards: (boards) => set({ boards }),
      selectBoard: (id) => set({ selectedBoardId: id }),
      addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
      updateBoard: (board) => set((state) => ({ boards: state.boards.map(b => b.id === board.id ? board : b) })),
      removeBoard: (id) => set((state) => ({ boards: state.boards.filter(b => b.id !== id) })),

      setContents: (boardId, items) => set((state: BoardState) => ({ contents: { ...state.contents, [boardId]: items } })),
      addContent: (boardId, item) => set((state: BoardState) => {
        const currentItems = state.contents[boardId] || []
        return { contents: { ...state.contents, [boardId]: [item, ...currentItems] } }
      }),
      updateContent: (boardId, item) => set((state: BoardState) => {
        const updatedItems = (state.contents[boardId] || []).map(c => c.id === item.id ? item : c)
        return { contents: { ...state.contents, [boardId]: updatedItems } }
      }),
      removeContent: (boardId, id) => set((state: BoardState) => {
        const filteredItems = (state.contents[boardId] || []).filter(c => c.id !== id)
        return { contents: { ...state.contents, [boardId]: filteredItems } }
      }),

      addMessage: (boardId, message) => set((state: BoardState) => {
        const currentMessages = state.messages?.[boardId] || []
        return { messages: { ...state.messages, [boardId]: [...currentMessages, message] } }
      }),

      setSearchQuery: (q) => set({ searchQuery: q }),
      setSearchResults: (results) => set({ searchResults: results }),

      setSkills: (skills) => set({ skills }),
      selectSkill: (id) => set({ selectedSkillId: id }),
      setSkillPickerOpen: (isOpen) => set({ isSkillPickerOpen: isOpen }),
      
      setDeepResearchModalOpen: (isOpen) => set({ isDeepResearchModalOpen: isOpen }),
      setDeepResearchStep: (step) => set({ deepResearchStep: step }),
      addDeepResearchLog: (log) => set((state) => ({ deepResearchLogs: [...state.deepResearchLogs, log] })),
      setDeepResearchQuery: (query) => set({ deepResearchQuery: query }),
      setDeepResearchResult: (result) => set({ deepResearchResult: result }),
      resetDeepResearch: () => set({ deepResearchStep: 0, deepResearchLogs: [], deepResearchQuery: '', deepResearchResult: null }),
    }),
    {
      name: 'youmind-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
