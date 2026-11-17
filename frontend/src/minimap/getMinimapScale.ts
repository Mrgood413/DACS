import { MINIMAP_SIZE, TILE_SIZE } from '../config';

/**
 * Tính tỉ lệ thu nhỏ từ map (pixel) sang minimap (pixel), sao cho cạnh dài nhất của map vừa đúng MINIMAP_SIZE.
 * @param map Map hiện tại (chỉ cần width, height).
 * @returns Tỉ lệ thu nhỏ, ví dụ map 100×100 (3200 px) → 0.0625.
 */
export function getMinimapScale(map: { width: number; height: number }): number {
  return MINIMAP_SIZE / (Math.max(map.width, map.height) * TILE_SIZE);
}
