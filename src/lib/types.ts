export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardRequest {
  title: string;
  description?: string;
}

export interface UpdateBoardRequest {
  title?: string;
  description?: string;
}

export interface Content {
  id: string;
  boardId: string;
  title: string;
  content: string;
  type: 'note' | 'task' | 'idea';
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentRequest {
  boardId: string;
  title: string;
  content: string;
  type: 'note' | 'task' | 'idea';
}

export interface UpdateContentRequest {
  title?: string;
  content?: string;
  type?: 'note' | 'task' | 'idea';
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  category: 'research' | 'writing' | 'coding' | 'productivity';
}
