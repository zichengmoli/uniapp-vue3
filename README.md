# UniApp Vue 3 Social Messaging App

[![Vue](https://img.shields.io/badge/Vue-3.x-4fc08d?logo=vue.js)](https://vuejs.org/)
[![UniApp](https://img.shields.io/badge/UniApp-v3-2b9939?logo=dcloud)](https://uniapp.dcloud.net.cn/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

一个基于 Vue 3 + UniApp + Vite 构建的高颜值跨平台社交聊天应用。本项目采用现代化的 Glassmorphism（毛玻璃）设计风格，旨在提供丝滑的用户体验和极致的视觉享受。

## 视频演示

 [前往哔哩哔哩查看演示视频](https://b23.tv/t9zWqud)

---

## 核心特性

- **跨平台支持**：一套代码完美适配 H5 和 微信小程序。
- **精美 UI**：精心设计的毛玻璃质感、细腻的动画和流畅的交互。
- **即时通讯体验**：
  - **消息列表**：支持未读计数、在线状态显示。
  - **聊天详情**：支持文本消息、表情键盘自适应弹出及丝滑滚动。
- **联系人管理**：拼音首字母排序列表、详细资料页。
- **个人中心**：个人资料展示、背景图装饰、资料编辑功能。
- **认证系统**：完整的登录与注册流程，适配多种移动端场景。
- **全套 Mock 系统**：内置基于 Vue 3 Reactive 的模拟数据，无需后端即可运行。

## 技术栈

- **框架**: [Vue 3 (Composition API)](https://vuejs.org/)
- **跨平台工具**: [UniApp](https://uniapp.dcloud.net.cn/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **样式**: CSS (Vanilla) + SCSS (UniApp 内置支持)
- **国际化**: Vue I18n
- **数据管理**: Vue 3 Reactive & Mock Data System

## 📂 项目结构

```text
weixa/vue3
├── src
│   ├── pages            # 页面组件
│   │   ├── login        # 登录、注册页
│   │   ├── index        # 消息中心 (首页)
│   │   ├── contact      # 联系人列表及详情
│   │   ├── chat         # 聊天详情对话页
│   │   └── mine         # 个人中心及资料编辑
│   ├── components       # 通用公共组件
│   ├── mock             # 核心 Mock 数据源 (Single Source of Truth)
│   ├── static           # 静态资源 (图片、图标等)
│   ├── utils            # 工具函数 (格式化、导航等)
│   ├── App.vue          # 应用入口与全局样式
│   ├── main.js          # Vue 初始化配置
│   ├── pages.json       # 页面路由与窗口配置
│   └── manifest.json    # 应用多端配置
├── vite.config.js       # Vite 配置文件
└── package.json         # 项目依赖与运行脚本
```

## 快速开始

### 1. 环境准备

确保您的本地环境已安装 Node.js (推荐 v18+)。

### 2. 安装依赖

```bash
npm install
```

### 3. 运行开发服务器

您可以根据目标平台运行对应的命令：

#### 运行到 H5 (浏览器)
```bash
npm run dev:h5
```

#### 运行到 微信小程序
```bash
npm run dev:mp-weixin
```
> **提示**: 运行小程序后，请使用微信开发者工具导入 dist/dev/mp-weixin 目录。

### 4. 构建发布

```bash
# 构建 H5 版本
npm run build:h5

# 构建 微信小程序版本
npm run build:mp-weixin
```

## 贡献与反馈

如果您觉得这个项目有帮助，欢迎给一个 Star！如果有任何问题或建议，欢迎提交 Issues 或 Pull Request。

---

*Made with ❤️ by [Your Name/Github]*
