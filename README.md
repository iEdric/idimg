# AI证件照生成器

一个基于AI的智能证件照生成工具，使用对话形式编辑图片，自动生成专业证件照。

## Features

- 🤖 **AI对话编辑** - 通过自然语言指令调整图片效果
- 📸 **智能生成** - 自动裁切和优化证件照
- 🎨 **多种样式** - 支持不同尺寸和背景颜色
- ⚡ **快速处理** - 实时预览和即时生成
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🎯 **专业品质** - 高分辨率输出，适合各种用途
- 🚀 **现代界面** - 简洁大气的设计风格

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆项目：
```bash
git clone <repository-url>
cd ai-id-photo-generator
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 在浏览器中打开 `http://localhost:3000`

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行ESLint代码检查

## 项目结构

```
src/
├── components/
│   ├── Header.tsx        # 页面头部
│   ├── UploadZone.tsx    # 图片上传区域
│   ├── PreviewArea.tsx   # 图片预览区域
│   ├── ChatInterface.tsx # AI对话界面
│   └── PhotoResult.tsx   # 结果展示区域
├── types/
│   └── chat.ts          # TypeScript类型定义
├── App.tsx              # 根组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 功能说明

### 🧠 AI智能处理

**人脸检测与验证**
- 自动检测图片中的人脸
- 验证照片是否只包含一个人
- 评估人脸清晰度和质量

**智能抠图**
- AI自动识别和分割人物
- 精确的边缘处理
- 保持自然光影效果

**证件照生成**
- 基于提示词的智能生成
- 支持多种尺寸和背景
- 专业的光线和风格调整

### 支持的证件照类型
- **1寸证件照** - 标准尺寸 (33×48mm)
- **2寸证件照** - 大尺寸 (35×49mm)
- **护照照片** - 国际标准 (35×45mm)
- **自定义尺寸** - 灵活调整

### AI对话指令示例
- "生成1寸证件照，白色背景"
- "调整为蓝色背景，优化面部光线"
- "生成护照尺寸，红色背景"
- "创建专业商务风格的证件照"

### API功能
- 人脸检测API (`/api/face-detection`)
- 人物抠图API (`/api/person-segmentation`)
- 证件照生成API (`/api/id-photo-generation`)
- "美化图片，调整对比度"

## 环境配置

### 环境变量
创建 `.env` 文件并配置以下变量：

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_API_KEY=your_api_key_here

# App Configuration
VITE_APP_NAME=AI证件照生成器
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_FACE_DETECTION=true
VITE_ENABLE_PERSON_SEGMENTATION=true
VITE_ENABLE_ID_PHOTO_GENERATION=true
```

### 后端API要求
需要实现以下API端点：

1. **POST** `/api/face-detection`
   - 请求: `{ image: "base64字符串" }`
   - 响应: `{ hasFace: boolean, faceCount: number, faces: [...] }`

2. **POST** `/api/person-segmentation`
   - 请求: `{ image: "base64字符串" }`
   - 响应: `{ mask: "base64", segmentedImage: "base64", processingTime: number }`

3. **POST** `/api/id-photo-generation`
   - 请求: `{ image: "base64", options: {...}, prompt: "提示词" }`
   - 响应: `{ image: "base64", size: {...}, format: "png", processingTime: number }`

## 自定义配置

### 颜色主题
颜色配置在 `tailwind.config.js` 中定义：

```javascript
colors: {
  'primary': '#2563eb',      // 主色调
  'background': '#ffffff',  // 背景色
  'surface': '#f8fafc',      // 表面色
  // ... 更多颜色
}
```

### API集成
当前使用模拟响应。要接入真实API：

1. 替换 `ChatInterface.tsx` 中的 `generateResponse` 函数
2. 添加图片处理API端点
3. 实现图片上传和处理逻辑

## 技术栈

- **React 18** - 现代React框架
- **TypeScript** - 类型安全的开发体验
- **Vite** - 下一代前端构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide React** - 精美的可定制图标
- **ESLint** - 代码检查和格式化

## 贡献指南

1. Fork 本项目
2. 创建功能分支
3. 提交更改
4. 运行测试和代码检查
5. 提交 Pull Request

## 许可证

MIT License - 查看 LICENSE 文件了解详情
