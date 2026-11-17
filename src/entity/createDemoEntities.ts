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
import type { Entity } from '../types';
import { createEntity } from './createEntity';

/**
 * Tạo danh sách thực thể demo: mỗi loại đúng một cái (9 thực thể).
 * Vị trí đặt tại (0, 0) tạm thời — vị trí thật do getDemoEntityPositions tính và ghép ở T-041.
 * @returns Mảng 9 Entity với id đánh số 1 → 9 theo thứ tự tạo.
 */
export function createDemoEntities(): Entity[] {
  const entities: Entity[] = [
    createEntity(BUILDING_CORE, 0, 0),
    createEntity(BUILDING_TURRET, 0, 0),
    createEntity(BUILDING_ELECTRIC_TURRET, 0, 0),
    createEntity(BUILDING_DRILL, 0, 0),
    createEntity(BUILDING_IRON_WALL, 0, 0),
    createEntity(BUILDING_COPPER_WALL, 0, 0),
    createEntity(BUILDING_BANNER, 0, 0, 1),
    createEntity(UNIT_DRONE, 0, 0),
    createEntity(UNIT_BUG, 0, 0),
  ];
  entities.forEach((entity, index) => {
    entity.id = index + 1;
  });
  return entities;
}
