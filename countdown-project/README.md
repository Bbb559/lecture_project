# 倒计时前端页面 (Countdown Timer)

> 多 Agent 协作开发项目 | PM + Code + Review + Publish 流水线

---

## 项目简介

一款 60 秒倒计时交互式前端页面，采用前后端分离架构：

- **前端**：原生 HTML/CSS/JS，深色主题 + 发光数字效果
- **后端**：Python Flask API，提供倒计时状态管理
- **特性**：离线模式优雅降级、响应式适配、一键启动

---

## 快速开始

### 环境要求

- Python 3.8+
- 浏览器（Chrome / Firefox / Edge）

### 一键启动

```bash
cd countdown-project
bash start.sh
```

启动后访问：
- 前端页面：http://localhost:8080
- 后端 API：http://localhost:5000

### 手动启动

```bash
# 1. 安装后端依赖
pip install -r backend/requirements.txt

# 2. 启动后端 (终端1)
python3 backend/app.py

# 3. 启动前端 (终端2)
cd frontend && python3 -m http.server 8080
```

---

## 功能说明

| 功能 | 描述 |
|------|------|
| 倒计时 | 60 秒逐秒递减，归零自动停止 |
| 开始按钮 | 点击启动倒计时，运行中禁用以防重复点击 |
| 复位按钮 | 任意时刻恢复为 60 秒，清除定时器 |
| 进度条 | 实时显示倒计时进度百分比 |
| 归零动画 | 数字变红并闪烁，提示倒计时结束 |
| 后端状态 | 页面加载时检测后端连接，离线时自动降级 |
| 响应式 | 适配桌面端与移动端 (≤480px) |

---

## 项目结构

```
countdown-project/
├── README.md                  # 本文件
├── pm_task_list.md            # PM Agent 开发任务清单
├── code_review_report.md      # Code Review Agent 审查报告
├── start.sh                   # 一键启动脚本
├── backend/
│   ├── app.py                 # Flask 后端 API 服务
│   └── requirements.txt       # Python 依赖
└── frontend/
    ├── index.html             # 主页面
    ├── style.css              # 样式表
    └── script.js              # 交互逻辑
```

---

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/countdown/start` | 启动倒计时 |
| POST | `/api/countdown/reset` | 复位倒计时 |
| GET | `/api/countdown/status` | 查询当前状态 |

所有接口返回统一格式：`{"code": 200, "message": "...", "data": {...}}`

---

## 技术栈

- **前端**：HTML5 + CSS3 (Flexbox, CSS Variables, @keyframes) + JavaScript ES6
- **后端**：Python 3 + Flask + Flask-CORS
- **部署**：Bash 脚本一键启动，前后端独立进程

---

## 开发流水线

本项目由四个 AI Agent 协作完成：

| Agent | 职责 |
|-------|------|
| **PM Agent** | 需求拆解 → 开发任务清单 |
| **Code Agent** | 按清单编写全部代码 |
| **Code Review Agent** | 代码规范性审查 → 审查报告 |
| **Publish Agent** | 外网加速 → GitHub 发布 |

详见 `pm_task_list.md` 和 `code_review_report.md`。

---

## 许可证

MIT
