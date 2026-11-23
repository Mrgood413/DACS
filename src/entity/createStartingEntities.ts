import { BUILDING_CORE, UNIT_DRONE } from '../config';
import type { Entity, LaneLayout } from '../types';
import { createEntity } from './createEntity';

/**
 * Tạo các thực thể có sẵn khi bắt đầu màn: nhà chính (id 1) và drone của người chơi (id 2).
 * @param layout Bố cục map từ getLaneLayout.
 * @returns [nhà chính, drone], đã xây xong và đầy máu.
 */
export function createStartingEntities(layout: LaneLayout): Entity[] {
  return [
    { ...createEntity(BUILDING_CORE, layout.core.x, layout.core.y), id: 1 },
    { ...createEntity(UNIT_DRONE, layout.drone.x, layout.drone.y), id: 2 },
  ];
}
