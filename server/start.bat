@echo off
echo ========================================
echo LearnHive 后端服务启动脚本
echo ========================================

echo.
echo 正在检查 Node.js 环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo ✅ Node.js 环境正常

echo.
echo 正在检查依赖包...
if not exist "node_modules" (
    echo 📦 正在安装依赖包...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖包安装失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖包已存在
)

echo.
echo 正在启动服务器...
echo 📍 服务地址: http://localhost:3000
echo 📊 健康检查: http://localhost:3000/health
echo.
echo 按 Ctrl+C 停止服务
echo.

npm run dev 