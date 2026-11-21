import { Container, Graphics, Sprite } from 'pixi.js';
import type { Texture } from 'pixi.js';
import { loadTextureMap } from './loadGameTextures';
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
 * Ảnh ô địa hình. Mỗi loại địa hình có một thư mục riêng trong public/assets/terrain.
 * Ảnh gốc 8×8 px (phong cách Mindustry), khi vẽ được co về kích thước TILE_SIZE.
 */
export const TERRAIN_TEXTURE_URLS: Record<number, string> = {
  [TERRAIN_GRASS]: './assets/terrain/grass/grass.png',
  [TERRAIN_IRON_ORE]: './assets/terrain/iron_ore/iron_ore.png',
  [TERRAIN_COPPER_ORE]: './assets/terrain/copper_ore/copper_ore.png',
  [TERRAIN_SAND]: './assets/terrain/sand/sand.png',
  [TERRAIN_WATER]: './assets/terrain/water/water.png',
};

/**
 * Tải toàn bộ sprite ô địa hình rồi dựng lớp địa hình dạng sprite.
 * Ô nào không có sprite (hoặc sprite tải lỗi) thì fallback tô màu phẳng theo getTerrainColor,
 * nên map luôn hiển thị được dù thiếu asset.
 * @param map Map môi trường từ createEnvironmentMap.
 * @returns Container chứa các sprite ô + đường lưới, góc trên-trái của ô (0, 0) ở toạ độ (0, 0).
 */
export async function drawTerrainSprites(map: EnvironmentMap): Promise<Container> {
  const textures = await loadTextureMap(TERRAIN_TEXTURE_URLS);
  return buildTerrainSprites(map, (terrainId) => textures.get(terrainId));
}

/**
 * Dựng lớp địa hình dạng sprite từ một bộ texture cho trước (tách riêng để dễ kiểm thử).
 * @param map Map môi trường từ createEnvironmentMap.
 * @param getTexture Hàm tra texture theo mã địa hình; trả về undefined nếu loại đó không có sprite.
 * @returns Container chứa các sprite ô (hoặc fallback màu phẳng) + đường lưới giữa các ô.
 */
export function buildTerrainSprites(map: EnvironmentMap, getTexture: (terrainId: number) => Texture | undefined): Container {
  const container = new Container();
  const fallback = new Graphics();

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const terrainId = map.terrain[y * map.width + x];
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      const texture = getTexture(terrainId);
      if (texture !== undefined) {
        const sprite = new Sprite(texture);
        sprite.position.set(px, py);
        sprite.width = TILE_SIZE;
        sprite.height = TILE_SIZE;
        container.addChild(sprite);
      } else {
        // Không có sprite cho loại này: tô màu phẳng theo bảng màu như bản vẽ Graphics.
        fallback.rect(px, py, TILE_SIZE, TILE_SIZE).fill(getTerrainColor(terrainId));
      }
    }
  }
  container.addChild(fallback);

  // Đường lưới giữa các ô (giữ nguyên kiểu của bản vẽ Graphics).
  const grid = new Graphics();
  for (let i = 0; i <= map.width; i++) {
    grid.moveTo(i * TILE_SIZE, 0).lineTo(i * TILE_SIZE, map.height * TILE_SIZE);
  }
  for (let i = 0; i <= map.height; i++) {
    grid.moveTo(0, i * TILE_SIZE).lineTo(map.width * TILE_SIZE, i * TILE_SIZE);
  }
  grid.stroke({ width: GRID_LINE_WIDTH, color: GRID_LINE_COLOR });
  container.addChild(grid);

  return container;
}
