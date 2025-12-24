import { RotateCcw, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadedImage } from '../hooks/useAppState';
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
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-1">图片预览</h2>
          <p className="text-sm text-text-secondary">查看您的原始照片和处理结果</p>
        </div>
        <button
          onClick={onReset}
          className="
            flex items-center gap-2 px-4 py-2
            text-text-secondary hover:text-text-primary
            bg-surface hover:bg-surface-hover
            rounded-lg transition-all duration-200
            text-sm font-medium
            hover:shadow-sm
          "
        >
          <RotateCcw className="w-4 h-4" />
          重新上传
        </button>
      </div>

      <div className="space-y-6">
        {/* 原始图片 */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            原始照片
          </h3>
          <div className="relative bg-gradient-to-br from-surface to-surface-hover rounded-xl p-6 border border-border/50">
            <div className="relative group">
              <img
                src={uploadedImage.url}
                alt="Original"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-md border border-border/30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface/80 backdrop-blur-sm rounded-full text-xs text-text-secondary">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                {uploadedImage.originalSize.width} × {uploadedImage.originalSize.height} px
              </div>
            </div>
          </div>
        </div>

        {/* 处理后的图片 */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isProcessing ? 'bg-warning animate-pulse' :
              processedImage ? 'bg-success' : 'bg-text-muted'
            }`}></div>
            {isProcessing ? getStepMessage(processingStep) : processedImage ? '证件照结果' : '等待处理'}
          </h3>
          <div className="relative bg-gradient-to-br from-surface to-surface-hover rounded-xl p-6 min-h-[280px] flex items-center justify-center border border-border/50">
            {isProcessing ? (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="relative">
                  {getStepIcon(processingStep)}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-text-primary font-semibold text-lg">{getStepMessage(processingStep)}</p>
                  <p className="text-text-secondary text-sm">AI正在智能处理您的照片，请稍候...</p>
                  <div className="w-full bg-surface/50 rounded-full h-2 mt-4">
                    <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full animate-pulse"
                         style={{width: processingStep === 'face_detection' ? '25%' :
                                       processingStep === 'segmentation' ? '50%' :
                                       processingStep === 'generation' ? '75%' : '10%'}} />
                  </div>
                </div>
              </div>
            ) : processedImage ? (
              <div className="space-y-6 animate-fade-in">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-success/20 to-primary/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="relative max-w-full max-h-64 mx-auto rounded-lg shadow-lg border border-border/30"
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Download className="w-5 h-5" />
                    下载证件照
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-surface/50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-text-muted/30 border-dashed rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-text-primary font-medium">准备生成证件照</p>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
                    请在右侧对话框中描述您想要的证件照效果
                    <br />
                    <span className="text-primary font-medium">例如："生成1寸证件照，蓝色背景"</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
