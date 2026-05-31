# 短视频趋势分析 / Video Trend Analytics

> B站热门视频排行榜 · 智能分类 · 数据可视化 · 一键导出报表

[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vite.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.14-409EFF?logo=element)](https://element-plus.org/)
[![ECharts](https://img.shields.io/badge/ECharts-6.1-AA344D)](https://echarts.apache.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?logo=greensock)](https://gsap.com/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org/)

---

## 目录

- [1. 项目目的](#1-项目目的)
- [2. 技术架构](#2-技术架构)
- [3. 功能设计](#3-功能设计)
- [4. 编译发布](#4-编译发布)
- [5. 效果展示](#5-效果展示)
- [6. 开发过程](#6-开发过程)
- [7. 挑战与解决方案](#7-挑战与解决方案)
- [8. 未来改进计划](#8-未来改进计划)

---

## 1. 项目目的

### 1.1 项目背景

在日常学习和生活中，我们经常浏览B站（Bilibili）的热门视频来获取热点信息和娱乐内容。然而，B站官方的热门排行榜**缺乏对视频内容的自动分类、多维度数据对比和一键数据导出能力**，用户难以快速了解不同内容类型的分布趋势和播放表现。

### 1.2 解决的问题

| 痛点 | 本项目解决方案 |
|------|---------------|
| 热门视频无法按类型分组统计 | 智能分类引擎：将B站20+分区自动归类为6大内容类别 |
| 视频数据缺乏可视化分析 | ECharts 交互图表：饼图 + 柱状图，直观呈现分类分布与播放对比 |
| 无法导出数据进行二次分析 | 一键导出 Excel：3 Sheet 完整报表（视频列表 / 分类分析 / 数据概览） |
| 排行榜数据时效性差 | 实时调用 B站官方 API，支持近7天 / 近30天筛选 |
| 界面单调、缺乏品质感 | Apple × Tesla × Ferrari 多品牌设计融合，双主题（白日/暗夜）可切换 |

### 1.3 应用场景

- **内容创作者**：分析热门视频的类型和趋势，辅助选题决策
- **数据分析爱好者**：快速获取结构化视频数据，进行二次分析
- **运营人员**：监控热门内容分布，了解平台内容生态
- **普通用户**：浏览排行榜，按分类筛选感兴趣的视频

### 1.4 创新点

1. **双主题设计系统**：基于 6 个国际顶级品牌（Apple、Tesla、Starbucks、Bugatti、Ferrari、Lamborghini）的设计基因，打造白日模式（清新专业）与暗夜模式（低调奢华）两套完整视觉方案
2. **GSAP 全链路动画**：从 Landing Page 入场 → 数据卡片数字滚动 → 图表渲染 → 主题切换图标变形，动画覆盖每一步用户操作
3. **智能分类引擎**：将 B站 20+ 原始分区映射为 6 大内容类别，支持多维度聚合统计
4. **零外部依赖的 Excel 导出**：使用 xlsx 库生成 3 Sheet 结构化报表，列宽自适应

---

## 2. 技术架构

### 2.1 技术栈

```
┌─────────────────────────────────────────────────────────┐
│                     用户界面层                            │
│   Vue 3 (Composition API)  ·  Element Plus  ·  ECharts   │
│   GSAP (动画)  ·  CSS Custom Properties (主题系统)         │
├─────────────────────────────────────────────────────────┤
│                     业务逻辑层                            │
│   视频分类引擎  ·  数据过滤排序  ·  Excel 导出             │
├─────────────────────────────────────────────────────────┤
│                     数据服务层                            │
│   Axios (HTTP)  ·  Bilibili API  ·  Express (生产服务)     │
├─────────────────────────────────────────────────────────┤
│                     构建部署层                            │
│   Vite 8 (构建)  ·  Node.js (运行)  ·  Git (版本管理)      │
└─────────────────────────────────────────────────────────┘
```

| 类别 | 技术 | 用途 |
|------|------|------|
| **前端框架** | Vue 3.5 (Composition API + `<script setup>`) | 组件化开发、响应式数据管理 |
| **构建工具** | Vite 8 | 开发服务器、生产构建 |
| **UI 组件库** | Element Plus 2.14 | Radio Button、Select、Table、Tag、Alert |
| **数据可视化** | ECharts 6.1 + vue-echarts | 饼图（分类分布）、柱状图（播放对比） |
| **动画引擎** | GSAP 3.15 | Landing Page 入场、数字滚动、图表过渡、主题切换动画 |
| **HTTP 客户端** | Axios 1.16 | 请求 B站 API、错误拦截 |
| **数据处理** | xlsx 0.18 | Excel 报表生成与导出 |
| **后端服务** | Express 4.21 | 生产环境 API 代理（CORS 解决） |
| **样式方案** | CSS Custom Properties | 双主题无缝切换、零 FOUC |
| **版本管理** | Git + Gitee | 代码版本控制 |

### 2.2 项目结构

```
video-stat/
├── index.html                    # 入口 HTML
├── package.json                  # 依赖与脚本配置
├── vite.config.js                # Vite 构建配置
├── server/
│   └── index.js                  # Express API 代理服务器
└── src/
    ├── main.js                   # 应用入口 · FOUC 防护 · Element Plus 注册
    ├── App.vue                   # 根组件 · Landing Page ↔ 主页切换
    ├── api/
    │   ├── request.js            # Axios 实例 · 拦截器 · 错误处理
    │   └── bilibili.js           # B站 API 封装 · 热门视频 / 视频详情
    ├── utils/
    │   ├── classifier.js         # 视频分类引擎 · 分区映射 · 聚合统计
    │   ├── date.js               # 数字格式化 · 日期工具
    │   └── excel.js              # Excel 报表生成 · 多 Sheet 导出
    ├── composables/
    │   └── useTheme.js           # 单例主题状态管理 · localStorage 持久化
    ├── styles/
    │   ├── tokens.css            # 设计 Token · 双主题变量 · 全局样式
    │   └── element-dark.css      # Element Plus 主题覆盖
    ├── views/
    │   ├── LandingPage.vue       # Landing Page · 品牌展示 · GSAP 入场动画
    │   └── Index.vue             # 功能主页 · 数据面板 · 筛选与图表
    └── components/
        ├── FilterPanel.vue       # 筛选面板 · 平台/时间/排序
        ├── SummaryCard.vue       # 数据摘要卡片 · 数字滚动动画
        ├── DataChart.vue         # ECharts 图表 · 饼图 + 柱状图
        ├── DataTable.vue         # 数据表格 · 排序 · 标签
        ├── ExportButton.vue      # Excel 导出按钮
        └── ThemeToggle.vue       # 主题切换按钮 · 太阳/月亮图标动画
```

### 2.3 主要模块划分

#### 数据服务模块 (`src/api/`)
- **request.js**：封装 Axios 实例，配置 baseURL、超时、请求/响应拦截器
- **bilibili.js**：调用 B站官方公开 API（热门视频列表、视频详情），数据格式化

#### 业务逻辑模块 (`src/utils/`)
- **classifier.js**：将 B站 20+ 原始分区归类为 6 大类别（游戏 / 影视娱乐 / 知识科技 / 生活 / 音乐舞蹈 / 动画），提供按类别聚合统计函数
- **excel.js**：使用 xlsx 库生成包含 3 个工作表的结构化 Excel 报表
- **date.js**：数字格式化（万/亿）、日期工具函数

#### 视图层 (`src/views/` + `src/components/`)
- **LandingPage.vue** → 品牌 Landing Page，几何线条 GSAP 入场动画
- **Index.vue** → 主功能页，组合所有组件
- **FilterPanel.vue** → 平台选择（B站）、时间范围（7天/30天）、排序方式
- **SummaryCard.vue** → 视频总数、总播放量、总点赞、平均互动、最热分类
- **DataChart.vue** → 饼图（类型分布）+ 柱状图（播放量对比），主题自适应
- **DataTable.vue** → 视频详情表格，Element Plus Table
- **ThemeToggle.vue** → 主题切换，GSAP 图标变形动画

#### 主题系统 (`src/composables/` + `src/styles/`)
- **useTheme.js** → 单例 composable，全局主题状态 + localStorage 持久化
- **tokens.css** → 100+ CSS 自定义属性，白日/暗夜双套完整色板
- **element-dark.css** → Element Plus 第三方组件库的完整主题覆盖

### 2.4 数据流向

```
B站 API (公开)
    │
    ▼
request.js (Axios + 拦截器)
    │
    ▼
bilibili.js (fetchPopularVideos)
    │
    ▼
classifier.js (classifyVideo → 归类)
    │
    ▼
filterByPeriod (7天 / 30天过滤)
    │
    ▼
Index.vue (videos[] → computed sortedVideos)
    │
    ├──→ SummaryCard.vue   (合计统计 + 数字动画)
    ├──→ DataChart.vue      (categoryStats → ECharts 图表)
    ├──→ DataTable.vue      (sortedVideos → 表格渲染)
    └──→ ExportButton.vue   (exportToExcel → xlsx 下载)
```

---

## 3. 功能设计

### 3.1 功能列表

| 序号 | 功能 | 说明 |
|------|------|------|
| 1 | 品牌 Landing Page | 几何线条动画、品牌标题入场、点击进入主页 |
| 2 | 热门视频获取 | 调用 B站官方 API，获取热门排行榜视频（约100条） |
| 3 | 智能分类 | 将原始分区自动归类为 6 大内容类别 |
| 4 | 时间筛选 | 支持近7天 / 近30天数据筛选 |
| 5 | 排序切换 | 支持按播放量 / 点赞量 / 评论量排序 |
| 6 | 数据摘要 | 5 张卡片展示核心指标，GSAP 数字滚动动画 |
| 7 | 分类分布图 | ECharts 环形饼图，展示各类别视频数量与占比 |
| 8 | 播放对比图 | ECharts 柱状图，各类别播放量 vs 点赞量对比 |
| 9 | 视频详情表 | Element Plus 表格，排序、标签展示 |
| 10 | Excel 导出 | 一键导出 3 Sheet 报表（视频列表/分类分析/数据概览） |
| 11 | 主题切换 | 白日模式 ↔ 暗夜模式，太阳/月亮图标变形动画 |
| 12 | 响应式布局 | 适配桌面端、平板、手机 |

### 3.2 核心功能说明

#### 3.2.1 智能视频分类引擎

B站官方将视频分为 20+ 个一级分区（动画、番剧、音乐、游戏、知识、科技等）。本项目的分类引擎将这些原始分区**聚合为 6 大内容类别**，使数据更易于理解和分析：

```
游戏       → 游戏
影视娱乐   → 娱乐 + 影视 + 电影 + 电视剧 + 番剧 + 国创
知识科技   → 知识 + 科技 + 纪录片
生活       → 生活 + 美食 + 时尚 + 运动 + 汽车 + 动物圈
音乐舞蹈   → 音乐 + 舞蹈
动画       → 动画 + 鬼畜
```

分类结果用于饼图展示、柱状图数据聚合和 Excel 分类分析报表。

#### 3.2.2 双主题设计系统

| 特性 | 白日模式 | 暗夜模式 |
|------|---------|---------|
| **设计基因** | Apple 纯白 + Tesla 减法 | Bugatti 克制 + Ferrari 暖黑 + Lamborghini 深渊 |
| **画布** | `#ffffff` (Apple 纯白) | `#0a0a0b` (暖黑微温) |
| **主色调** | `#4488f0` (Tesla Electric Blue) | `#b89764` (低调香槟金) |
| **表面阶梯** | `#f5f5f7` → `#fafafa` → `#eeeeee` | `#111113` → `#17181a` → `#1e1f22` (Bugatti 微步) |
| **文字** | `#1d1d1f` (Apple 深色体系) | `#e8e4df` (暖白体系) |
| **阴影** | Apple 极柔微影 | Ferrari 极克清单影 |
| **过渡** | Tesla 0.33s | Tesla 0.33s |
| **按钮圆角** | Starbucks 50px pill | Starbucks 50px pill |

#### 3.2.3 数据可视化

- **环形饼图**：展示 6 大类别视频数量分布，支持百分比标签
- **分组柱状图**：各类别播放量 vs 点赞量直观对比，圆角柱体
- **主题自适应**：图表颜色、Tooltip 背景、轴线颜色均根据当前主题自动切换

#### 3.2.4 Excel 报表导出

导出文件包含 3 个工作表：
1. **视频列表**：排名、标题、UP主、分区、分类、播放量、点赞、评论、弹幕、分享、发布时间、BV号
2. **分类分析**：类别、视频数量、总播放/点赞/评论/弹幕/分享、平均播放量、播放占比
3. **数据概览**：平台、时间范围、视频总数、总播放量、总点赞数、最热分类

### 3.3 交互设计

| 交互 | 实现方式 |
|------|---------|
| Landing Page 入场 | 几何线条拉伸 (scaleX) → 标题上浮 (y + autoAlpha) → 全部元素依次出现 |
| 进入主页过渡 | 元素下移淡出 → 主页淡入上浮 |
| 数字滚动 | GSAP 数值 tween，从 0 滚动到目标值（0.9s, power2.out） |
| 图表入场 | 卡片 staggered 淡入上浮 |
| 排序切换 | 表格行 re-stagger 动画 |
| 主题切换 | 太阳/月亮图标 120° 旋转 + 收缩淡出 → 反向旋转弹入 |
| 卡片 Hover | translateY(-2px) + 阴影增强 + 边框色过渡 |
| 按钮按压 | scale(0.94~0.97) 反馈 |

### 3.4 用户界面展示

**Landing Page（白日模式）**：
- 几何装饰线 + 品牌标题"短视频趋势分析" + 副标题 + "进入平台"按钮
- 背景：淡蓝色径向光晕

**功能主页**：
- 顶部 Header：标签行 + 标题 + 描述 + 主题切换按钮
- 筛选面板：平台选择（Radio）+ 时间范围（Radio）+ 排序方式（Select）+ 获取数据按钮
- 数据摘要：5 张统计卡片，最后一张为渐变色高亮
- 图表区：饼图 + 柱状图并排
- 数据详情：表格 + 导出按钮

---

## 4. 编译发布

### 4.1 环境要求

| 工具 | 版本要求 |
|------|---------|
| Node.js | ≥ 18.0 |
| npm | ≥ 9.0 |

### 4.2 安装步骤

```bash
# 1. 克隆仓库
git clone <your-gitee-repo-url>
cd final-work/video-stat

# 2. 安装依赖
npm install
```

### 4.3 运行方法

```bash
# 开发模式（Vite Dev Server，默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 启动 Express 生产服务器（API 代理 + 静态文件）
npm run server

# 一键构建 + 启动生产环境
npm start
```

### 4.4 构建部署

```bash
# 生产构建输出目录
dist/
├── index.html
└── assets/
    ├── index-*.css
    └── index-*.js
```

- **静态部署**：将 `dist/` 目录部署至任意静态文件服务器（Nginx、Apache、GitHub Pages）
- **Node.js 部署**：运行 `npm start` 启动 Express 服务器（含 API 代理）

---

## 5. 效果展示

### 5.1 功能截图

> 📸 *建议在此处插入以下截图：*
> 1. Landing Page（白日模式）
> 2. 功能主页·数据概览（白日模式）
> 3. 功能主页·图表区（暗夜模式）
> 4. Excel 导出文件预览
> 5. 主题切换动画过程

### 5.2 使用说明

1. **启动应用** → 进入 Landing Page，欣赏品牌动画
2. **点击"进入平台"** → 进入功能主页
3. **点击"获取数据"** → 拉取 B站热门视频数据（约 100 条）
4. **查看摘要卡片** → 数字自动滚动至实际值
5. **切换排序方式** → 表格数据重新排列
6. **点击"导出 Excel 报表"** → 浏览器自动下载结构化报表
7. **点击右上角 ☀️/🌙 图标** → 切换白日/暗夜模式

### 5.3 演示视频

> 🎥 *建议录制 2-3 分钟演示视频，展示完整操作流程*

### 5.4 在线演示

> 🌐 *部署后在此填写在线访问链接*

---

## 6. 开发过程

### 6.1 开发周期

| 阶段 | 内容 |
|------|------|
| **第10周** | 项目初始化、Gitee 仓库创建、技术选型 |
| **第11周** | 数据层搭建（Axios + B站 API）、分类引擎实现 |
| **第12周** | 组件开发（筛选面板、摘要卡片、图表、表格、导出） |
| **第13周** | Landing Page、主题系统、GSAP 动画、UI 打磨 |
| **第14周** | Bug 修复、暗夜模式重设计、README 文档 |

### 6.2 Git 提交历史（摘要）

```
5aadce6 解决了模式切换按钮消失的问题
4bde99e bug修复
037a635 美化
40204fc 优化
e706316 列表改进
0dc2af3 极限推进中
3d2861d 框架
d265c12 课程内容总结
0cc1342 记录
```

---

## 7. 挑战与解决方案

### 7.1 主题切换时 ECharts 图表不更新

**问题**：切换主题后，ECharts 图表颜色保持旧主题色板。

**解决**：将 `isDark` 作为 computed 属性，ECharts option 的所有颜色相关字段（title、tooltip、legend、series、axis）均基于 `isDark.value` 动态计算。Vue 的响应式系统自动触发图表重渲染。

### 7.2 主题切换按钮动画图标消失

**问题**：使用 `v-show` 控制两个 SVG 图标的显示/隐藏，GSAP timeline 中途调用 `toggleTheme()` 时，Vue 的响应式 DOM 更新与 GSAP 的 inline style 设置产生竞争条件，导致新图标未正确显示。

**解决**：移除 `v-show`，两个 SVG 图标始终渲染在 DOM 中并绝对定位叠放。改用 async/await 将动画拆分为独立的"离场→切换→入场"三阶段，GSAP 完全控制图标的 opacity/scale/rotate，避免与 Vue 响应式冲突。

### 7.3 页面加载时主题闪烁 (FOUC)

**问题**：页面加载时先显示默认主题（亮色），然后 JS 执行后才切换到保存的主题，产生闪烁。

**解决**：在 `main.js` 中，**在 Vue 应用挂载之前**同步读取 localStorage 并设置 `document.documentElement.setAttribute('data-theme', saved)`，确保浏览器在首帧渲染前就知道当前主题。

### 7.4 B站 API 跨域 (CORS)

**问题**：开发环境下直接请求 B站 API 遇到 CORS 限制。

**解决**：通过 Vite 开发服务器的 proxy 配置转发 API 请求。生产环境使用 Express 服务器代理。

### 7.5 Element Plus 黑色主题深度定制

**问题**：Element Plus 组件的默认样式在暗色背景下视觉效果差，且硬编码色值散落在各处。

**解决**：创建独立的 `element-dark.css`，将所有硬编码色值替换为 CSS 自定义属性引用（`var(--variable)`）。覆盖 Radio Button、Select、Table、Tag、Alert、Dropdown 等全部使用到的组件样式。

---

## 8. 未来改进计划

- [ ] 接入抖音开放平台 API，实现多平台数据对比
- [ ] 添加视频详情弹窗（封面、描述、标签、UP主信息）
- [ ] 增加时间趋势折线图（每日播放量变化）
- [ ] 支持自定义分类规则
- [ ] 添加数据缓存机制（IndexedDB），减少 API 请求
- [ ] 支持导出 PDF 报表
- [ ] 移动端 PWA 支持
- [ ] 国际化（i18n）支持

---

## 技术参考

- [B站 API 文档](https://github.com/SocialSisterYi/bilibili-API-collect)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vite 官方文档](https://vite.dev/)
- [Element Plus 官方文档](https://element-plus.org/)
- [ECharts 官方文档](https://echarts.apache.org/)
- [GSAP 官方文档](https://gsap.com/docs/)
- [设计基因参考](https://github.com/awesome-design-md/awesome-design-md)

---

**项目作者**：RUI
**开发时间**：2026年5月
**许可协议**：[MIT](LICENSE)
