#!/usr/bin/env bash
# 在 Cursor Simple Browser 或系统浏览器中打开本地预览
URL="${1:-http://localhost:3000}"
CURSOR_BIN="/Applications/Cursor.app/Contents/Resources/app/bin/cursor"

if [[ -x "$CURSOR_BIN" ]]; then
  "$CURSOR_BIN" --command "simpleBrowser.show" "$URL" 2>/dev/null && exit 0
fi

if command -v cursor >/dev/null 2>&1; then
  cursor --command "simpleBrowser.show" "$URL" 2>/dev/null && exit 0
fi

open "$URL"
