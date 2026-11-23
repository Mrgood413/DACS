import { ENV_WALL_STONE, TERRAIN_COPPER_ORE, TERRAIN_IRON_ORE } from '../config';
import type { EnvironmentMap, Rect } from '../types';
import { getLaneLayout } from './getLaneLayout';

/**
 * Dựng map hành lang lên một map toàn cỏ (sửa tại chỗ): mọi cột ngoài hành lang là tường đá,
 * hai làn quặng ở đáy hành lang (sắt bên trái, đồng bên phải). Bố cục lấy từ getLaneLayout.
 * @param map Map môi trường từ createEnvironmentMap (bị sửa tại chỗ).
 * @returns Chính object map truyền vào.
 * @throws Error nếu map quá nhỏ (xem getLaneLayout).
 */
export function createLaneEnvironment(map: EnvironmentMap): EnvironmentMap {
  const layout = getLaneLayout(map.width, map.height);

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      if (x < layout.corridorLeft || x > layout.corridorRight) {
        map.wall[y * map.width + x] = ENV_WALL_STONE;
      }
    }
  }

  fillTerrain(map, layout.ironLane, TERRAIN_IRON_ORE);
  fillTerrain(map, layout.copperLane, TERRAIN_COPPER_ORE);
  return map;
}

/** Gán một loại địa hình cho mọi ô trong vùng (toạ độ ô). */
function fillTerrain(map: EnvironmentMap, area: Rect, terrainId: number): void {
  for (let y = area.y; y < area.y + area.height; y++) {
    for (let x = area.x; x < area.x + area.width; x++) {
      map.terrain[y * map.width + x] = terrainId;
    }
  }
}
