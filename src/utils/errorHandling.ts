/**
 * 错误处理工具函数
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export class PhotoProcessingError extends Error {
  constructor(
    message: string,
    public code: string = 'PROCESSING_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'PhotoProcessingError';
  }
}

export class FileValidationError extends Error {
  constructor(
    message: string,
    public code: string = 'VALIDATION_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'FileValidationError';
  }
}

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  errorHandler?: (error: Error) => void
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    if (errorHandler) {
      errorHandler(err);
    } else {
      console.error('Async operation failed:', err);
    }

    return null;
  }
};

export const createErrorMessage = (error: unknown): string => {
  if (error instanceof PhotoProcessingError || error instanceof FileValidationError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '发生未知错误，请重试';
};

export const logError = (error: unknown, context?: string) => {
  const errorMessage = createErrorMessage(error);
  const logMessage = context ? `${context}: ${errorMessage}` : errorMessage;

  console.error(logMessage, error);
};
