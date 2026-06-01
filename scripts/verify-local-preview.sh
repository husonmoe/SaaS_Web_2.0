#!/usr/bin/env bash
# 确认本地 dev 已输出最新构建（用于排查「改了但没生效」）
set -euo pipefail

PORT="${1:-3000}"
URL="http://localhost:${PORT}/"
MARKER="${2:-}"

if ! curl -s -o /dev/null --connect-timeout 2 "${URL}"; then
  echo "❌ 无法连接 ${URL} — 请先运行: npm run dev:fresh"
  exit 1
fi

HTML="$(curl -s "${URL}")"

if [[ -n "${MARKER}" ]] && ! echo "${HTML}" | grep -qF "${MARKER}"; then
  echo "❌ 页面未包含预期标记: ${MARKER}"
  echo "   可能仍在看旧缓存、旧 dev 进程，或线上地址。请 npm run dev:fresh 后硬刷新。"
  exit 1
fi

echo "✅ 本地预览可访问: ${URL}"
if [[ -n "${MARKER}" ]]; then
  echo "✅ 已检测到构建标记: ${MARKER}"
fi
