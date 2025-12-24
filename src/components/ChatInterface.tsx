import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { UploadedImage } from '../App';
import { PHOTO_SUGGESTIONS, API_CONFIG, UI_CONFIG } from '../constants';
import { useChatMessages } from '../hooks/useChatMessages';
import { usePhotoProcessing } from '../hooks/usePhotoProcessing';
import { clsx } from 'clsx';

interface ChatInterfaceProps {
  uploadedImage: UploadedImage;
  onProcessingStart: () => void;
  onProcessingComplete: (processedUrl: string) => void;
  onProgressUpdate?: (step: string, progress: number) => void;
}

export const ChatInterface = ({
  uploadedImage,
  onProcessingStart,
  onProcessingComplete,
  onProgressUpdate
}: ChatInterfaceProps) => {
  const { processPhoto, parseInstruction } = usePhotoProcessing();
  const initialMessage = {
    content: '您好！我可以帮您生成专业的证件照。请告诉我您想要什么样的证件照效果，比如尺寸、背景颜色等。',
    role: 'assistant' as const,
  };

  const {
    messages,
    addMessage,
    updateMessage,
    isLoading,
    setIsLoading
  } = useChatMessages([initialMessage]);

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = useCallback(async (userMessage: string): Promise<string> => {
    // 检查是否是生成证件照的请求
    const isPhotoGeneration = /\b(生成|创建|制作|调整)\b/.test(userMessage);

    if (isPhotoGeneration) {
      try {
        onProcessingStart();

        // 解析用户指令
        const options = parseInstruction(userMessage);

        // 执行完整的照片处理流程
        const result = await processPhoto(
          uploadedImage,
          options,
          userMessage,
          onProgressUpdate
        );

        // 完成处理
        onProcessingComplete(result.finalImage);

        return `证件照生成完成！我根据您的要求"${userMessage}"生成了专业的证件照。图片已优化处理，适合官方使用。`;

      } catch (error) {
        console.error('Photo processing failed:', error);
        throw error; // 让外层错误处理机制处理
      }
    }

    // 其他对话响应
    const responses = [
      "我明白了。让我为您调整图片的构图和光线。",
      "好的，我会优化图片的质量，让它更适合证件照使用。",
      "根据您的要求，我来调整图片的尺寸和比例。",
      "我来帮您美化一下这张照片，让它看起来更专业。",
      "明白了，我会按照您的要求处理这张图片。",
    ] as const;

    // 模拟响应延迟
    const delay = API_CONFIG.SIMULATION_DELAY_MIN +
                  Math.random() * (API_CONFIG.SIMULATION_DELAY_MAX - API_CONFIG.SIMULATION_DELAY_MIN);
    await new Promise(resolve => setTimeout(resolve, delay));

    return responses[Math.floor(Math.random() * responses.length)];
  }, [uploadedImage, parseInstruction, processPhoto, onProcessingStart, onProcessingComplete, onProgressUpdate]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 添加用户消息
    addMessage({
      content: content.trim(),
      role: 'user',
    });

    // 添加加载中的助手消息
    const loadingMessageId = `loading-${Date.now()}`;
    addMessage({
      content: '',
      role: 'assistant',
      isLoading: true,
    });

    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateResponse(content);
      updateMessage(loadingMessageId, {
        content: response,
        isLoading: false
      });
    } catch (error) {
      updateMessage(loadingMessageId, {
        content: '抱歉，处理过程中出现错误，请重试。',
        isLoading: false
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage, generateResponse, updateMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">AI 助手</h2>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto smooth-scrollbar" style={{ maxHeight: UI_CONFIG.MAX_MESSAGE_HEIGHT + 'rem' }}>
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className={clsx(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border'
              )}>
                {message.role === 'user' ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} className="text-text-secondary" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-text-secondary text-sm">正在思考...</span>
                  </div>
                ) : (
                  <div className="text-text-primary leading-relaxed">
                    {message.content}
                  </div>
                )}
                <div className="text-xs text-text-muted mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 建议按钮 */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-2">快捷指令：</p>
          <div className="grid grid-cols-1 gap-2">
            {PHOTO_SUGGESTIONS.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left p-2 rounded-lg bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors text-sm"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="描述您想要的证件照效果..."
            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading}
            className={clsx(
              'px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
              inputMessage.trim() && !isLoading
                ? 'bg-primary hover:bg-primary-dark text-white'
                : 'bg-surface text-text-muted cursor-not-allowed'
            )}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-text-muted mt-2">
          按 Enter 发送消息，描述您想要的证件照效果
        </p>
      </div>
    </div>
  );
};
