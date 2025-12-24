import {
  FaceDetectionResult,
  PersonSegmentationResult,
  IDPhotoGenerationOptions,
  IDPhotoGenerationResult,
  APIResponse,
  API_ENDPOINTS,
  APIConfig
} from '../types/api';
import { handleAsyncError, createErrorMessage, PhotoProcessingError } from '../utils/errorHandling';
import { config } from '../config';

class ApiService {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const requestId = crypto.randomUUID();

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        ...this.config.headers,
        ...options.headers,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new PhotoProcessingError(
          `API request failed: ${response.status} ${response.statusText}`,
          'API_ERROR',
          { status: response.status, endpoint }
        );
      }

      const data: APIResponse<T> = await response.json();

      if (!data.success) {
        throw new PhotoProcessingError(
          data.error?.message || 'API request failed',
          data.error?.code || 'API_ERROR',
          data.error?.details
        );
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof PhotoProcessingError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new PhotoProcessingError('Request timeout', 'TIMEOUT_ERROR');
      }

      throw new PhotoProcessingError(
        createErrorMessage(error),
        'NETWORK_ERROR',
        { endpoint, originalError: error }
      );
    }
  }

  /**
   * 人脸检测
   */
  async detectFaces(imageBase64: string): Promise<FaceDetectionResult> {
    const result = await handleAsyncError(async () => {
      const response = await this.makeRequest<FaceDetectionResult>(
        API_ENDPOINTS.FACE_DETECTION,
        {
          method: 'POST',
          body: JSON.stringify({
            image: imageBase64,
            minConfidence: 0.7,
            maxFaces: 10
          }),
        }
      );
      return response.data;
    });

    if (!result) {
      throw new PhotoProcessingError('Face detection failed', 'FACE_DETECTION_FAILED');
    }

    return result;
  }

  /**
   * 人物抠图
   */
  async segmentPerson(imageBase64: string): Promise<PersonSegmentationResult> {
    const result = await handleAsyncError(async () => {
      const response = await this.makeRequest<PersonSegmentationResult>(
        API_ENDPOINTS.PERSON_SEGMENTATION,
        {
          method: 'POST',
          body: JSON.stringify({
            image: imageBase64,
            model: 'deeplabv3', // 或其他抠图模型
            outputFormat: 'png'
          }),
        }
      );
      return response.data;
    });

    if (!result) {
      throw new PhotoProcessingError('Person segmentation failed', 'SEGMENTATION_FAILED');
    }

    return result;
  }

  /**
   * 生成证件照
   */
  async generateIDPhoto(
    segmentedImage: string,
    options: IDPhotoGenerationOptions,
    prompt?: string
  ): Promise<IDPhotoGenerationResult> {
    const result = await handleAsyncError(async () => {
      const requestBody = {
        image: segmentedImage,
        options,
        prompt: prompt || this.generateDefaultPrompt(options),
        enhanceQuality: true,
        removeBackground: true
      };

      const response = await this.makeRequest<IDPhotoGenerationResult>(
        API_ENDPOINTS.ID_PHOTO_GENERATION,
        {
          method: 'POST',
          body: JSON.stringify(requestBody),
        }
      );
      return response.data;
    });

    if (!result) {
      throw new PhotoProcessingError('ID photo generation failed', 'GENERATION_FAILED');
    }

    return result;
  }

  /**
   * 生成默认提示词
   */
  private generateDefaultPrompt(options: IDPhotoGenerationOptions): string {
    const sizeMap = {
      '1inch': '1寸',
      '2inch': '2寸',
      'passport': '护照',
      'custom': '自定义尺寸'
    };

    const lightingMap = {
      'natural': '自然光',
      'studio': '专业工作室灯光',
      'bright': '明亮均匀的光线'
    };

    const styleMap = {
      'professional': '商务专业风格',
      'casual': '休闲自然风格',
      'traditional': '传统正式风格'
    };

    const size = sizeMap[options.size];
    const lighting = lightingMap[options.lighting || 'studio'];
    const style = styleMap[options.style || 'professional'];

    return `生成${size}证件照，${style}，${lighting}，背景色为${options.backgroundColor}，高质量，清晰度高，适合官方使用`;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest(API_ENDPOINTS.HEALTH_CHECK);
      return true;
    } catch {
      return false;
    }
  }
}

// API配置
const apiConfig: APIConfig = {
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  retries: 3,
  headers: {
    'Authorization': `Bearer ${config.api.key}`,
    'X-Client-Version': config.app.version,
  },
};

// 创建单例实例
export const apiService = new ApiService(apiConfig);

// 导出类型和配置
export { apiConfig };
export default apiService;
