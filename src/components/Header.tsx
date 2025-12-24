import { Camera, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">AI证件照生成器</h1>
              <p className="text-sm text-text-secondary">智能生成专业证件照</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-text-secondary">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Powered by AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};
