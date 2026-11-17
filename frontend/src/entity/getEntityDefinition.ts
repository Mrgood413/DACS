import {
  BUILDING_BANNER,
  BUILDING_COPPER_WALL,
  BUILDING_CORE,
  BUILDING_DRILL,
  BUILDING_ELECTRIC_TURRET,
  BUILDING_IRON_WALL,
  BUILDING_TURRET,
  UNIT_BUG,
  UNIT_DRONE,
} from '../config';
import type { EntityDefinition, EntityType } from '../types';

/**
 * Bảng định nghĩa chung của từng loại thực thể — nguồn duy nhất về kích thước, nhóm, khả năng xoay.
 * Kích thước tính theo ô: nhà chính 3×3, dàn khoan 2×2, các công trình khác 1×1, đơn vị 1×1.
 */
const ENTITY_DEFINITIONS: Record<EntityType, EntityDefinition> = {
  [BUILDING_CORE]: { type: BUILDING_CORE, width: 3, height: 3, group: 'Architecture', rotatable: false },
  [BUILDING_TURRET]: { type: BUILDING_TURRET, width: 1, height: 1, group: 'Architecture', rotatable: false },
  [BUILDING_ELECTRIC_TURRET]: { type: BUILDING_ELECTRIC_TURRET, width: 1, height: 1, group: 'Architecture', rotatable: false },
  [BUILDING_DRILL]: { type: BUILDING_DRILL, width: 2, height: 2, group: 'Architecture', rotatable: false },
  [BUILDING_IRON_WALL]: { type: BUILDING_IRON_WALL, width: 1, height: 1, group: 'Architecture', rotatable: false },
  [BUILDING_COPPER_WALL]: { type: BUILDING_COPPER_WALL, width: 1, height: 1, group: 'Architecture', rotatable: false },
  [BUILDING_BANNER]: { type: BUILDING_BANNER, width: 1, height: 1, group: 'Architecture', rotatable: true },
  [UNIT_DRONE]: { type: UNIT_DRONE, width: 1, height: 1, group: 'Unit', rotatable: false },
  [UNIT_BUG]: { type: UNIT_BUG, width: 1, height: 1, group: 'Unit', rotatable: false },
};

/**
 * Lấy thông tin định nghĩa của từng loại thực thể.
 * @param type Mã loại thực thể (BUILDING_* / UNIT_*).
 * @returns EntityDefinition của loại đó.
 * @throws Error nếu loại không tồn tại.
 */
export function getEntityDefinition(type: EntityType): EntityDefinition {
  const definition = ENTITY_DEFINITIONS[type];
  if (definition === undefined) {
    throw new Error(`Loại thực thể không hợp lệ: ${type}`);
  }
  return definition;
}
