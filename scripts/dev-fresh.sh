#!/usr/bin/env bash
# 清缓存并重启 Next dev，避免改代码后预览仍显示旧样式
set -euo pipefail

PORT="${1:-3000}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

echo "🛑 停止端口 ${PORT} 上的旧进程..."
lsof -ti:"${PORT}" | xargs kill -9 2>/dev/null || true
sleep 0.5

echo "🧹 清除 .next 构建缓存..."
rm -rf .next

echo "🚀 启动 dev server (http://localhost:${PORT})..."
exec npm run dev -- -p "${PORT}"
