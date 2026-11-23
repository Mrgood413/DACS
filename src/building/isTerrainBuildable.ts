import { ENV_WALL_NONE, TERRAIN_WATER } from '../config';
import type { EnvironmentMap } from '../types';

/**
 * Cho biết một ô có cho phép đặt công trình lên không, chỉ xét nền đất: nằm trong map, không phải nước,
 * không có tường môi trường. Quặng được tính là đặt được ở đây; luật riêng cho quặng (chỉ máy đào được
 * đặt lên quặng) nằm ở getBlockedTiles. Công trình và hàng chờ cũng xét ở getBlockedTiles.
 * @param map Map môi trường.
 * @param x Toạ độ ô theo chiều ngang.
 * @param y Toạ độ ô theo chiều dọc.
 * @returns false nếu ô nằm ngoài map, là nước, hoặc có tường môi trường.
 */
export function isTerrainBuildable(map: EnvironmentMap, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
    return false;
  }
  const index = y * map.width + x;
  return map.terrain[index] !== TERRAIN_WATER && map.wall[index] === ENV_WALL_NONE;
}
