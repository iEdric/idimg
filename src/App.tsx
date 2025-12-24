import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { PreviewArea } from './components/PreviewArea';
import { ChatInterface } from './components/ChatInterface';
import { PhotoResult } from './components/PhotoResult';
import { useAppState } from './hooks/useAppState';
import { usePhotoProcessing } from './hooks/usePhotoProcessing';
import { UploadedImage } from './hooks/useAppState';

function App() {
  const { state, actions } = useAppState();
  const { processPhoto } = usePhotoProcessing();

  const handleImageUpload = (image: UploadedImage) => {
    actions.setUploadedImage(image);
  };

  const handleImageProcess = (processedUrl: string) => {
    actions.setProcessedImage(processedUrl);
    actions.setProcessingStep('complete');
  };

  const handleProgressUpdate = (step: string, _progress: number) => {
    // 可以根据progress值设置不同的处理步骤
    if (step.includes('人脸')) {
      actions.setProcessingStep('face_detection');
    } else if (step.includes('抠取') || step.includes('分割')) {
      actions.setProcessingStep('segmentation');
    } else if (step.includes('生成')) {
      actions.setProcessingStep('generation');
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `id-photo-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!state.uploadedImage ? (
          // 初始上传状态
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <UploadZone onImageUpload={handleImageUpload} />
          </div>
        ) : state.processedImage ? (
          // 完成状态 - 只显示结果
          <div className="flex justify-center">
            <PhotoResult
              imageUrl={state.processedImage}
              onDownload={() => handleDownload(state.processedImage!)}
              onReset={actions.reset}
            />
          </div>
        ) : (
          // 处理状态 - 显示预览和聊天
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <PreviewArea
                uploadedImage={state.uploadedImage}
                processedImage={state.processedImage}
                isProcessing={state.isProcessing}
                processingStep={state.processingStep}
                onReset={actions.reset}
                onDownload={handleDownload}
              />
            </div>

            <div className="space-y-6">
              <ChatInterface
                uploadedImage={state.uploadedImage}
                onProcessingStart={() => actions.setProcessing(true)}
                onProcessingComplete={handleImageProcess}
                onProgressUpdate={handleProgressUpdate}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
export type { UploadedImage };
