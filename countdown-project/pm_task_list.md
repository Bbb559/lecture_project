# 倒计时前端页面 — 开发任务清单

> **PM Agent 产出** | 目标：开发一款带 60 秒倒计时功能的交互式前端页面

---

## 项目概述

开发一个单页面倒计时应用，采用 **前后端分离架构**：
- **前端**：Node.js (原生 HTML/CSS/JS，无需框架)
- **后端**：Python (Flask/FastAPI，提供 API 接口)
- **通信方式**：前端通过 REST API 与后端交互

---

## 任务拆解

### 任务 1：Python 后端 API 服务

**文件**：`backend/app.py`

**功能描述**：
- 使用 Python Flask 框架搭建轻量级后端服务
- 提供 `/api/countdown/start` 接口：接收前端请求，返回当前服务端时间戳作为倒计时起点
- 提供 `/api/countdown/reset` 接口：重置倒计时状态，返回初始值 60
- 提供 `/api/health` 健康检查接口
- 配置 CORS 跨域支持，允许前端跨域请求
- 监听 `0.0.0.0:5000` 端口

**关键实现细节**：
- 倒计时核心逻辑放在前端，后端只做状态记录与验证
- 后端维护一个全局倒计时状态（剩余秒数、是否运行中），线程安全
- 使用 Flask-CORS 处理跨域
- 返回 JSON 格式数据，包含 `code`、`message`、`data` 字段

---

### 任务 2：前端倒计时页面

**文件**：`frontend/index.html`

**功能描述**：
- 纯 HTML/CSS/JS 单页面实现，无需额外框架
- 页面布局：居中显示，包含以下元素：
  - 大号数字显示屏，展示当前倒计时秒数（初始显示 60）
  - 「开始」按钮：点击后启动 60 秒倒计时，逐秒递减至 0
  - 「复位」按钮：点击后停止倒计时，秒数恢复为 60
- 样式设计：现代化 UI，深色背景 + 发光数字效果

**关键实现细节**：
- 使用 `setInterval` 实现每秒递减，精确到秒
- 开始按钮点击后，按钮置灰（防止重复点击），倒计时归零后自动恢复
- 倒计时运行中，复位按钮仍然可用
- 倒计时归零时，数字显示改为红色闪烁效果提示
- 响应式设计，适配移动端和桌面端
- 页面加载时调用后端 `/api/health` 验证后端连接状态
- 开始/复位时同步调用后端 API 记录状态

---

### 任务 3：前端样式表

**文件**：`frontend/style.css`

**功能描述**：
- 独立 CSS 文件，定义完整页面样式
- 深色主题配色（背景色 `#1a1a2e`，主色调 `#e94560`）
- 数字使用大号字体（8rem+），发光效果（`text-shadow` + `box-shadow`）
- 按钮采用圆角设计，带 hover 过渡动画
- 倒计时归零状态下的红色闪烁动画（`@keyframes blink`）

**关键实现细节**：
- 使用 CSS 变量定义主题色，便于后续换肤
- 按钮 `transition` 过渡 0.3s
- 使用 Flexbox 居中布局
- 响应式媒体查询：`@media (max-width: 480px)` 调整字体和间距

---

### 任务 4：前端交互逻辑

**文件**：`frontend/script.js`

**功能描述**：
- 独立 JavaScript 文件，处理所有交互逻辑
- 倒计时核心引擎：
  - `startCountdown()`：启动倒计时，每秒递减，到达 0 自动停止
  - `resetCountdown()`：复位到 60，清除定时器
  - `updateDisplay(seconds)`：更新数字显示和样式状态
- 后端 API 调用：
  - `callBackendStart()`：调用 `/api/countdown/start`
  - `callBackendReset()`：调用 `/api/countdown/reset`
  - `checkBackendHealth()`：页面加载时健康检查
- 按钮状态管理：防止重复点击开始

**关键实现细节**：
- 使用 `let` 声明倒计时变量和定时器 ID
- 定时器清理：在复位和新开始前，先 `clearInterval` 清除旧定时器
- API 调用使用 `fetch` + `async/await`，带错误处理
- 后端不可用时，前端仍可独立工作（优雅降级）
- 到达 0 时添加 CSS class 触发闪烁动画

---

### 任务 5：项目依赖与启动配置

**文件**：`backend/requirements.txt`、`start.sh`

**功能描述**：
- `requirements.txt`：Python 后端依赖清单（`flask`、`flask-cors`）
- `start.sh`：一键启动脚本，安装依赖并同时启动前后端
- 前端使用 Python 内置 HTTP Server 或 Node.js `http-server` 托管静态文件

**关键实现细节**：
- `start.sh` 脚本包含：
  1. 安装 Python 依赖（`pip install -r backend/requirements.txt`）
  2. 后台启动 Flask 后端
  3. 前台启动前端静态文件服务（`python3 -m http.server 8080` 在 `frontend/` 目录）
  4. 优雅退出时清理后台进程

---

## 文件结构总览

```
countdown-project/
├── pm_task_list.md          # 本文件
├── start.sh                 # 一键启动脚本
├── backend/
│   ├── app.py               # Flask 后端 API
│   └── requirements.txt     # Python 依赖
└── frontend/
    ├── index.html           # 主页面
    ├── style.css            # 样式表
    └── script.js            # 交互逻辑
```

---

## 验收标准

- [x] 页面正常加载，显示初始倒计时 60 秒
- [x] 点击「开始」按钮，倒计时从 60 逐秒递减至 0
- [x] 倒计时归零后自动停止，数字变红闪烁
- [x] 运行中点击「复位」按钮，倒计时恢复为 60
- [x] 点击「开始」后再次点击「开始」不会重复启动
- [x] 后端 API 正常响应
- [x] 移动端适配正常
