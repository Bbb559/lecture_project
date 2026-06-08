/**
 * 倒计时页面 — 交互逻辑
 * 核心功能：60秒倒计时、开始、复位、后端同步
 */

// ==================== DOM 元素 ====================
const countdownNumber = document.getElementById("countdownNumber");
const countdownDisplay = document.getElementById("countdownDisplay");
const progressBar = document.getElementById("progressBar");
const btnStart = document.getElementById("btnStart");
const btnReset = document.getElementById("btnReset");
const backendStatus = document.getElementById("backendStatus");
const statusDot = backendStatus.querySelector(".status-dot");
const statusText = backendStatus.querySelector(".status-text");

// ==================== 状态变量 ====================
const TOTAL_SECONDS = 60;
let remainingSeconds = TOTAL_SECONDS;
let countdownTimer = null;
let backendAvailable = false;

// ==================== API 配置 ====================
const API_BASE = "http://localhost:5000";

/**
 * 通用 API 请求封装
 * @param {string} endpoint - API 路径
 * @param {string} method - HTTP 方法
 * @returns {Promise<Object|null>}
 */
async function apiRequest(endpoint, method = "GET") {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: method,
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn(`[API] ${endpoint} 请求失败:`, error.message);
        return null;
    }
}

/**
 * 调用后端启动倒计时
 */
async function callBackendStart() {
    const result = await apiRequest("/api/countdown/start", "POST");
    if (result && result.code === 200) {
        console.log("[API] 后端倒计时已启动");
    }
}

/**
 * 调用后端复位倒计时
 */
async function callBackendReset() {
    const result = await apiRequest("/api/countdown/reset", "POST");
    if (result && result.code === 200) {
        console.log("[API] 后端倒计时已复位");
    }
}

/**
 * 检查后端健康状态
 */
async function checkBackendHealth() {
    const result = await apiRequest("/api/health", "GET");
    if (result && result.code === 200) {
        backendAvailable = true;
        statusDot.className = "status-dot online";
        statusText.textContent = "后端已连接";
        console.log("[API] 后端健康检查通过");
    } else {
        backendAvailable = false;
        statusDot.className = "status-dot offline";
        statusText.textContent = "后端未连接（离线模式）";
        console.warn("[API] 后端不可用，使用离线模式");
    }
}

// ==================== 倒计时核心逻辑 ====================

/**
 * 更新页面显示
 * @param {number} seconds - 当前剩余秒数
 */
function updateDisplay(seconds) {
    countdownNumber.textContent = seconds;
    countdownNumber.classList.remove("finished");
    countdownDisplay.classList.remove("finished");

    if (seconds === 0) {
        countdownNumber.classList.add("finished");
        countdownDisplay.classList.add("finished");
    }

    // 更新进度条
    const progressPercent = (seconds / TOTAL_SECONDS) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

/**
 * 启动倒计时
 */
function startCountdown() {
    // 防止重复启动
    if (countdownTimer !== null) {
        return;
    }

    // 若已归零，先复位
    if (remainingSeconds <= 0) {
        remainingSeconds = TOTAL_SECONDS;
    }

    // 更新按钮状态
    btnStart.disabled = true;
    updateDisplay(remainingSeconds);

    // 通知后端
    if (backendAvailable) {
        callBackendStart();
    }

    // 启动定时器
    countdownTimer = setInterval(() => {
        remainingSeconds -= 1;
        updateDisplay(remainingSeconds);

        if (remainingSeconds <= 0) {
            stopCountdown();
        }
    }, 1000);
}

/**
 * 停止倒计时（不清除剩余秒数）
 */
function stopCountdown() {
    if (countdownTimer !== null) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    btnStart.disabled = false;
}

/**
 * 复位倒计时到 60
 */
function resetCountdown() {
    // 清除定时器
    stopCountdown();

    // 复位状态
    remainingSeconds = TOTAL_SECONDS;
    btnStart.disabled = false;
    updateDisplay(remainingSeconds);

    // 通知后端
    if (backendAvailable) {
        callBackendReset();
    }
}

// ==================== 事件绑定 ====================
btnStart.addEventListener("click", startCountdown);
btnReset.addEventListener("click", resetCountdown);

// ==================== 页面初始化 ====================
function init() {
    updateDisplay(TOTAL_SECONDS);
    checkBackendHealth();
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", init);
