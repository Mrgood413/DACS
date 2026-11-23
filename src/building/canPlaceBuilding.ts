import type { BuildPlan, Entity, EntityType, EnvironmentMap } from '../types';
import { getBlockedTiles } from './getBlockedTiles';

/**
 * Cho biết có đặt được công trình tại vị trí này không: mọi ô của công trình đều không bị chặn (xem getBlockedTiles).
 * Không đặt được khi: ra ngoài map; có ô là nước hoặc tường môi trường; đặt lên quặng mà không phải máy đào;
 * máy đào không có ô quặng nào bên dưới; chồng lên công trình khác (kể cả đang xây) hoặc công trình đang chờ xây.
 * Đơn vị (drone, bug) không cản.
 * @param map Map môi trường.
 * @param entities Danh sách thực thể hiện có.
 * @param plans Các công trình đang chờ xây (của mọi drone).
 * @param type Mã loại công trình muốn đặt.
 * @param x Ô góc trên-trái theo chiều ngang.
 * @param y Ô góc trên-trái theo chiều dọc.
 * @returns true nếu đặt được.
 */
export function canPlaceBuilding(
  map: EnvironmentMap,
  entities: Entity[],
  plans: BuildPlan[],
  type: EntityType,
  x: number,
  y: number,
): boolean {
  return getBlockedTiles(map, entities, plans, type, x, y).length === 0;
}
