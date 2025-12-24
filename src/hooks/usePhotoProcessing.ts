import { useCallback } from 'react';
import apiService from '../services/apiService';
import { IDPhotoGenerationOptions, FaceDetectionResult, PersonSegmentationResult } from '../types/api';
import { UploadedImage } from './useAppState';
import { handleAsyncError, createErrorMessage } from '../utils/errorHandling';

/**
 * 自定义Hook：处理完整的照片处理流程
 */
export const usePhotoProcessing = () => {

  /**
   * 检测人脸并验证是否只有一个人
   */
  const validateFace = useCallback(async (imageBase64: string): Promise<FaceDetectionResult> => {
    const result = await handleAsyncError(async () => {
      const detectionResult = await apiService.detectFaces(imageBase64);

      // 验证人脸检测结果
      if (!detectionResult.hasFace) {
        throw new Error('未检测到人脸，请上传包含清晰人脸的照片');
      }

      if (detectionResult.faceCount === 0) {
        throw new Error('未检测到人脸，请确保照片中有人物');
      }

      if (detectionResult.faceCount > 1) {
        throw new Error('检测到多张人脸，请上传只包含一个人的照片');
      }

      // 检查人脸置信度
      const mainFace = detectionResult.faces[0];
      if (mainFace.confidence < 0.7) {
        throw new Error('人脸检测置信度较低，请上传更清晰的照片');
      }

      return detectionResult;
    });

    if (!result) {
      throw new Error('人脸检测失败');
    }

    return result;
  }, []);

  /**
   * 抠取人物
   */
  const segmentPerson = useCallback(async (imageBase64: string): Promise<PersonSegmentationResult> => {
    const result = await handleAsyncError(async () => {
      return await apiService.segmentPerson(imageBase64);
    });

    if (!result) {
      throw new Error('人物抠图失败');
    }

    return result;
  }, []);

  /**
   * 生成证件照
   */
  const generateIDPhoto = useCallback(async (
    segmentedImage: string,
    options: IDPhotoGenerationOptions,
    prompt?: string
  ) => {
    const result = await handleAsyncError(async () => {
      return await apiService.generateIDPhoto(segmentedImage, options, prompt);
    });

    if (!result) {
      throw new Error('证件照生成失败');
    }

    return result;
  }, []);

  /**
   * 完整的照片处理流程
   */
  const processPhoto = useCallback(async (
    uploadedImage: UploadedImage,
    options: IDPhotoGenerationOptions,
    prompt?: string,
    onProgress?: (step: string, progress: number) => void
  ) => {
    try {
      // 步骤1: 人脸检测
      onProgress?.('正在检测人脸...', 10);
      const faceResult = await validateFace(uploadedImage.url.split(',')[1]); // 移除data:image/...前缀

      onProgress?.('人脸检测完成，正在抠取人物...', 30);

      // 步骤2: 人物抠图
      const segmentationResult = await segmentPerson(uploadedImage.url.split(',')[1]);

      onProgress?.('人物抠取完成，正在生成证件照...', 60);

      // 步骤3: 生成证件照
      const generationResult = await generateIDPhoto(
        segmentationResult.segmentedImage,
        options,
        prompt
      );

      onProgress?.('证件照生成完成！', 100);

      return {
        faceResult,
        segmentationResult,
        generationResult,
        finalImage: `data:image/${generationResult.format};base64,${generationResult.image}`
      };

    } catch (error) {
      const errorMessage = createErrorMessage(error);
      throw new Error(errorMessage);
    }
  }, [validateFace, segmentPerson, generateIDPhoto]);

  /**
   * 解析用户指令生成配置
   */
  const parseInstruction = useCallback((instruction: string): IDPhotoGenerationOptions => {
    const options: IDPhotoGenerationOptions = {
      size: '1inch',
      backgroundColor: '#ffffff',
      format: 'png',
      quality: 95,
      padding: 0.1,
      lighting: 'studio',
      style: 'professional'
    };

    // 解析尺寸
    if (instruction.includes('2寸') || instruction.includes('二寸')) {
      options.size = '2inch';
    } else if (instruction.includes('护照') || instruction.includes('passport')) {
      options.size = 'passport';
    }

    // 解析背景颜色
    if (instruction.includes('蓝色') || instruction.includes('blue')) {
      options.backgroundColor = '#1e40af';
    } else if (instruction.includes('红色') || instruction.includes('red')) {
      options.backgroundColor = '#dc2626';
    } else if (instruction.includes('白色') || instruction.includes('white')) {
      options.backgroundColor = '#ffffff';
    } else if (instruction.includes('黑色') || instruction.includes('black')) {
      options.backgroundColor = '#000000';
    }

    // 解析风格
    if (instruction.includes('休闲') || instruction.includes('casual')) {
      options.style = 'casual';
    } else if (instruction.includes('传统') || instruction.includes('traditional')) {
      options.style = 'traditional';
    }

    // 解析光线
    if (instruction.includes('自然') || instruction.includes('natural')) {
      options.lighting = 'natural';
    } else if (instruction.includes('明亮') || instruction.includes('bright')) {
      options.lighting = 'bright';
    }

    return options;
  }, []);

  return {
    validateFace,
    segmentPerson,
    generateIDPhoto,
    processPhoto,
    parseInstruction
  };
};
