import { Graphics } from 'pixi.js';
import {
  GRID_LINE_COLOR,
  GRID_LINE_WIDTH,
  TILE_COLORS,
  TILE_SIZE,
  UNKNOWN_TILE_COLOR,
} from '../config';
import type { GameMap } from '../types';

/**
 * Vẽ toàn bộ ô của map và đường lưới giữa các ô.
 * @param map Map từ createMap.
 * @returns Graphics đã vẽ xong, góc trên-trái của ô (0, 0) ở toạ độ (0, 0).
 */
export function drawTiles(map: GameMap): Graphics {
  const graphics = new Graphics();

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.tiles[y * map.width + x];
      const color = TILE_COLORS[tile] ?? UNKNOWN_TILE_COLOR;
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
