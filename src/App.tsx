import { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { PreviewArea } from './components/PreviewArea';
import { ChatInterface } from './components/ChatInterface';
import { PhotoResult } from './components/PhotoResult';

export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  originalSize: { width: number; height: number };
}

function App() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setProcessedImage(null);
  };

  const handleImageProcess = (processedUrl: string) => {
    setProcessedImage(processedUrl);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!uploadedImage ? (
          // 初始上传状态
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <UploadZone onImageUpload={handleImageUpload} />
          </div>
        ) : (
          // 已上传图片状态
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <PreviewArea
                uploadedImage={uploadedImage}
                processedImage={processedImage}
                isProcessing={isProcessing}
                onReset={handleReset}
              />
            </div>

            <div className="space-y-6">
              <ChatInterface
                uploadedImage={uploadedImage}
                onProcessingStart={() => setIsProcessing(true)}
                onProcessingComplete={handleImageProcess}
              />
            </div>
          </div>
        )}

        {processedImage && (
          <PhotoResult
            imageUrl={processedImage}
            onDownload={() => {
              const link = document.createElement('a');
              link.href = processedImage;
              link.download = 'id-photo.png';
              link.click();
            }}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

export default App;
