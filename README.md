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

### 支持的证件照类型
- **1寸证件照** - 标准尺寸 (33×48mm)
- **2寸证件照** - 大尺寸 (35×49mm)
- **护照照片** - 国际标准 (35×45mm)
- **自定义尺寸** - 灵活调整

### AI对话指令示例
- "生成1寸证件照，白色背景"
- "调整为蓝色背景，优化面部光线"
- "生成护照尺寸，红色背景"
- "美化图片，调整对比度"

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
