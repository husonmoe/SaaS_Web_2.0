/** 客户案例地图面板 · 地图 / 光点 / 光柱 / 数字跳动 统一时间轴 */

export const MAP_PANEL_ENTER_MS = 1200;

/** 光点、数字统计与地图入场半程同步启动 */
export const MAP_EFFECTS_START_MS = MAP_PANEL_ENTER_MS / 2;

/** 光柱相对光点的延迟 */
export const MAP_COLUMNS_OFFSET_MS = 280;

/** 光点 / 光柱淡入时长（对应 --map-effect-enter-duration） */
export const MAP_EFFECT_FADE_MS = 800;

/**
 * 光柱错峰最大延迟（须与 BusinessMap 内 GROUP_STAGGER 等参数匹配）
 * 光柱为最晚完成项：start + stagger + fade
 */
export const MAP_EFFECT_MAX_STAGGER_MS = 980;

export const MAP_EFFECTS_END_MS =
  MAP_EFFECTS_START_MS +
  MAP_COLUMNS_OFFSET_MS +
  MAP_EFFECT_MAX_STAGGER_MS +
  MAP_EFFECT_FADE_MS;

/** 数字跳动：与光点同时开始，与光柱淡入同时结束 */
export const MAP_STATS_DURATION_MS =
  MAP_EFFECTS_END_MS - MAP_EFFECTS_START_MS;
