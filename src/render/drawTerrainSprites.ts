import { Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
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
 * Đường dẫn sprite ô địa hình trong thư mục asset public (bộ asset người dùng cung cấp:
 * `Báo cáo đồ án/stitch_mindustry_2d_pixijs_clone` — chỉ có sprite cho 5 loại ô địa hình).
 * Ảnh gốc 512×512, khi vẽ được co về kích thước TILE_SIZE.
 */
export const TERRAIN_TEXTURE_URLS: Record<number, string> = {
  [TERRAIN_GRASS]: './assets/terrain/tiles/grass.png',
  [TERRAIN_IRON_ORE]: './assets/terrain/tiles/iron_ore.png',
  [TERRAIN_COPPER_ORE]: './assets/terrain/tiles/copper_ore.png',
  [TERRAIN_SAND]: './assets/terrain/tiles/sand.png',
  [TERRAIN_WATER]: './assets/terrain/tiles/water.png',
};

/**
 * Tải toàn bộ sprite ô địa hình rồi dựng lớp địa hình dạng sprite.
 * Ô nào không có sprite (hoặc sprite tải lỗi) thì fallback tô màu phẳng theo getTerrainColor,
 * nên map luôn hiển thị được dù thiếu asset.
 * @param map Map môi trường từ createEnvironmentMap.
 * @returns Container chứa các sprite ô + đường lưới, góc trên-trái của ô (0, 0) ở toạ độ (0, 0).
 */
export async function drawTerrainSprites(map: EnvironmentMap): Promise<Container> {
  // Tải song song tất cả sprite; ô loại nào tải lỗi thì bỏ qua (fallback màu phẳng).
  const textures = new Map<number, Texture>();
  await Promise.all(
    Object.entries(TERRAIN_TEXTURE_URLS).map(async ([terrainId, url]) => {
      try {
        textures.set(Number(terrainId), await Assets.load<Texture>(url));
      } catch {
        // Bỏ qua — loại này sẽ fallback màu phẳng.
      }
    }),
  );
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
