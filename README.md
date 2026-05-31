# 短视频趋势分析

> 获取 B站热门视频，自动分类，可视化对比，一键导出 Excel

[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org/)

---

## 1. 这是什么项目

### 1.1 背景

B站的热门排行榜按综合热度排序，但它不做三件事：

- 不把视频按内容类型分类
- 不提供不同类别之间的数据对比
- 不允许导出数据做进一步分析

这个项目解决的就是这三个问题。

### 1.2 它做了什么

| 原来的问题 | 这个项目怎么解决 |
|-----------|----------------|
| 排行榜混在一起，看不出类型分布 | 把 B站 20+ 个分区归为 6 个大类，分别统计 |
| 只有排名，没有对比 | 用饼图看分布，用柱状图对比各类别的播放量和点赞量 |
| 数据拿不出来 | 一键导出 Excel，包含视频明细、分类汇总和概览三个 Sheet |
| 过了时间的数据找不到 | 支持按近 7 天 / 近 30 天筛选，调用 B站公开 API 实时获取 |
| 界面像工具页，不像产品 | 做了两套配色（白日/暗夜），可一键切换 |

### 1.3 谁适合用

- **内容创作者**：看哪个类型的视频最近流量好，辅助选题
- **运营**：快速了解平台上不同内容类型的表现
- **普通用户**：按分类浏览热门视频，不用自己在排行榜里翻

### 1.4 和类似项目的区别

1. 内置了分类引擎，不需要手动打标签
2. 图表配色跟随主题自动切换
3. Landing Page 到数据面板的过渡有完整动画链路
4. Excel 导出不是简单的 CSV，是三 Sheet 的结构化报表

---

## 2. 技术方案

### 2.1 用了什么

| 类别 | 选型 | 用它做什么 |
|------|------|-----------|
| 前端框架 | Vue 3.5 (Composition API) | 组件化，所有状态用 ref/computed 管理 |
| 构建 | Vite 8 | 开发和打包 |
| UI 库 | Element Plus 2.14 | 单选组、下拉框、表格、标签、提示 |
| 图表 | ECharts 6.1 + vue-echarts | 饼图、柱状图，option 随主题变化 |
| 动画 | GSAP 3.15 | 页面入场、数字滚动、图标变形 |
| HTTP | Axios 1.16 | 调 B站 API，统一错误处理 |
| Excel | xlsx 0.18 | 前端直接生成 xlsx 文件下载 |
| 样式 | CSS Custom Properties | 主题变量一把切，不用重新编译 |
| 后端 | Express 4.21 | 生产环境代理 API 请求 |

### 2.2 代码怎么组织的

```
video-stat/
├── index.html
├── package.json
├── vite.config.js
├── server/
│   └── index.js              # 生产环境 Express
└── src/
    ├── main.js               # 入口，挂载前同步设主题防闪烁
    ├── App.vue               # 根组件，控制 Landing Page ↔ 主页切换
    ├── api/
    │   ├── request.js         # Axios 实例 + 拦截器
    │   └── bilibili.js        # B站 API：热门列表、视频详情
    ├── utils/
    │   ├── classifier.js      # 分类引擎：分区→大类映射 + 聚合统计
    │   ├── date.js            # 数字格式化
    │   └── excel.js           # 生成三 Sheet Excel 并下载
    ├── composables/
    │   └── useTheme.js        # 主题状态单例，localStorage 持久化
    ├── styles/
    │   ├── tokens.css         # 100+ 个 CSS 变量，两套色值
    │   └── element-dark.css   # Element Plus 的主题适配
    ├── views/
    │   ├── LandingPage.vue    # 首屏品牌页
    │   └── Index.vue          # 功能主页
    └── components/
        ├── FilterPanel.vue    # 筛选：平台、时间、排序
        ├── SummaryCard.vue    # 统计卡片 + 数字滚动
        ├── DataChart.vue      # 饼图 + 柱状图
        ├── DataTable.vue      # 视频明细表
        ├── ExportButton.vue   # 导出按钮
        └── ThemeToggle.vue    # 主题切换按钮
```

### 2.3 数据怎么流动

```
B站公开 API
  → Axios 请求（统一拦截错误）
    → 格式化视频数据（字段映射）
      → 分类引擎归类（tid → tname → 大类）
        → 按时间范围过滤（7天/30天）
          → Index.vue 持有 videos[] 和 categoryStats[]
            ├── SummaryCard：汇总 5 个指标，数字从 0 滚到实际值
            ├── DataChart：categoryStats 喂给 ECharts
            ├── DataTable：排序后的 videos 渲染表格
            └── ExportButton：videos + stats 拼成 xlsx 下载
```

---

## 3. 功能介绍

### 3.1 全部功能

1. **Landing Page** — 几何线条动画入场，点击进入主页
2. **获取数据** — 调 B站热门 API，拉取约 100 条视频
3. **自动分类** — 20+ 分区归为 6 个大类
4. **时间筛选** — 近 7 天 / 近 30 天
5. **排序切换** — 按播放量 / 点赞量 / 评论量
6. **统计卡片** — 视频总数、总播放、总点赞、平均互动、最热分类，数字滚动展示
7. **饼图** — 各分类的视频数量分布
8. **柱状图** — 各分类的播放量和点赞量对比
9. **数据表格** — 排序、标签、悬停高亮
10. **导出 Excel** — 三个 Sheet：视频列表、分类分析、数据概览
11. **主题切换** — 白日/暗夜，图标有变形动画
12. **响应式** — 桌面、平板、手机都能用

### 3.2 分类器怎么工作

B站的视频分区有 20 多个。分类器把它们归为 6 组：

```
游戏       → 游戏
影视娱乐   → 娱乐 + 影视 + 电影 + 电视剧 + 番剧 + 国创
知识科技   → 知识 + 科技 + 纪录片
生活       → 生活 + 美食 + 时尚 + 运动 + 汽车 + 动物圈
音乐舞蹈   → 音乐 + 舞蹈
动画       → 动画 + 鬼畜
```

归完类之后，按类统计数量、播放量、点赞、评论、弹幕、分享。这些数据同时用于图表渲染和 Excel 导出。

### 3.3 两种配色

| 维度 | 白日模式 | 暗夜模式 |
|------|---------|---------|
| 底色 | `#ffffff` | `#0a0a0b` |
| 主色 | `#4488f0` | `#b89764` |
| 表面层次 | `#f5f5f7` / `#fafafa` / `#eeeeee` | `#111113` / `#17181a` / `#1e1f22` |
| 文字 | `#1d1d1f` 体系 | `#e8e4df` 体系 |
| 阴影 | 单层柔影 | 极克制，靠亮度区分层级 |
| 参考 | Apple, Tesla, Starbucks | Bugatti, Ferrari, Lamborghini |

主题状态存在 localStorage，刷新不丢。页面加载时在 Vue 挂载之前就设好 `data-theme` 属性，不会闪一下。

### 3.4 导出的是什么

导出的 Excel 文件包含三个工作表：

**Sheet 1 — 视频列表**：排名、标题、UP 主、分区、分类、播放量、点赞、评论、弹幕、分享、发布时间、BV 号

**Sheet 2 — 分类分析**：类别名称、视频数量、各项指标合计、平均播放量、播放占比

**Sheet 3 — 数据概览**：平台、时间范围、视频总数、总播放量、总点赞、最热分类

### 3.5 动画做了什么

| 位置 | 效果 |
|------|------|
| Landing Page 入场 | 三条横线拉伸 → 标题从下浮上 → 按钮出现 |
| 进入主页 | Landing Page 元素收走 → 主页淡入 |
| 数据加载后 | 卡片和图表依次浮入 |
| 统计数字 | 从 0 滚动到实际值，0.9 秒 |
| 切换排序 | 表格行重新排列时有过渡 |
| 切换主题 | 图标旋转 120° 缩小淡出 → 反向旋转弹入 |

---

## 4. 怎么跑起来

### 4.1 环境

- Node.js ≥ 18
- npm ≥ 9

### 4.2 安装和运行

```bash
# 克隆
git clone <仓库地址>
cd final-work/video-stat

# 装依赖
npm install

# 开发
npm run dev          # 默认 http://localhost:5173

# 生产构建
npm run build        # 输出到 dist/

# 生产运行（Express 代理 + 静态文件）
npm start
```

### 4.3 部署

`dist/` 目录是纯静态文件，放到任何 Web 服务器即可。如果需要 API 代理，用 `npm start` 启动 Express。

---

## 5. 效果

### 5.1 截图

> 准备以下截图插入此处：
> 1. Landing Page
> 2. 功能主页（有数据状态）
> 3. 图表区特写
> 4. 暗夜模式整体效果
> 5. 导出的 Excel 文件预览

### 5.2 操作步骤

1. 打开 → 看到 Landing Page
2. 点"进入平台" → 到功能页
3. 点"获取数据" → 等约 1-2 秒，数据和图表出来
4. 切换时间范围或排序方式 → 数据刷新
5. 点"导出 Excel 报表" → 浏览器下载文件
6. 点右上角 ☀️/🌙 → 切换配色

### 5.3 演示视频

> 录制 2-3 分钟的操作演示

### 5.4 在线地址

> 部署后填写 URL

---

## 6. 开发过程

### 6.1 时间线

| 周次 | 做了什么 |
|------|---------|
| 第 10 周 | 建仓库，定技术方案 |
| 第 11 周 | 搭数据层：Axios 封装、B站 API 对接、分类引擎 |
| 第 12 周 | 写组件：筛选、统计卡片、图表、表格、导出 |
| 第 13 周 | Landing Page、主题系统、GSAP 动画 |
| 第 14 周 | 修 Bug、暗夜模式改色、写文档 |

### 6.2 提交记录

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

## 7. 遇到的问题和解决方式

### 7.1 切主题后图表颜色不变

ECharts 的 option 是在组件初始化时算好的，主题切换不会自动重算。

**处理**：把所有颜色相关的字段（标题色、tooltip 背景、轴线颜色、系列色）都写进 computed，依赖 `isDark` 这个 ref。主题一变，computed 重新求值，图表自动刷新。

### 7.2 主题切换按钮的图标会消失

原来是 `v-show` 控制两个 SVG 图标的显示，GSAP 在 timeline 中途调 `toggleTheme()` 切换主题。Vue 的 `v-show` 更新和 GSAP 的 inline style 设置有时序冲突，新图标没显示出来。

**处理**：去掉 `v-show`。两个图标一直挂在 DOM 里，绝对定位叠在一起。用 async/await 把动画拆成三步：先把当前图标转出去 → 切主题 → 把新图标转进来。全程用 GSAP 控制 opacity 和 scale，不依赖 Vue 切换。

### 7.3 页面刷新时闪一下默认主题

页面加载时先渲染默认亮色，然后 JS 读了 localStorage 才切到暗色。

**处理**：在 `main.js` 里，`createApp()` 之前同步读 localStorage，直接设 `document.documentElement.setAttribute('data-theme', ...)`。浏览器首帧渲染时已经知道当前主题。

### 7.4 开发环境请求 B站 API 跨域

**处理**：Vite 开发服务器配 proxy，把 `/x` 路径的请求转发到 B站域名。生产环境用 Express 做同样的代理。

### 7.5 Element Plus 在暗色下很违和

Element Plus 的默认样式是给亮色背景设计的，放到暗色下要么太亮要么看不清。而且很多色值是硬编码的。

**处理**：单独写了一个 `element-dark.css`，把所有硬编码颜色换成 CSS 变量引用。覆盖了 Radio Button、Select、Table、Tag、Alert、Dropdown 这些用到的组件。

---

## 8. 还可以做什么

- [ ] 接入抖音 API，做多平台对比
- [ ] 加上每日播放量变化的折线图，看趋势
- [ ] 点击视频行弹出详情（封面、描述、UP 主信息）
- [ ] 允许用户自定义分类规则
- [ ] 用 IndexedDB 缓存数据，减少重复请求
- [ ] 适配移动端 PWA
- [ ] PDF 导出

---

## 参考

- [B站非官方 API 文档](https://github.com/SocialSisterYi/bilibili-API-collect)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://vite.dev/)
- [Element Plus 文档](https://element-plus.org/)
- [ECharts 文档](https://echarts.apache.org/)
- [GSAP 文档](https://gsap.com/docs/)
- [各品牌设计基因](https://github.com/awesome-design-md/awesome-design-md)
