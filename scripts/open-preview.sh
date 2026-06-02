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
  "$bin" --command "simpleBrowser.show" "$URL" >/dev/null 2>&1
}

# 只走一条打开路径，避免 Cursor CLI 失败后又 fallback 导致连开多个窗口
if [[ -x "$CURSOR_BIN" ]]; then
  if "$CURSOR_BIN" --help 2>/dev/null | rg -q -- "--command"; then
    if open_in_simple_browser "$CURSOR_BIN"; then
      exit 0
    fi
  fi
fi

if [[ -n "$CURSOR_CLI" && "$CURSOR_CLI" != "$CURSOR_BIN" ]]; then
  if "$CURSOR_CLI" --help 2>/dev/null | rg -q -- "--command"; then
    if open_in_simple_browser "$CURSOR_CLI"; then
      exit 0
    fi
  fi
fi

open "$URL"
