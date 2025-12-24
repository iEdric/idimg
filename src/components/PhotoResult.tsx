import { Download, RotateCcw, Share2, CheckCircle } from 'lucide-react';

interface PhotoResultProps {
  imageUrl: string;
  onDownload: () => void;
  onReset: () => void;
}

export const PhotoResult = ({ imageUrl, onDownload, onReset }: PhotoResultProps) => {
  return (
    <div className="mt-8">
      <div className="card max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            证件照生成完成！
          </h2>
          <p className="text-text-secondary">
            您的专业证件照已经准备就绪
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-surface rounded-lg p-4">
            <img
              src={imageUrl}
              alt="Generated ID Photo"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onDownload}
            className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            下载证件照
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: '我的证件照',
                  text: '使用AI生成的证件照',
                  url: imageUrl,
                });
              }
            }}
            className="btn-secondary flex-1 inline-flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            分享
          </button>

          <button
            onClick={onReset}
            className="btn-secondary flex-1 inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重新制作
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">1:1</div>
              <div className="text-sm text-text-secondary">标准比例</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">300 DPI</div>
              <div className="text-sm text-text-secondary">高分辨率</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">PNG</div>
              <div className="text-sm text-text-secondary">无损格式</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
