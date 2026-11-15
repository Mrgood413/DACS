import { Graphics } from 'pixi.js';
import { BORDER_COLOR, BORDER_WIDTH, TILE_SIZE } from '../config';
import type { GameMap } from '../types';

/**
 * Vẽ đường viền quanh mép ngoài của map để thấy rõ map kết thúc ở đâu.
 * @param map Map từ createMap.
 * @returns Graphics chỉ có một hình chữ nhật viền, không tô bên trong.
 */
export function drawMapBorder(map: GameMap): Graphics {
  const graphics = new Graphics();
  graphics
    .rect(0, 0, map.width * TILE_SIZE, map.height * TILE_SIZE)
    .stroke({ width: BORDER_WIDTH, color: BORDER_COLOR });
  return graphics;
}
