import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { UploadedImage } from '../App';
import { clsx } from 'clsx';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatInterfaceProps {
  uploadedImage: UploadedImage;
  onProcessingStart: () => void;
  onProcessingComplete: (processedUrl: string) => void;
}

const photoSuggestions = [
  "生成1寸证件照，白色背景",
  "生成2寸证件照，蓝色背景",
  "调整为标准证件照尺寸",
  "优化面部光线和对比度",
  "调整背景颜色为红色",
  "生成护照尺寸照片"
];

export const ChatInterface = ({
  uploadedImage,
  onProcessingStart,
  onProcessingComplete
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！我可以帮您生成专业的证件照。请告诉我您想要什么样的证件照效果，比如尺寸、背景颜色等。',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // 模拟AI处理时间
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    // 检查是否是生成证件照的请求
    const isPhotoGeneration = userMessage.includes('生成') ||
                             userMessage.includes('创建') ||
                             userMessage.includes('制作') ||
                             userMessage.includes('调整');

    if (isPhotoGeneration) {
      // 模拟图片处理
      onProcessingStart();

      // 延迟后返回处理结果
      setTimeout(() => {
        // 这里应该调用实际的图片处理API，现在用原始图片作为模拟结果
        onProcessingComplete(uploadedImage.url);
      }, 2000);

      return `正在为您生成证件照，请稍候... 我会根据您的要求"${userMessage}"来处理图片。`;
    }

    // 其他对话响应
    const responses = [
      "我明白了。让我为您调整图片的构图和光线。",
      "好的，我会优化图片的质量，让它更适合证件照使用。",
      "根据您的要求，我来调整图片的尺寸和比例。",
      "我来帮您美化一下这张照片，让它看起来更专业。",
      "明白了，我会按照您的要求处理这张图片。",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateResponse(content);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingMessage.id
            ? { ...msg, content: response, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content: '抱歉，处理过程中出现错误，请重试。',
                isLoading: false
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex-1 overflow-y-auto smooth-scrollbar max-h-96">
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
            {photoSuggestions.slice(0, 3).map((suggestion, index) => (
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
