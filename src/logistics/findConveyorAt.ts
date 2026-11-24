import { BUILDING_BANNER } from '../config';
import { findBuildingAt } from './findBuildingAt';
import type { Entity } from '../types';

/**
 * Tìm băng chuyền đã xây xong tại ô (x, y).
 * @param entities Danh sách thực thể.
 * @param x Toạ độ ô ngang.
 * @param y Toạ độ ô dọc.
 * @returns Băng chuyền hoặc undefined.
 */
export function findConveyorAt(entities: Entity[], x: number, y: number): Entity | undefined {
  const building = findBuildingAt(entities, x, y, BUILDING_BANNER);
  return building !== undefined && !building.constructing ? building : undefined;
}
