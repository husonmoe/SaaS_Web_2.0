#!/usr/bin/env bash
# 将 water.svg 恢复为备份版本（water.svg.original）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP="$ROOT/public/assets/water.svg.original"
TARGET="$ROOT/public/assets/water.svg"

if [[ ! -f "$BACKUP" ]]; then
  echo "未找到备份: $BACKUP" >&2
  exit 1
fi

cp "$BACKUP" "$TARGET"
echo "已恢复: public/assets/water.svg"
echo "若需完全回退渲染逻辑，请在 BusinessMap.tsx 将 WATER_RENDER_MODE 改为 \"legacy\""
