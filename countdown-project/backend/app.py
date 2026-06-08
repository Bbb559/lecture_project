"""
倒计时后端 API 服务
使用 Flask 框架，提供倒计时状态管理接口
"""
from flask import Flask, jsonify
from flask_cors import CORS
import threading
import time

app = Flask(__name__)
CORS(app)

# 全局倒计时状态（线程安全）
countdown_state = {
    "remaining": 60,
    "running": False,
    "start_time": None,
    "target_seconds": 60,
}
state_lock = threading.Lock()


@app.route("/api/health", methods=["GET"])
def health_check():
    """健康检查接口"""
    return jsonify({
        "code": 200,
        "message": "Countdown backend is running",
        "data": {"status": "healthy"}
    })


@app.route("/api/countdown/start", methods=["POST"])
def countdown_start():
    """启动倒计时：记录启动时间和目标秒数"""
    with state_lock:
        current_remaining = countdown_state["remaining"]
        if current_remaining <= 0:
            # 若已归零则自动复位
            current_remaining = 60
            countdown_state["remaining"] = 60

        countdown_state["running"] = True
        countdown_state["start_time"] = time.time()
        countdown_state["target_seconds"] = current_remaining

    return jsonify({
        "code": 200,
        "message": "Countdown started",
        "data": {
            "remaining": current_remaining,
            "target_seconds": current_remaining,
        }
    })


@app.route("/api/countdown/reset", methods=["POST"])
def countdown_reset():
    """复位倒计时到 60"""
    with state_lock:
        countdown_state["remaining"] = 60
        countdown_state["running"] = False
        countdown_state["start_time"] = None
        countdown_state["target_seconds"] = 60

    return jsonify({
        "code": 200,
        "message": "Countdown reset to 60",
        "data": {"remaining": 60}
    })


@app.route("/api/countdown/status", methods=["GET"])
def countdown_status():
    """查询当前倒计时状态（可选，用于前后端同步）"""
    with state_lock:
        remaining = countdown_state["remaining"]
        running = countdown_state["running"]

    return jsonify({
        "code": 200,
        "message": "Current countdown status",
        "data": {
            "remaining": remaining,
            "running": running,
        }
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
