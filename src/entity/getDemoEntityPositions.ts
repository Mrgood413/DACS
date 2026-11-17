import { BUILDING_BANNER, BUILDING_COPPER_WALL, BUILDING_CORE, BUILDING_DRILL, BUILDING_ELECTRIC_TURRET, BUILDING_IRON_WALL, BUILDING_TURRET, UNIT_BUG, UNIT_DRONE } from '../config';
import type { EntityPosition, EnvironmentMap, EntityType } from '../types';
import { getEntityDefinition } from './getEntityDefinition';

/**
 * Bố cục thực thể demo: mỗi thực thể đứng giữa một "chỗ" (slot) vuông,
 * xếp thành lưới 3 cột × 3 hàng ở góc dưới-phải map.
 * Thứ tự điền: từ dưới đi lên, trong mỗi hàng từ phải qua trái.
 */
const SLOT_SIZE = 6;
const EDGE_MARGIN = 4;

/**
 * Tính vị trí đặt các thực thể demo ở góc dưới-phải của map.
 * Các thực thể cùng hàng ngang hàng nhau (cùng tâm dọc), hàng dưới đi trước,
 * trong mỗi hàng đi từ phải qua trái; cách mép map EDGE_MARGIN ô; không chồng lấn.
 * @param map Map môi trường hiện tại (chỉ dùng kích thước).
 * @returns Danh sách vị trí theo loại thực thể, thứ tự khớp createDemoEntities.
 */
export function getDemoEntityPositions(map: EnvironmentMap): EntityPosition[] {
  // Chỗ góc dưới-phải cùng (hàng dưới, cột phải nhất): chừa mép map EDGE_MARGIN ô.
  const rightmostRectX = map.width - EDGE_MARGIN - SLOT_SIZE;
  const bottomRectY = map.height - EDGE_MARGIN - SLOT_SIZE;

  // Đặt một thực thể vào giữa chỗ (col, row): col 0 = cột phải nhất, row 0 = hàng dưới cùng.
  // Kích thước lấy từ định nghĩa chung (getEntityDefinition) — không viết kích thước rải rác.
  const place = (type: EntityType, col: number, row: number): EntityPosition => {
    const definition = getEntityDefinition(type);
    const rectX = rightmostRectX - col * SLOT_SIZE;
    const rectY = bottomRectY - row * SLOT_SIZE;
    return {
      type,
      x: rectX + Math.floor(SLOT_SIZE / 2) - Math.floor(definition.width / 2),
      y: rectY + Math.floor(SLOT_SIZE / 2) - Math.floor(definition.height / 2),
      rotation: definition.rotatable ? 1 : 0,
    };
  };

  // Thứ tự khớp createDemoEntities: từ dưới đi lên, mỗi hàng từ phải qua trái.
  return [
    place(BUILDING_CORE, 0, 0),              // hàng dưới, cột phải nhất
    place(BUILDING_TURRET, 1, 0),            // hàng dưới, giữa
    place(BUILDING_ELECTRIC_TURRET, 2, 0),   // hàng dưới, trái nhất
    place(BUILDING_DRILL, 0, 1),             // hàng giữa, phải nhất
    place(BUILDING_IRON_WALL, 1, 1),         // hàng giữa, giữa
    place(BUILDING_COPPER_WALL, 2, 1),       // hàng giữa, trái nhất
    place(BUILDING_BANNER, 0, 2),            // hàng trên, phải nhất (băng rôn xoay hướng 1)
    place(UNIT_DRONE, 1, 2),                 // hàng trên, giữa
    place(UNIT_BUG, 2, 2),                   // hàng trên, trái nhất
  ];
}
