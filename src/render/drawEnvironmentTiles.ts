import { Graphics } from 'pixi.js';
import {
  GRID_LINE_COLOR,
  GRID_LINE_WIDTH,
  TERRAIN_COPPER_ORE,
  TERRAIN_GRASS,
  TERRAIN_IRON_ORE,
  TERRAIN_SAND,
  TERRAIN_WATER,
  TILE_SIZE,
} from '../config';
import type { EnvironmentMap } from '../types';
import { getTerrainColor } from '../map/getTerrainColor';

/**
 * Vẽ toàn bộ ô địa hình của map môi trường và đường lưới giữa các ô.
 * Màu nền lấy từ getTerrainColor (bảng màu artstyle.png); mỗi loại ô có chi tiết nhỏ
 * vẽ đè theo artstyle: cỏ = đốm cỏ tối, quặng sắt = đá sáng, quặng đồng = cục quặng cam,
 * cát = đốm cát, nước = gợn sóng ngang.
 * @param map Map môi trường từ createEnvironmentMap.
 * @returns Graphics đã vẽ xong, góc trên-trái của ô (0, 0) ở toạ độ (0, 0).
 */
export function drawEnvironmentTiles(map: EnvironmentMap): Graphics {
  const graphics = new Graphics();

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const terrainId = map.terrain[y * map.width + x];
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      graphics.rect(px, py, TILE_SIZE, TILE_SIZE).fill(getTerrainColor(terrainId));
      drawTerrainDetail(graphics, px, py, terrainId);
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

/**
 * Vẽ chi tiết nhỏ của một ô địa hình theo artstyle.png (nằm trọn trong ô, không đè lưới).
 * @param graphics Graphics để vẽ vào.
 * @param px Toạ độ pixel góc trên-trái của ô (trục ngang).
 * @param py Toạ độ pixel góc trên-trái của ô (trục dọc).
 * @param terrainId Mã địa hình của ô.
 */
function drawTerrainDetail(graphics: Graphics, px: number, py: number, terrainId: number): void {
  switch (terrainId) {
    case TERRAIN_GRASS:
      // Đốm cỏ tối rải rác.
      graphics.rect(px + 9, py + 8, 3, 2).fill(0x3f7f2e);
      graphics.rect(px + 21, py + 19, 3, 2).fill(0x3f7f2e);
      graphics.rect(px + 15, py + 25, 2, 2).fill(0x3f7f2e);
      break;

    case TERRAIN_IRON_ORE:
      // Đá sáng trên nền đá xám xanh đậm.
      graphics.circle(px + 10, py + 11, 3).fill(0x8a94a3);
      graphics.circle(px + 22, py + 21, 2.5).fill(0x8a94a3);
      graphics.rect(px + 17, py + 5, 4, 3).fill(0x39414d);
      break;

    case TERRAIN_COPPER_ORE:
      // Cục quặng cam trên nền đất nâu.
      graphics.rect(px + 8, py + 18, 5, 4).fill(0xc9722e);
      graphics.rect(px + 20, py + 9, 4, 3).fill(0xc9722e);
      graphics.circle(px + 24, py + 24, 2).fill(0x5a3b28);
      break;

    case TERRAIN_SAND:
      // Đốm cát nhỏ.
      graphics.circle(px + 10, py + 10, 1.5).fill(0xdcc890);
      graphics.circle(px + 22, py + 20, 1.5).fill(0xdcc890);
      graphics.circle(px + 16, py + 27, 1.5).fill(0xdcc890);
      break;

    case TERRAIN_WATER:
      // Gợn sóng ngang màu sáng hơn.
      graphics.moveTo(px + 6, py + 12).lineTo(px + 26, py + 12);
      graphics.moveTo(px + 10, py + 24).lineTo(px + 30, py + 24);
      graphics.stroke({ width: 2, color: 0x5fc4cf });
      break;
  }
}
