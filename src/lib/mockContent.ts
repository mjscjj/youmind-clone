// Initialize some mock content for search testing
import { useBoardStore } from '../lib/store'

export function initializeMockContent() {
  const store = useBoardStore.getState()
  
  // Only init if empty
  const hasContent = Object.values(store.contents).some(arr => arr.length > 0)
  if (hasContent) return

  // Board 1: Research
  store.setContents('1', [
    {
      id: '101',
      boardId: '1',
      title: 'Market Analysis 2024',
      content: 'Competitor landscape shows a shift towards AI-integrated tools. Key players are investing heavily in LLM features.',
      type: 'note',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '102',
      boardId: '1',
      title: 'User Feedback Q1',
      content: 'Users are requesting better search functionality across all boards.',
      type: 'note',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])

  // Board 2: Design
  store.setContents('2', [
    {
      id: '201',
      boardId: '2',
      title: 'Logo Specs',
      content: 'Primary color: #6366f1. Secondary: #8b5cf6. Fonts: Inter, sans-serif.',
      type: 'note',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '202',
      boardId: '2',
      title: 'UI Component Library',
      content: 'List of core components: Button, Input, Modal, Sidebar, Card.',
      type: 'task',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])

  // Board 3: Ideas
  store.setContents('3', [
    {
      id: '301',
      boardId: '3',
      title: 'Future Features',
      content: '1. Voice notes\n2. Real-time collaboration\n3. Mobile app',
      type: 'idea',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ])
  
  console.log('Mock content initialized')
}
