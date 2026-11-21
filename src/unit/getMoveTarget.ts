import { TILE_SIZE } from '../config';
import type { Entity, Point } from '../types';

/**
 * Tính ô đích để đơn vị đứng sao cho tâm của nó nằm đúng điểm người chơi bấm. Đích không ra ngoài map.
 * @param worldX Toạ độ x điểm bấm trong thế giới (pixel).
 * @param worldY Toạ độ y điểm bấm trong thế giới (pixel).
 * @param entity Đơn vị cần di chuyển (dùng width, height theo ô).
 * @param map Map hiện tại (chỉ cần width, height theo ô).
 * @returns Toạ độ ô góc trên-trái của đơn vị tại đích (có thể là số lẻ).
 */
export function getMoveTarget(
  worldX: number,
  worldY: number,
  entity: Entity,
  map: { width: number; height: number },
): Point {
  const x = worldX / TILE_SIZE - entity.width / 2;
  const y = worldY / TILE_SIZE - entity.height / 2;
  return {
    x: Math.max(0, Math.min(map.width - entity.width, x)),
    y: Math.max(0, Math.min(map.height - entity.height, y)),
  };
}
