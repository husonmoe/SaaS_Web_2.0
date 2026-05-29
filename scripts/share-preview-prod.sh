#!/usr/bin/env bash
# 构建生产版本并通过公网链接分享（比 dev 模式快很多）
# 依赖：cloudflared（brew install cloudflared）

set -euo pipefail

PORT="${1:-3000}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
URL="http://localhost:${PORT}"

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "❌ 未找到 cloudflared，请先安装:"
  echo "   brew install cloudflared"
  exit 1
fi

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

echo "📦 正在构建生产版本..."
cd "$ROOT"
npm run build

echo "🚀 启动生产服务 (${URL})..."
PORT="$PORT" npm run start >/dev/null 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 30); do
  if curl -s -o /dev/null --connect-timeout 1 "$URL"; then
    break
  fi
  sleep 1
done

if ! curl -s -o /dev/null --connect-timeout 2 "$URL"; then
  echo "❌ 生产服务启动失败"
  exit 1
fi

echo "✅ 生产服务已就绪"
echo "🌐 正在创建公网预览链接..."
echo "   关闭此终端或按 Ctrl+C 即可停止分享"
echo ""
cloudflared tunnel --url "$URL"
