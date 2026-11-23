import { TILE_SIZE } from '../config';
import type { Entity, Point } from '../types';

/**
 * Tính tâm của thực thể trong thế giới.
 * @param entity Thực thể.
 * @returns Toạ độ tâm (pixel thế giới).
 */
export function getEntityCenter(entity: Entity): Point {
  return {
    x: (entity.x + entity.width / 2) * TILE_SIZE,
    y: (entity.y + entity.height / 2) * TILE_SIZE,
  };
}
