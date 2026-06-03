#!/usr/bin/env bash
# 在 Cursor Simple Browser 或系统浏览器中打开本地预览（带缓存破坏参数）
set -euo pipefail

BASE="${1:-http://localhost:3000}"
if [[ "$BASE" == *"?"* ]]; then
  URL="${BASE}&dev=$(date +%s)"
else
  URL="${BASE}?dev=$(date +%s)"
fi
CURSOR_BIN="/Applications/Cursor.app/Contents/Resources/app/bin/cursor"
CURSOR_CLI="$(command -v cursor 2>/dev/null || true)"

open_in_simple_browser() {
  local bin="$1"
  "$bin" --command "simpleBrowser.show" "$URL" 2>/dev/null || true
}

# 只走一条打开路径，避免 Cursor CLI 失败后又 fallback 导致连开多个窗口
if [[ -x "$CURSOR_BIN" ]]; then
  open_in_simple_browser "$CURSOR_BIN"
  exit 0
fi

if [[ -n "$CURSOR_CLI" && "$CURSOR_CLI" != "$CURSOR_BIN" ]]; then
  open_in_simple_browser "$CURSOR_CLI"
  exit 0
fi

open "$URL"
