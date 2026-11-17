import { ENV_WALL_NONE, TERRAIN_GRASS } from '../config';
import type { EnvironmentMap } from '../types';

/**
 * Tạo bản đồ môi trường với dữ liệu địa hình và lớp tường độc lập.
 * @param width Số ô theo chiều ngang.
 * @param height Số ô theo chiều dọc.
 * @returns EnvironmentMap: toàn bộ terrain là cỏ, toàn bộ wall là ENV_WALL_NONE.
 * @throws Error nếu width hoặc height không phải số nguyên dương.
 */
export function createEnvironmentMap(width: number, height: number): EnvironmentMap {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error('Kích thước map không hợp lệ');
  }
  const terrain = new Uint8Array(width * height);
  terrain.fill(TERRAIN_GRASS);
  const wall = new Uint8Array(width * height);
  wall.fill(ENV_WALL_NONE);
  return { width, height, terrain, wall };
}
