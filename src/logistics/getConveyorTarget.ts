import { BUILDING_BANNER, BUILDING_CORE, BUILDING_ELECTRIC_TURRET, BUILDING_TURRET } from '../config';
import type { Entity, Point } from '../types';
import { findBuildingAt } from './findBuildingAt';
import { getConveyorDirection } from './getConveyorDirection';

/** Kết quả phân tích ô mà một băng chuyền hướng tới. */
export type ConveyorTarget =
  | { kind: 'conveyor'; entity: Entity }
  | { kind: 'turret'; entity: Entity }
  | { kind: 'core'; entity: Entity }
  | { kind: 'none' };

/**
 * Xác định công trình mà băng chuyền đang hướng vào (ô ngay kế tiếp theo hướng).
 * @param conveyor Băng chuyền cần xét.
 * @param entities Danh sách thực thể.
 * @returns Mô tả đích: băng chuyền khác, trụ súng, nhà chính hoặc không có.
 */
export function getConveyorTarget(conveyor: Entity, entities: Entity[]): ConveyorTarget {
  const dir = getConveyorDirection(conveyor.rotation);
  const next: Point = { x: conveyor.x + dir.x, y: conveyor.y + dir.y };
  const building = findBuildingAt(entities, next.x, next.y);
  if (building === undefined || building.constructing) {
    return { kind: 'none' };
  }
  if (building.type === BUILDING_BANNER) {
    return { kind: 'conveyor', entity: building };
  }
  if (building.type === BUILDING_TURRET || building.type === BUILDING_ELECTRIC_TURRET) {
    return { kind: 'turret', entity: building };
  }
  if (building.type === BUILDING_CORE) {
    return { kind: 'core', entity: building };
  }
  return { kind: 'none' };
}
