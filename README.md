# UniApp Vue 3 Social Messaging App

[![Vue](https://img.shields.io/badge/Vue-3.x-4fc08d?logo=vue.js)](https://vuejs.org/)
[![UniApp](https://img.shields.io/badge/UniApp-v3-2b9939?logo=dcloud)](https://uniapp.dcloud.net.cn/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

一个基于 Vue 3 + UniApp + Vite 构建的高颜值跨平台社交聊天应用。本项目采用现代化的 Glassmorphism（毛玻璃）设计风格，旨在提供丝滑的用户体验和极致的视觉享受。

## 视频演示

 [前往哔哩哔哩查看演示视频](https://b23.tv/RBErTXG)

## 🤖 AI 驱动开发 (AI-Driven Development)

本项目是基于 **Google DeepMind - Antigravity (Advanced Agentic Coding)** 技术栈，由人类开发者与 AI 协作深度定制而成。
- **UI 生成**：所有 Glassmorphism 样式及 CSS 矢量图标均由 AI 精准构建。
- **架构设计**：采用 AI 代理推荐的“卫语句 (Guard Clauses)”与“状态分发”模式。
- **跨平台适配**：针对微信小程序的特定 Bug，AI 提供了“绝对定位填充”等创新性补丁方案。

---

## 核心特性

- **跨平台极致适配**：一套代码完美适配 H5 和 **微信小程序**。针对小程序环境实现了“绝对定位填充”滚动方案，解决 Flex 布局高度塌陷问题。
- **现代化设计语言**：全量采用 **Glassmorphism (毛玻璃)** 与 **沉浸式 UI**。支持动态粒子背景、毛玻璃搜索框及半透明高阶模糊效果。
- **高阶列表交互**：
  - **优雅加载**：统一封装 `LoadingDots` 动效，实现与主流社交应用一致的丝滑刷新体验。
  - **朋友圈引擎**：支持按时间轴排序、下拉刷新（交互式动效）、上拉自动加载（分页逻辑）。
- **全套 Mock 闭环**：
  - **即时交互**：实现了发送动态自动回传通知、多级页面跳转及流畅的层级切换。

### 3. 标准化列表交互 (List Interaction Standard)
本项目在核心列表（消息列表、朋友圈）中实现了统一的交互规范，确保跨平台体验的一致性：
- **下拉同步 (Pull-to-Refresh)**：
  - 基于 `scroll-view` 的 `refresher` 扩展，配合自定义 `LoadingDots` 动效。
  - 针对不同场景提供语义化的刷新文案（如“正在发现”、“正在同步”）。
- **感应式触底加载 (Infinite Scroll)**：
  - 加载阈值统一设定为 `150px`，有效兼顾小程序和 H5 的响应灵敏度。
  - 集成 `try-finally` 卫语句，彻底解决异步请求导致的加载状态死锁问题。

### 4. 组件化架构 (Components Architecture)

| 组件名称 | 核心能力 | 技术亮点 |
| :--- | :--- | :--- |
| `MomentsFeed` | 动态 Feed 流容器 | 集成下拉刷新与无限滚动，支持多场景数据过滤与时间轴排序。 |
| `LoadingDots` | 多端兼容加载动效 | 轻量级 CSS 动画，支持 `pulsing` 状态受控，适配多种尺寸。 |
| `HeaderBar` | 沉浸式导航 | 智能避让系统状态栏，内置动态模糊搜索与毛玻璃滤镜。 |
| `CustomTabBar` | 导航底栏 | Glassmorphism 风格，支持多端路由跳转与激活态管理。 |
| `MomentItem` | 动态卡片组件 | 九宫格图片自适应排列，集成时间戳智能格式化。 |
| `ChatItem` | 消息项组件 | 支持侧滑交互（演示）、未读数标记与最后消息摘要。 |
| `CommonAvatar` | 通用头像 | 圆角自适应，内置占位逻辑与点击跳转。 |
| `CommonBadge` | 极简角标 | 数字自适应布局，强弱提示逻辑。 |
| `ProfileHeader` | 背景封面组件 | 沉浸式封面适配，支持动态高度偏移与模糊叠加。 |

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
