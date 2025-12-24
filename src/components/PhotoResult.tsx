import { Download, RotateCcw, Share2, CheckCircle } from 'lucide-react';
import { PHOTO_SPECIFICATIONS } from '../constants';

interface PhotoResultProps {
  imageUrl: string;
  onDownload: () => void;
  onReset: () => void;
}

export const PhotoResult = ({ imageUrl, onDownload, onReset }: PhotoResultProps) => {
  return (
    <div className="mt-8 animate-fade-in">
      <div className="card max-w-4xl mx-auto shadow-xl border-2 border-success/20">
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-success/30 to-primary/30 rounded-2xl blur-xl animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3 bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
            🎉 证件照生成完成！
          </h2>
          <p className="text-text-secondary text-lg">
            您的专业证件照已经准备就绪，可以直接下载使用
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-success/20 via-primary/20 to-accent/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-surface to-surface-hover rounded-2xl p-8 border border-border/50 shadow-xl">
              <img
                src={imageUrl}
                alt="Generated ID Photo"
                className="max-w-full max-h-80 mx-auto rounded-xl shadow-lg border border-border/30"
              />
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  AI生成完成
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onDownload}
            className="btn-primary flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl"
          >
            <Download className="w-6 h-6" />
            下载证件照
          </button>

          <button
            onClick={() => {
              if (navigator.share && navigator.canShare?.({ url: imageUrl })) {
                navigator.share({
                  title: '我的AI证件照',
                  text: '使用AI智能生成的精美证件照',
                  url: imageUrl,
                }).catch(() => {
                  // 降级到复制链接
                  navigator.clipboard.writeText(imageUrl);
                });
              } else {
                // 降级方案：复制链接到剪贴板
                navigator.clipboard.writeText(imageUrl).then(() => {
                  // 可以添加一个提示消息
                });
              }
            }}
            className="btn-secondary flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
          >
            <Share2 className="w-5 h-5" />
            分享
          </button>

          <button
            onClick={onReset}
            className="btn-secondary flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 hover:bg-warning/5 hover:border-warning/30 transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            重新制作
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50">
          <h3 className="text-lg font-semibold text-text-primary text-center mb-6">证件照规格</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <div className="text-xl font-bold text-white">{PHOTO_SPECIFICATIONS.ratio}</div>
              </div>
              <div className="font-semibold text-text-primary">{PHOTO_SPECIFICATIONS.ratioLabel}</div>
              <div className="text-sm text-text-secondary mt-1">符合证件照要求</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-success to-success/80 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <div className="text-lg font-bold text-white">300</div>
              </div>
              <div className="font-semibold text-text-primary">{PHOTO_SPECIFICATIONS.dpiLabel}</div>
              <div className="text-sm text-text-secondary mt-1">DPI 专业品质</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <div className="text-lg font-bold text-white">{PHOTO_SPECIFICATIONS.format}</div>
              </div>
              <div className="font-semibold text-text-primary">{PHOTO_SPECIFICATIONS.formatLabel}</div>
              <div className="text-sm text-text-secondary mt-1">透明背景可选</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
