// 应用常量配置

export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
} as const;

export const PHOTO_SUGGESTIONS = [
  "生成1寸证件照，白色背景",
  "生成2寸证件照，蓝色背景",
  "调整为标准证件照尺寸",
  "优化面部光线和对比度",
  "调整背景颜色为红色",
  "生成护照尺寸照片"
] as const;

export const PHOTO_SPECIFICATIONS = {
  ratio: '1:1',
  dpi: '300 DPI',
  format: 'PNG',
  ratioLabel: '标准比例',
  dpiLabel: '高分辨率',
  formatLabel: '无损格式'
} as const;

export const API_CONFIG = {
  SIMULATION_DELAY_MIN: 1500,
  SIMULATION_DELAY_MAX: 2000,
  PROCESSING_DELAY: 2000,
  FACE_DETECTION_TIMEOUT: 10000,
  SEGMENTATION_TIMEOUT: 20000,
  GENERATION_TIMEOUT: 30000,
  MAX_RETRIES: 3
} as const;

export const UI_CONFIG = {
  MAX_MESSAGE_HEIGHT: 96,
  SCROLL_BEHAVIOR: 'smooth' as const,
  ANIMATION_DURATION: 200
} as const;
