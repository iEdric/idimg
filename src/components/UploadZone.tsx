import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { UploadedImage } from '../App';

interface UploadZoneProps {
  onImageUpload: (image: UploadedImage) => void;
}

export const UploadZone = ({ onImageUpload }: UploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件');
      return false;
    }

    // 检查文件大小 (限制为10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过10MB');
      return false;
    }

    setError(null);
    return true;
  };

  const processImage = useCallback((file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);

      // 获取图片原始尺寸
      const img = new Image();
      img.onload = () => {
        const uploadedImage: UploadedImage = {
          id: Date.now().toString(),
          file,
          url: result,
          originalSize: { width: img.width, height: img.height }
        };
        onImageUpload(uploadedImage);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

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
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-text-secondary text-sm">
              点击更换图片或拖拽新图片到此处
            </p>
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
