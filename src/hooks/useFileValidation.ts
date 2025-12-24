import { useCallback } from 'react';
import { FILE_CONFIG } from '../constants';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 自定义Hook：文件验证
 */
export const useFileValidation = () => {
  const validateFile = useCallback((file: File): FileValidationResult => {
    // 检查文件类型
    if (!FILE_CONFIG.ACCEPTED_TYPES.includes(file.type as any)) {
      return {
        isValid: false,
        error: `不支持的文件格式。请上传以下格式：${FILE_CONFIG.ACCEPTED_EXTENSIONS.join('、')}`
      };
    }

    // 检查文件大小
    if (file.size > FILE_CONFIG.MAX_SIZE) {
      const maxSizeMB = FILE_CONFIG.MAX_SIZE / (1024 * 1024);
      return {
        isValid: false,
        error: `文件大小超过限制。最大支持 ${maxSizeMB}MB`
      };
    }

    // 检查文件名长度
    if (file.name.length > 255) {
      return {
        isValid: false,
        error: '文件名过长，请重命名文件'
      };
    }

    return { isValid: true };
  }, []);

  const validateImageFile = useCallback(async (file: File): Promise<FileValidationResult> => {
    const basicValidation = validateFile(file);
    if (!basicValidation.isValid) {
      return basicValidation;
    }

    // 尝试加载图片以验证完整性
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('图片文件损坏或格式不正确'));
        img.src = URL.createObjectURL(file);

        // 设置超时
        setTimeout(() => reject(new Error('图片加载超时')), 5000);
      });
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : '图片验证失败'
      };
    }

    return { isValid: true };
  }, [validateFile]);

  return {
    validateFile,
    validateImageFile
  };
};
