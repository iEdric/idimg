// API相关类型定义

export interface FaceDetectionResult {
  hasFace: boolean;
  faceCount: number;
  faces: Array<{
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    confidence: number;
    landmarks?: Array<{
      x: number;
      y: number;
      type: string;
    }>;
  }>;
  processingTime: number;
}

export interface PersonSegmentationResult {
  mask: string; // base64 encoded mask
  originalImage: string; // base64 encoded original
  segmentedImage: string; // base64 encoded result
  processingTime: number;
}

export interface IDPhotoGenerationOptions {
  size: '1inch' | '2inch' | 'passport' | 'custom';
  backgroundColor: string;
  format: 'png' | 'jpg';
  quality: number;
  padding?: number;
  lighting?: 'natural' | 'studio' | 'bright';
  style?: 'professional' | 'casual' | 'traditional';
}

export interface IDPhotoGenerationResult {
  image: string; // base64 encoded result
  size: { width: number; height: number };
  format: string;
  processingTime: number;
  prompt: string; // used prompt for generation
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  requestId: string;
  timestamp: number;
}

export interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

// API端点定义
export const API_ENDPOINTS = {
  FACE_DETECTION: '/api/face-detection',
  PERSON_SEGMENTATION: '/api/person-segmentation',
  ID_PHOTO_GENERATION: '/api/id-photo-generation',
  HEALTH_CHECK: '/api/health'
} as const;
