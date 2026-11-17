import { Graphics } from 'pixi.js';
import { BORDER_COLOR, BORDER_WIDTH, TILE_SIZE } from '../config';

/**
 * Vẽ đường viền quanh mép ngoài của map để thấy rõ map kết thúc ở đâu.
 * @param map Map hiện tại (chỉ cần width, height).
 * @returns Graphics chỉ có một hình chữ nhật viền, không tô bên trong.
 */
export function drawMapBorder(map: { width: number; height: number }): Graphics {
  const graphics = new Graphics();
  graphics
    .rect(0, 0, map.width * TILE_SIZE, map.height * TILE_SIZE)
    .stroke({ width: BORDER_WIDTH, color: BORDER_COLOR });
  return graphics;
}
