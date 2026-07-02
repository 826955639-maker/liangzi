# 安徽省科技馆「量子探微馆」iPad 智慧导览 App 原型

这是一个使用 React + Vite 搭建的前端原型，面向 iPad 横屏展馆导览场景。项目使用本地 mock 数据，无后端依赖，覆盖首页推荐路线、模拟 3D 展厅地图、模拟扫码、展项交互展示、知识卡片和我的探索报告。

## 功能模块

- 首页：项目介绍、推荐路线、探索进度和快捷入口
- 3D 地图：模拟倾斜展厅地图、展区节点、推荐路线和展区信息卡
- 扫码探索：模拟扫码框和 5 个展项二维码入口
- 展项交互：波粒之争、薛定谔的猫、量子隧道、量子通信、合肥量子成果
- 知识卡片：展开多层解释、收藏知识点
- 我的报告：完成进度、收藏内容、徽章和分享卡片视觉

## 项目结构

```text
.
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ App.css
   ├─ data/
   │  └─ mockData.js
   ├─ components/
   │  ├─ Sidebar.jsx
   │  ├─ RouteCard.jsx
   │  ├─ ProgressPanel.jsx
   │  ├─ ZoneNode.jsx
   │  └─ KnowledgeCard.jsx
   └─ pages/
      ├─ Home.jsx
      ├─ MapPage.jsx
      ├─ ScanPage.jsx
      ├─ ExhibitPage.jsx
      ├─ KnowledgePage.jsx
      └─ ReportPage.jsx
```

## 运行方式

```bash
npm install
npm run dev
```

然后打开 Vite 输出的本地地址，默认是：

```text
http://127.0.0.1:5173/
```

## 构建

```bash
npm run build
```
