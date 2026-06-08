#!/bin/bash
# ============================================
# 倒计时项目 — 一键启动脚本
# 启动 Python 后端 + 前端静态服务
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cleanup() {
    echo -e "\n${YELLOW}[清理] 正在关闭服务...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null && echo "  ✓ 后端已关闭"
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null && echo "  ✓ 前端已关闭"
    fi
    echo -e "${GREEN}已退出。${NC}"
}
trap cleanup EXIT INT TERM

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  倒计时应用 — 启动中...${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. 安装 Python 依赖
echo -e "\n${YELLOW}[1/3] 安装后端依赖...${NC}"
pip install -r "$BACKEND_DIR/requirements.txt" -q
echo -e "${GREEN}  ✓ 依赖安装完成${NC}"

# 2. 启动 Flask 后端
echo -e "\n${YELLOW}[2/3] 启动后端服务 (端口 5000)...${NC}"
python3 "$BACKEND_DIR/app.py" &
BACKEND_PID=$!
sleep 1

if kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo -e "${GREEN}  ✓ 后端已启动 (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}  ✗ 后端启动失败${NC}"
    exit 1
fi

# 3. 启动前端静态服务
echo -e "\n${YELLOW}[3/3] 启动前端服务 (端口 8080)...${NC}"
cd "$FRONTEND_DIR"
python3 -m http.server 8080 &
FRONTEND_PID=$!
sleep 1

if kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo -e "${GREEN}  ✓ 前端已启动 (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}  ✗ 前端启动失败${NC}"
    exit 1
fi

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  服务已就绪！${NC}"
echo -e "${GREEN}  前端页面: http://localhost:8080${NC}"
echo -e "${GREEN}  后端 API: http://localhost:5000${NC}"
echo -e "${GREEN}  按 Ctrl+C 停止所有服务${NC}"
echo -e "${GREEN}========================================${NC}"

# 等待任一子进程退出
wait
