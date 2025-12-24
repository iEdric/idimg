export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface SendMessageParams {
  content: string;
  onSuccess?: (response: string) => void;
  onError?: (error: string) => void;
}

// 新增的类型定义
export interface ProcessingOptions {
  size: '1inch' | '2inch' | 'passport' | 'custom';
  backgroundColor: string;
  format: 'png' | 'jpg';
  quality: number;
}

export interface ProcessedImage {
  url: string;
  size: { width: number; height: number };
  format: string;
  createdAt: Date;
}
