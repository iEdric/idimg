import { Camera, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-text-primary bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                AI证件照生成器
              </h1>
              <p className="text-sm text-text-secondary">智能生成专业证件照</p>
            </div>
            {/* 移动端简化显示 */}
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-text-primary">AI证件照</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-text-secondary bg-surface/50 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium hidden sm:inline">Powered by AI</span>
            <span className="text-xs font-medium sm:hidden">AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};
