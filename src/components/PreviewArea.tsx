import { RotateCcw, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadedImage } from '../App';
import { ProcessingStep } from '../hooks/useAppState';

interface PreviewAreaProps {
  uploadedImage: UploadedImage;
  processedImage: string | null;
  isProcessing: boolean;
  processingStep: ProcessingStep;
  onReset: () => void;
  onDownload?: (imageUrl: string) => void;
}

export const PreviewArea = ({
  uploadedImage,
  processedImage,
  isProcessing,
  processingStep,
  onReset,
  onDownload
}: PreviewAreaProps) => {
  const handleDownload = () => {
    if (processedImage && onDownload) {
      onDownload(processedImage);
    }
  };

  const getStepMessage = (step: ProcessingStep): string => {
    switch (step) {
      case 'face_detection':
        return '正在检测人脸...';
      case 'validation':
        return '正在验证照片...';
      case 'segmentation':
        return '正在抠取人物...';
      case 'generation':
        return '正在生成证件照...';
      case 'complete':
        return '处理完成！';
      default:
        return '正在处理...';
    }
  };

  const getStepIcon = (step: ProcessingStep) => {
    switch (step) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'validation':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      default:
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    }
  };
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">图片预览</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          重新上传
        </button>
      </div>

      <div className="space-y-4">
        {/* 原始图片 */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2">原始照片</h3>
          <div className="relative bg-surface rounded-lg p-4">
            <img
              src={uploadedImage.url}
              alt="Original"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
            />
            <div className="mt-2 text-xs text-text-muted text-center">
              {uploadedImage.originalSize.width} × {uploadedImage.originalSize.height} px
            </div>
          </div>
        </div>

        {/* 处理后的图片 */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2">
            {isProcessing ? getStepMessage(processingStep) : processedImage ? '证件照结果' : '等待处理'}
          </h3>
          <div className="relative bg-surface rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            {isProcessing ? (
              <div className="text-center space-y-3">
                {getStepIcon(processingStep)}
                <div>
                  <p className="text-text-primary font-medium">{getStepMessage(processingStep)}</p>
                  <p className="text-text-secondary text-sm mt-1">请耐心等待，AI正在处理您的照片</p>
                </div>
              </div>
            ) : processedImage ? (
              <div className="space-y-4">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    下载证件照
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-text-muted">
                <p>请在右侧对话框中描述您想要的证件照效果</p>
                <p className="text-sm mt-1">例如："生成1寸证件照，蓝色背景"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
