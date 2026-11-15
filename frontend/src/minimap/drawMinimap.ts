import { Graphics } from 'pixi.js';
import { BORDER_COLOR, MINIMAP_BACKGROUND_COLOR, TILE_COLORS, TILE_SIZE, UNKNOWN_TILE_COLOR } from '../config';
import type { GameMap } from '../types';
import { getMinimapScale } from './getMinimapScale';

/**
 * Vẽ bản đồ thu nhỏ: nền đen, mỗi ô của map là một ô vuông nhỏ cùng màu, viền vàng quanh map.
 * @param map Map hiện tại.
 * @returns Graphics đã vẽ xong, góc trên-trái của map thu nhỏ ở (0, 0). Không có đường lưới.
 */
export function drawMinimap(map: GameMap): Graphics {
  const scale = getMinimapScale(map);
  const tilePx = TILE_SIZE * scale;
  const width = map.width * tilePx;
  const height = map.height * tilePx;

  const graphics = new Graphics();

  graphics.rect(-2, -2, width + 4, height + 4).fill(MINIMAP_BACKGROUND_COLOR);

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.tiles[y * map.width + x];
      const color = TILE_COLORS[tile] ?? UNKNOWN_TILE_COLOR;
      graphics.rect(x * tilePx, y * tilePx, tilePx, tilePx).fill(color);
    }
  }

  graphics.rect(0, 0, width, height).stroke({ width: 1, color: BORDER_COLOR });

  return graphics;
}
