export interface Board {
  id: string
  name: string
  icon: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface ContentItem {
  id: string
  boardId: string
  type: 'note' | 'link' | 'file'
  title: string
  content?: string
  url?: string
  fileName?: string
  fileSize?: number
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  thinking?: string
  thinkingTime?: number
  timestamp: Date
}

export interface Skill {
  id: string
  name: string
  description: string
  icon: string
  command: string
}
