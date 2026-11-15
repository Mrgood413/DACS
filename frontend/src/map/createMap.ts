import { TILE_GRASS } from '../config';
import type { GameMap } from '../types';

/**
 * Tạo dữ liệu map dạng lưới, mọi ô đều là cỏ.
 * @param width Số ô theo chiều ngang.
 * @param height Số ô theo chiều dọc.
 * @returns GameMap có kích thước width × height, mọi ô bằng TILE_GRASS.
 * @throws Error nếu width hoặc height không phải số nguyên dương.
 */
export function createMap(width: number, height: number): GameMap {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error('Kích thước map không hợp lệ');
  }
  const tiles = new Uint8Array(width * height);
  tiles.fill(TILE_GRASS);
  return { width, height, tiles };
}
