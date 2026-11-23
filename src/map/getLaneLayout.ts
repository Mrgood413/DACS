import {
  CORE_GAP_ABOVE_LANES,
  CORRIDOR_WIDTH,
  DRONE_GAP_ABOVE_CORE,
  ORE_LANE_BOTTOM_MARGIN,
  ORE_LANE_LENGTH,
  ORE_LANE_WALL_GAP,
  ORE_LANE_WIDTH,
} from '../config';
import type { LaneLayout } from '../types';

/** Kích thước nhà chính (ô) — khớp định nghĩa BUILDING_CORE trong getEntityDefinition. */
const CORE_SIZE = 3;

/**
 * Tính bố cục map hành lang: vị trí hành lang, 2 làn quặng, nhà chính và drone lúc bắt đầu.
 * Nguồn duy nhất cho bố cục — createLaneEnvironment (vẽ map) và createStartingEntities (đặt thực thể) đều dùng hàm này.
 * Từ dưới lên: làn quặng (cách mép dưới ORE_LANE_BOTTOM_MARGIN) → nhà chính → drone.
 * @param width Số ô ngang của map.
 * @param height Số ô dọc của map.
 * @returns LaneLayout, toạ độ tính bằng ô.
 * @throws Error nếu map quá nhỏ để chứa bố cục.
 */
export function getLaneLayout(width: number, height: number): LaneLayout {
  const neededHeight = ORE_LANE_BOTTOM_MARGIN + ORE_LANE_LENGTH + CORE_GAP_ABOVE_LANES + CORE_SIZE + DRONE_GAP_ABOVE_CORE + 1;
  if (width < CORRIDOR_WIDTH || height < neededHeight) {
    throw new Error('Map quá nhỏ cho bố cục hành lang');
  }

  const corridorLeft = Math.floor((width - CORRIDOR_WIDTH) / 2);
  const corridorRight = corridorLeft + CORRIDOR_WIDTH - 1;
  const laneTop = height - ORE_LANE_BOTTOM_MARGIN - ORE_LANE_LENGTH;

  const coreX = corridorLeft + Math.floor((CORRIDOR_WIDTH - CORE_SIZE) / 2);
  const coreY = laneTop - CORE_GAP_ABOVE_LANES - CORE_SIZE;

  return {
    corridorLeft,
    corridorRight,
    ironLane: { x: corridorLeft + ORE_LANE_WALL_GAP, y: laneTop, width: ORE_LANE_WIDTH, height: ORE_LANE_LENGTH },
    copperLane: {
      x: corridorRight - ORE_LANE_WALL_GAP - ORE_LANE_WIDTH + 1,
      y: laneTop,
      width: ORE_LANE_WIDTH,
      height: ORE_LANE_LENGTH,
    },
    core: { x: coreX, y: coreY },
    drone: { x: coreX + 1, y: coreY - DRONE_GAP_ABOVE_CORE },
  };
}
