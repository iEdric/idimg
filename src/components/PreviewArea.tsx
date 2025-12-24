import { RotateCcw, Download, Loader2 } from 'lucide-react';
import { UploadedImage } from '../App';

interface PreviewAreaProps {
  uploadedImage: UploadedImage;
  processedImage: string | null;
  isProcessing: boolean;
  onReset: () => void;
}

export const PreviewArea = ({
  uploadedImage,
  processedImage,
  isProcessing,
  onReset
}: PreviewAreaProps) => {
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
            {isProcessing ? '生成中...' : processedImage ? '证件照结果' : '等待处理'}
          </h3>
          <div className="relative bg-surface rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            {isProcessing ? (
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                <p className="text-text-secondary text-sm">正在生成证件照...</p>
              </div>
            ) : processedImage ? (
              <div className="space-y-4">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                />
                <div className="flex justify-center">
                  <button className="btn-primary inline-flex items-center gap-2">
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
