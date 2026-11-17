import { Assets, Texture } from 'pixi.js';
import { BUILDING_BANNER, BUILDING_CORE, BUILDING_COPPER_WALL, BUILDING_DRILL, BUILDING_ELECTRIC_TURRET, BUILDING_IRON_WALL, BUILDING_TURRET, ENV_WALL_GRASS, ENV_WALL_STONE, UNIT_BUG, UNIT_DRONE } from '../config';

/**
 * Đường dẫn sprite thực thể trong thư mục asset public (bộ asset người dùng cung cấp).
 * Ảnh gốc 512×512, khi vẽ co về kích thước thực thể (số ô × TILE_SIZE).
 * Băng chuyền (BUILDING_BANNER) có sprite — xoay theo rotation khi vẽ.
 */
export const ENTITY_TEXTURE_URLS: Record<number, string> = {
  [BUILDING_CORE]: './assets/entities/buildings/core_3x3.png',
  [BUILDING_TURRET]: './assets/entities/buildings/turret_1x1.png',
  [BUILDING_ELECTRIC_TURRET]: './assets/entities/buildings/arc_turret_1x1.png',
  [BUILDING_DRILL]: './assets/entities/buildings/drill_2x2.png',
  [BUILDING_IRON_WALL]: './assets/entities/buildings/iron_wall_1x1.png',
  [BUILDING_COPPER_WALL]: './assets/entities/buildings/copper_wall_1x1.png',
  [BUILDING_BANNER]: './assets/entities/buildings/conveyor_belt_1x1.png',
  [UNIT_DRONE]: './assets/entities/player/drone_1x1.png',
  [UNIT_BUG]: './assets/entities/bot/bug_1x1.png',
};

/**
 * Đường dẫn sprite tường môi trường dạng khối đặc (full block) trong thư mục asset public.
 * Tường bụi cây không có asset nên vẫn vẽ Graphics.
 */
export const ENV_WALL_TEXTURE_URLS: Record<number, string> = {
  [ENV_WALL_STONE]: './assets/terrain/walls/stone_full_1x1.png',
  [ENV_WALL_GRASS]: './assets/terrain/walls/grass_full_1x1.png',
};

/**
 * Tải song song toàn bộ texture trong một bảng đường dẫn vào map tra cứu theo mã.
 * Mục nào tải lỗi thì bỏ qua (không đưa vào map) — phần vẽ sẽ fallback hình vẽ Graphics.
 * @param urls Bảng { mã → đường dẫn sprite }.
 * @returns Map { mã → texture } chỉ chứa các texture tải thành công.
 */
export async function loadTextureMap(urls: Record<number, string>): Promise<Map<number, Texture>> {
  const textures = new Map<number, Texture>();
  await Promise.all(
    Object.entries(urls).map(async ([id, url]) => {
      try {
        textures.set(Number(id), await Assets.load<Texture>(url));
      } catch {
        // Bỏ qua — mã này sẽ fallback hình vẽ Graphics.
      }
    }),
  );
  return textures;
}
