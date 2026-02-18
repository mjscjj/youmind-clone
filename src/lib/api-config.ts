// api-config.ts
import { mockEnabled } from './lib/mock';

export interface ApiConfig {
  baseUrl: string;
  mockEnabled: boolean;
}

const config: ApiConfig = {
  baseUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  mockEnabled: mockEnabled // 从mock.ts导入的变量
};

export default config;