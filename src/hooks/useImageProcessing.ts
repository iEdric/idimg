import { useCallback } from 'react';

export interface ImageSize {
  width: number;
  height: number;
}

export interface ProcessedImageData {
  url: string;
  size: ImageSize;
  format: string;
  createdAt: Date;
}

/**
 * 自定义Hook：处理图片上传和预处理
 */
export const useImageProcessing = () => {
  const loadImage = useCallback((src: string): Promise<ImageSize> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = src;
    });
  }, []);

  const readFileAsDataURL = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }, []);

  const processImageFile = useCallback(async (file: File) => {
    try {
      const dataUrl = await readFileAsDataURL(file);
      const size = await loadImage(dataUrl);

      return {
        file,
        url: dataUrl,
        size,
        id: Date.now().toString()
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '图片处理失败');
    }
  }, [loadImage, readFileAsDataURL]);

  return {
    processImageFile,
    loadImage,
    readFileAsDataURL
  };
};
