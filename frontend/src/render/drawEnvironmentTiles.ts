import { Graphics } from 'pixi.js';
import { GRID_LINE_COLOR, GRID_LINE_WIDTH, TILE_SIZE } from '../config';
import type { EnvironmentMap } from '../types';
import { getTerrainColor } from '../map/getTerrainColor';

/**
 * Vẽ toàn bộ ô địa hình của map môi trường và đường lưới giữa các ô.
 * @param map Map môi trường từ createEnvironmentMap.
 * @returns Graphics đã vẽ xong, góc trên-trái của ô (0, 0) ở toạ độ (0, 0).
 */
export function drawEnvironmentTiles(map: EnvironmentMap): Graphics {
  const graphics = new Graphics();

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const color = getTerrainColor(map.terrain[y * map.width + x]);
      graphics.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE).fill(color);
    }
  }

  for (let i = 0; i <= map.width; i++) {
    graphics.moveTo(i * TILE_SIZE, 0).lineTo(i * TILE_SIZE, map.height * TILE_SIZE);
  }
  for (let i = 0; i <= map.height; i++) {
    graphics.moveTo(0, i * TILE_SIZE).lineTo(map.width * TILE_SIZE, i * TILE_SIZE);
  }
  graphics.stroke({ width: GRID_LINE_WIDTH, color: GRID_LINE_COLOR });

  return graphics;
}
