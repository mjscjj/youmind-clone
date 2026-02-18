import { ref } from 'vue';
import type { Ref } from 'vue';

// API配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 认证相关类型定义
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

// 看板相关类型定义
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

// 内容相关类型定义
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

// 全局认证token
let authToken: string | null = null;

// 设置认证token
export const setAuthToken = (token: string) => {
  authToken = token;
};

// 获取请求头
const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// API错误处理
class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// 执行API请求的通用函数
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.text();
    throw new ApiError(errorData || `HTTP ${response.status}: ${response.statusText}`, response.status);
  }
  
  // 处理无内容响应的情况
  if (response.status === 204) {
    return undefined as unknown as T;
  }
  
  return response.json() as Promise<T>;
};

// 认证API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async (): Promise<void> => {
    return apiRequest<void>('/auth/logout', {
      method: 'POST',
    });
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      await apiRequest('/auth/verify', {
        method: 'GET',
      });
      return true;
    } catch (error) {
      return false;
    }
  },
};

// 看板API
export const boardAPI = {
  getAll: async (): Promise<Board[]> => {
    return apiRequest<Board[]>('/boards');
  },

  getById: async (id: string): Promise<Board> => {
    return apiRequest<Board>(`/boards/${id}`);
  },

  create: async (board: CreateBoardRequest): Promise<Board> => {
    return apiRequest<Board>('/boards', {
      method: 'POST',
      body: JSON.stringify(board),
    });
  },

  update: async (id: string, board: UpdateBoardRequest): Promise<Board> => {
    return apiRequest<Board>(`/boards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(board),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/boards/${id}`, {
      method: 'DELETE',
    });
  },
};

// 内容API
export const contentAPI = {
  getAllByBoard: async (boardId: string): Promise<Content[]> => {
    return apiRequest<Content[]>(`/boards/${boardId}/contents`);
  },

  getById: async (id: string): Promise<Content> => {
    return apiRequest<Content>(`/contents/${id}`);
  },

  create: async (content: CreateContentRequest): Promise<Content> => {
    return apiRequest<Content>('/contents', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  },

  update: async (id: string, content: UpdateContentRequest): Promise<Content> => {
    return apiRequest<Content>(`/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/contents/${id}`, {
      method: 'DELETE',
    });
  },
};

// Mock数据开关
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock数据存储
const mockData = {
  boards: [
    { id: '1', title: '我的第一个看板', description: '这是一个示例看板', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', title: '项目计划', description: '项目开发计划', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  contents: [
    { 
      id: '1', 
      boardId: '1', 
      title: '待办事项', 
      content: '完成项目设计', 
      type: 'task', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    },
    { 
      id: '2', 
      boardId: '1', 
      title: '想法记录', 
      content: '可以尝试新的技术方案', 
      type: 'idea', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    },
  ]
};

// Mock API实现
if (USE_MOCK_DATA) {
  console.log('使用Mock数据模式');
  
  // 重写API方法以使用mock数据
  boardAPI.getAll = async (): Promise<Board[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockData.boards), 300);
    });
  };

  boardAPI.getById = async (id: string): Promise<Board> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const board = mockData.boards.find(b => b.id === id);
        if (board) {
          resolve(board);
        } else {
          reject(new ApiError('Board not found', 404));
        }
      }, 300);
    });
  };

  boardAPI.create = async (board: CreateBoardRequest): Promise<Board> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newBoard: Board = {
          id: String(mockData.boards.length + 1),
          title: board.title,
          description: board.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockData.boards.push(newBoard);
        resolve(newBoard);
      }, 300);
    });
  };

  boardAPI.update = async (id: string, board: UpdateBoardRequest): Promise<Board> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockData.boards.findIndex(b => b.id === id);
        if (index !== -1) {
          mockData.boards[index] = {
            ...mockData.boards[index],
            ...board,
            updatedAt: new Date().toISOString()
          };
          resolve(mockData.boards[index]);
        } else {
          reject(new ApiError('Board not found', 404));
        }
      }, 300);
    });
  };

  boardAPI.delete = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockData.boards.findIndex(b => b.id === id);
        if (index !== -1) {
          mockData.boards.splice(index, 1);
          // 同时删除相关的contents
          mockData.contents = mockData.contents.filter(c => c.boardId !== id);
          resolve();
        } else {
          reject(new ApiError('Board not found', 404));
        }
      }, 300);
    });
  };

  contentAPI.getAllByBoard = async (boardId: string): Promise<Content[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const contents = mockData.contents.filter(c => c.boardId === boardId);
        resolve(contents);
      }, 300);
    });
  };

  contentAPI.getById = async (id: string): Promise<Content> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const content = mockData.contents.find(c => c.id === id);
        if (content) {
          resolve(content);
        } else {
          reject(new ApiError('Content not found', 404));
        }
      }, 300);
    });
  };

  contentAPI.create = async (content: CreateContentRequest): Promise<Content> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newContent: Content = {
          id: String(mockData.contents.length + 1),
          boardId: content.boardId,
          title: content.title,
          content: content.content,
          type: content.type,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockData.contents.push(newContent);
        resolve(newContent);
      }, 300);
    });
  };

  contentAPI.update = async (id: string, content: UpdateContentRequest): Promise<Content> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockData.contents.findIndex(c => c.id === id);
        if (index !== -1) {
          mockData.contents[index] = {
            ...mockData.contents[index],
            ...content,
            updatedAt: new Date().toISOString()
          };
          resolve(mockData.contents[index]);
        } else {
          reject(new ApiError('Content not found', 404));
        }
      }, 300);
    });
  };

  contentAPI.delete = async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockData.contents.findIndex(c => c.id === id);
        if (index !== -1) {
          mockData.contents.splice(index, 1);
          resolve();
        } else {
          reject(new ApiError('Content not found', 404));
        }
      }, 300);
    });
  };
}