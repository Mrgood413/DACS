import { TILE_SIZE } from '../config';
import type { Point } from '../types';

/**
 * Tìm ô chứa một điểm trong thế giới.
 * @param worldX Toạ độ x trong thế giới (pixel).
 * @param worldY Toạ độ y trong thế giới (pixel).
 * @returns Toạ độ ô (số nguyên, có thể âm hoặc vượt map nếu điểm nằm ngoài map).
 */
export function getTileAt(worldX: number, worldY: number): Point {
  return {
    x: Math.floor(worldX / TILE_SIZE),
    y: Math.floor(worldY / TILE_SIZE),
  };
}
