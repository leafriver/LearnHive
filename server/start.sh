#!/bin/bash

echo "========================================"
echo "LearnHive 后端服务启动脚本"
echo "========================================"

echo ""
echo "正在检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 环境正常"

echo ""
echo "正在检查依赖包..."
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖包安装失败"
        exit 1
    fi
else
    echo "✅ 依赖包已存在"
fi

echo ""
echo "正在启动服务器..."
echo "📍 服务地址: http://localhost:3000"
echo "📊 健康检查: http://localhost:3000/health"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

npm run dev 