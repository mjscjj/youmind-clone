import { Board, Content } from './types';

// Mock data switch
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || localStorage.getItem('useMockData') === 'true';

interface MockDatabase {
  boards: Board[];
  contents: Content[];
}

class MockDB implements MockDatabase {
  boards: Board[] = [
    {
      id: '1',
      title: '项目规划',
      description: '新项目的初步规划',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: '设计稿',
      description: 'UI设计草稿',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  contents: Content[] = [
    {
      id: '1',
      boardId: '1',
      title: '需求分析',
      content: '进行用户需求调研和分析',
      type: 'note',
      position: { x: 100, y: 100 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      boardId: '1',
      title: '技术选型',
      content: '选择合适的技术栈',
      type: 'note',
      position: { x: 300, y: 100 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  // Auto-increment ID counter
  private boardCounter = 3;
  private contentCounter = 3;

  getBoards(): Promise<Board[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.boards]), 200);
    });
  }

  getBoardById(id: string): Promise<Board | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.boards.find(board => board.id === id)), 200);
    });
  }

  createBoard(board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Promise<Board> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBoard: Board = {
          ...board,
          id: String(this.boardCounter++),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.boards.push(newBoard);
        resolve(newBoard);
      }, 200);
    });
  }

  updateBoard(id: string, updates: Partial<Board>): Promise<Board | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.boards.findIndex(board => board.id === id);
        if (index !== -1) {
          this.boards[index] = {
            ...this.boards[index],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          resolve(this.boards[index]);
        } else {
          resolve(undefined);
        }
      }, 200);
    });
  }

  deleteBoard(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.boards.length;
        this.boards = this.boards.filter(board => board.id !== id);
        resolve(this.boards.length < initialLength);
      }, 200);
    });
  }

  getContentsByBoardId(boardId: string): Promise<Content[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.contents.filter(content => content.boardId === boardId)), 200);
    });
  }

  getContentById(id: string): Promise<Content | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.contents.find(content => content.id === id)), 200);
    });
  }

  createContent(content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newContent: Content = {
          ...content,
          id: String(this.contentCounter++),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.contents.push(newContent);
        resolve(newContent);
      }, 200);
    });
  }

  updateContent(id: string, updates: Partial<Content>): Promise<Content | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.contents.findIndex(content => content.id === id);
        if (index !== -1) {
          this.contents[index] = {
            ...this.contents[index],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          resolve(this.contents[index]);
        } else {
          resolve(undefined);
        }
      }, 200);
    });
  }

  deleteContent(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.contents.length;
        this.contents = this.contents.filter(content => content.id !== id);
        resolve(this.contents.length < initialLength);
      }, 200);
    });
  }
}

export const mockDB = new MockDB();

// Mock API functions that mirror the real API
export const mockApi = {
  // Authentication
  login: async (credentials: { username: string; password: string }): Promise<{ token: string; user: any }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
      user: {
        id: '1',
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        name: credentials.username.charAt(0).toUpperCase() + credentials.username.slice(1)
      }
    };
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  // Board operations
  getBoards: async (): Promise<Board[]> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.getBoards();
  },

  getBoardById: async (id: string): Promise<Board | undefined> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.getBoardById(id);
  },

  createBoard: async (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Promise<Board> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.createBoard(board);
  },

  updateBoard: async (id: string, updates: Partial<Board>): Promise<Board | undefined> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.updateBoard(id, updates);
  },

  deleteBoard: async (id: string): Promise<boolean> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.deleteBoard(id);
  },

  // Content operations
  getContentsByBoardId: async (boardId: string): Promise<Content[]> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.getContentsByBoardId(boardId);
  },

  getContentById: async (id: string): Promise<Content | undefined> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.getContentById(id);
  },

  createContent: async (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.createContent(content);
  },

  updateContent: async (id: string, updates: Partial<Content>): Promise<Content | undefined> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.updateContent(id, updates);
  },

  deleteContent: async (id: string): Promise<boolean> => {
    if (!USE_MOCK_DATA) throw new Error('Mock data disabled');
    return mockDB.deleteContent(id);
  }
};

// Utility function to toggle mock data
export const setUseMockData = (use: boolean): void => {
  if (typeof window !== 'undefined') {
    if (use) {
      localStorage.setItem('useMockData', 'true');
    } else {
      localStorage.removeItem('useMockData');
    }
  }
};

export const getUseMockData = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('useMockData') === 'true';
  }
  return false;
};