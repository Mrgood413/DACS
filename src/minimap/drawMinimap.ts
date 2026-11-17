import { Graphics } from 'pixi.js';
import { BORDER_COLOR, MINIMAP_BACKGROUND_COLOR, TILE_SIZE } from '../config';
import type { EnvironmentMap } from '../types';
import { getMinimapScale } from './getMinimapScale';
import { getTerrainColor } from '../map/getTerrainColor';

/**
 * Vẽ bản đồ thu nhỏ: nền đen, mỗi ô của map là một ô vuông nhỏ cùng màu địa hình, viền vàng quanh map.
 * @param map Map môi trường hiện tại.
 * @returns Graphics đã vẽ xong, góc trên-trái của map thu nhỏ ở (0, 0). Không có đường lưới.
 */
export function drawMinimap(map: EnvironmentMap): Graphics {
  const scale = getMinimapScale(map);
  const tilePx = TILE_SIZE * scale;
  const width = map.width * tilePx;
  const height = map.height * tilePx;

  const graphics = new Graphics();

  graphics.rect(-2, -2, width + 4, height + 4).fill(MINIMAP_BACKGROUND_COLOR);

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const color = getTerrainColor(map.terrain[y * map.width + x]);
      graphics.rect(x * tilePx, y * tilePx, tilePx, tilePx).fill(color);
    }
  }

  graphics.rect(0, 0, width, height).stroke({ width: 1, color: BORDER_COLOR });

  return graphics;
}
