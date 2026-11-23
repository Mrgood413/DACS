import { BUILDING_DRILL } from '../config';
import { getEntityDefinition } from '../entity/getEntityDefinition';
import { isOreTerrain } from '../map/isOreTerrain';
import type { BuildPlan, Entity, EntityType, EnvironmentMap, Point } from '../types';
import { isTerrainBuildable } from './isTerrainBuildable';

/**
 * Liệt kê các ô của một công trình (đặt tại (x, y)) không xây được. Một ô bị chặn khi:
 * - nền đất không cho phép (isTerrainBuildable: ngoài map, nước, tường môi trường);
 * - là quặng mà công trình không phải máy đào (chỉ máy đào được đặt lên quặng);
 * - đã có công trình khác (kể cả đang xây) hoặc công trình đang chờ xây. Đơn vị (drone, bug) không chặn.
 * Riêng máy đào: phải có ít nhất 1 ô quặng bên dưới; không có ô quặng nào thì mọi ô của nó đều bị chặn.
 * Đây là nguồn duy nhất cho luật đặt công trình: canPlaceBuilding = danh sách này rỗng.
 * @param map Map môi trường.
 * @param entities Danh sách thực thể hiện có.
 * @param plans Các công trình đang chờ xây (của mọi drone).
 * @param type Mã loại công trình muốn đặt.
 * @param x Ô góc trên-trái theo chiều ngang.
 * @param y Ô góc trên-trái theo chiều dọc.
 * @returns Các ô bị chặn, theo thứ tự hàng từ trên xuống, trong hàng từ trái qua phải. Rỗng nếu đặt được.
 */
export function getBlockedTiles(
  map: EnvironmentMap,
  entities: Entity[],
  plans: BuildPlan[],
  type: EntityType,
  x: number,
  y: number,
): Point[] {
  const { width, height } = getEntityDefinition(type);
  const isDrill = type === BUILDING_DRILL;
  const footprint: Point[] = [];
  const blocked: Point[] = [];
  let oreCount = 0;

  for (let tileY = y; tileY < y + height; tileY++) {
    for (let tileX = x; tileX < x + width; tileX++) {
      footprint.push({ x: tileX, y: tileY });
      const onOre = isTerrainBuildable(map, tileX, tileY) && isOreTerrain(map.terrain[tileY * map.width + tileX] ?? 0);
      if (onOre) {
        oreCount++;
      }
      if (
        !isTerrainBuildable(map, tileX, tileY) ||
        (onOre && !isDrill) ||
        isCoveredByBuilding(entities, plans, tileX, tileY)
      ) {
        blocked.push({ x: tileX, y: tileY });
      }
    }
  }

  // Máy đào không có ô quặng nào bên dưới → cả khối không đặt được.
  if (isDrill && oreCount === 0) {
    return footprint;
  }
  return blocked;
}

/** Ô (x, y) có nằm dưới một công trình có sẵn hoặc một công trình đang chờ xây không. */
function isCoveredByBuilding(entities: Entity[], plans: BuildPlan[], x: number, y: number): boolean {
  for (const entity of entities) {
    if (getEntityDefinition(entity.type).group === 'Unit') {
      continue;
    }
    if (x >= entity.x && x < entity.x + entity.width && y >= entity.y && y < entity.y + entity.height) {
      return true;
    }
  }
  for (const plan of plans) {
    const { width, height } = getEntityDefinition(plan.type);
    if (x >= plan.x && x < plan.x + width && y >= plan.y && y < plan.y + height) {
      return true;
    }
  }
  return false;
}
