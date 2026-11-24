import { Assets, Texture } from 'pixi.js';
import { BUILDING_BANNER, BUILDING_CORE, BUILDING_COPPER_WALL, BUILDING_DRILL, BUILDING_ELECTRIC_TURRET, BUILDING_IRON_WALL, BUILDING_ROUTER, BUILDING_TURRET, ENV_WALL_BUSH, ENV_WALL_GRASS, ENV_WALL_STONE, UNIT_BUG, UNIT_DRONE } from '../config';

/**
 * Ảnh chính của từng loại thực thể. Mỗi đối tượng có một thư mục riêng trong public/assets.
 * Ảnh gốc phong cách Mindustry (1 ô = 8 px), khi vẽ được co về kích thước thực thể (số ô × TILE_SIZE).
 * Trụ súng: ảnh chính là phần đầu súng (head), phần bệ nằm ở ENTITY_BASE_TEXTURE_URLS.
 * Băng chuyền (BUILDING_BANNER): ảnh chính là khung hình 0 của animation.
 */
export const ENTITY_TEXTURE_URLS: Record<number, string> = {
  [BUILDING_CORE]: './assets/buildings/core/core.png',
  [BUILDING_TURRET]: './assets/buildings/turret/turret_head.png',
  [BUILDING_ELECTRIC_TURRET]: './assets/buildings/arc_turret/arc_turret_head.png',
  [BUILDING_DRILL]: './assets/buildings/drill/drill.png',
  [BUILDING_IRON_WALL]: './assets/buildings/iron_wall/iron_wall.png',
  [BUILDING_COPPER_WALL]: './assets/buildings/copper_wall/copper_wall.png',
  [BUILDING_ROUTER]: './assets/buildings/router/router.png',
  [BUILDING_BANNER]: './assets/buildings/conveyor/conveyor_0.png',
  [UNIT_DRONE]: './assets/units/drone/drone.png',
  [UNIT_BUG]: './assets/units/bug/bug.png',
};

/**
 * Ảnh bệ (vẽ dưới cùng, không xoay) của các thực thể có nhiều lớp — hiện là các trụ súng.
 * Bệ lấy từ block.png của Mindustry Classic.
 */
export const ENTITY_BASE_TEXTURE_URLS: Record<number, string> = {
  [BUILDING_TURRET]: './assets/buildings/turret/turret_base.png',
  [BUILDING_ELECTRIC_TURRET]: './assets/buildings/arc_turret/arc_turret_base.png',
};

/** Khung hình 1 của animation băng chuyền (khung 0 nằm trong ENTITY_TEXTURE_URLS). */
export const CONVEYOR_MOVE_TEXTURE_URLS: Record<number, string> = {
  [BUILDING_BANNER]: './assets/buildings/conveyor/conveyor_1.png',
};

/** Ảnh tường môi trường. Mỗi loại tường có một thư mục riêng trong public/assets/walls. */
export const ENV_WALL_TEXTURE_URLS: Record<number, string> = {
  [ENV_WALL_STONE]: './assets/walls/stone/stone.png',
  [ENV_WALL_GRASS]: './assets/walls/grass/grass.png',
  [ENV_WALL_BUSH]: './assets/walls/bush/bush.png',
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
        const texture = await Assets.load<Texture>(url);
        // Giữ nét pixel art khi phóng to ảnh nhỏ (8 px) lên kích thước ô.
        texture.source.scaleMode = 'nearest';
        textures.set(Number(id), texture);
      } catch {
        // Bỏ qua — mã này sẽ fallback hình vẽ Graphics.
      }
    }),
  );
  return textures;
}
