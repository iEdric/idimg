import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { UploadedImage } from '../App';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useFileValidation } from '../hooks/useFileValidation';
import { handleAsyncError, createErrorMessage } from '../utils/errorHandling';

interface UploadZoneProps {
  onImageUpload: (image: UploadedImage) => void;
}

export const UploadZone = ({ onImageUpload }: UploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { processImageFile } = useImageProcessing();
  const { validateImageFile } = useFileValidation();

  // 清理资源
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const processImage = useCallback(async (file: File) => {
    setError(null);
    setIsProcessing(true);

    const result = await handleAsyncError(async () => {
      // 先验证文件
      const validation = await validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error || '文件验证失败');
      }

      // 处理图片文件
      const processedData = await processImageFile(file);

      setPreviewImage(processedData.url);

      const uploadedImage: UploadedImage = {
        id: processedData.id,
        file,
        url: processedData.url,
        originalSize: processedData.size
      };

      onImageUpload(uploadedImage);
    }, (error) => {
      setError(createErrorMessage(error));
    });

    setIsProcessing(false);
  }, [processImageFile, validateImageFile, onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processImage(files[0]);
    }
  }, [processImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImage(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`upload-zone cursor-pointer ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {previewImage ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg shadow-sm"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center hover:bg-error/80 transition-colors"
                disabled={isProcessing}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-text-secondary text-sm">
              点击更换图片或拖拽新图片到此处
            </p>
          </div>
        ) : isProcessing ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-lg font-medium text-text-primary mb-2">
                正在处理图片...
              </p>
              <p className="text-text-secondary text-sm">
                请稍候
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-text-primary mb-2">
                上传您的照片
              </p>
              <p className="text-text-secondary text-sm">
                支持 JPG、PNG、WebP 格式，最大 10MB
              </p>
            </div>
            <div className="btn-primary inline-flex items-center gap-2">
              <Upload className="w-4 h-4" />
              选择图片
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
