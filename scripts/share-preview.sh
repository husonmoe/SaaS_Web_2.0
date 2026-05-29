#!/usr/bin/env bash
# 将本地 dev server 暴露为公网链接，供多人预览
# 依赖：cloudflared（brew install cloudflared）
# 使用前请先运行 npm run dev
#
# 💡 多人预览推荐用生产模式（更快）：
#    npm run preview:share:prod

PORT="${1:-3000}"
URL="http://localhost:${PORT}"

if ! curl -s -o /dev/null --connect-timeout 2 "$URL"; then
  echo "❌ 本地服务未启动，请先运行: npm run dev"
  exit 1
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "❌ 未找到 cloudflared，请先安装:"
  echo "   brew install cloudflared"
  exit 1
fi

echo "🚀 正在创建公网预览链接（转发 ${URL}）..."
echo "   关闭此终端或按 Ctrl+C 即可停止分享"
echo ""
cloudflared tunnel --url "$URL"
