// 应用配置
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    key: import.meta.env.VITE_API_KEY || '',
    timeout: 30000,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'AI证件照生成器',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  features: {
    enableFaceDetection: import.meta.env.VITE_ENABLE_FACE_DETECTION !== 'false',
    enablePersonSegmentation: import.meta.env.VITE_ENABLE_PERSON_SEGMENTATION !== 'false',
    enableIDPhotoGeneration: import.meta.env.VITE_ENABLE_ID_PHOTO_GENERATION !== 'false',
  },
} as const;
