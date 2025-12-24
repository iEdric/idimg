import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { UploadedImage } from '../hooks/useAppState';
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

    await handleAsyncError(async () => {
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
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`
          upload-zone cursor-pointer transition-all duration-300 ease-in-out
          hover:scale-[1.02] hover:shadow-xl
          ${isDragOver ? 'drag-over ring-2 ring-primary ring-offset-2' : ''}
          ${isProcessing ? 'pointer-events-none' : ''}
        `}
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
          disabled={isProcessing}
        />

        {previewImage ? (
          <div className="space-y-6 animate-fade-in">
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <img
                src={previewImage}
                alt="Preview"
                className="relative max-w-full max-h-56 rounded-xl shadow-lg border border-border/50"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="
                  absolute -top-3 -right-3 w-8 h-8
                  bg-error text-white rounded-full
                  flex items-center justify-center
                  shadow-lg hover:shadow-xl
                  hover:bg-error/90 hover:scale-110
                  transition-all duration-200
                  opacity-0 group-hover:opacity-100
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center space-y-2">
              <p className="text-text-primary font-medium">
                图片已上传
              </p>
              <p className="text-text-secondary text-sm">
                点击更换图片或拖拽新图片到此处
              </p>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="space-y-6 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-text-primary">
                正在处理图片...
              </p>
              <p className="text-text-secondary text-sm">
                AI正在分析您的照片
              </p>
              <div className="w-full bg-surface rounded-full h-2 mt-4">
                <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full animate-pulse" style={{width: '60%'}} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="relative group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ImageIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="text-center space-y-3">
              <div>
                <p className="text-xl font-semibold text-text-primary mb-2">
                  上传您的照片
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  支持 JPG、PNG、WebP 格式，最大 10MB
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base font-medium">
                  <Upload className="w-5 h-5" />
                  选择图片
                </button>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-text-muted">
                    或拖拽图片到此处
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-error/20 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4 text-error" />
              </div>
              <p className="text-error text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
