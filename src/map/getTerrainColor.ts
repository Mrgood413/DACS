import {
  TERRAIN_COPPER_ORE,
  TERRAIN_GRASS,
  TERRAIN_IRON_ORE,
  TERRAIN_SAND,
  TERRAIN_WATER,
  UNKNOWN_TILE_COLOR,
} from '../config';

/**
 * Bảng màu của từng loại địa hình — theo artstyle.png (sprite sheet ID-094).
 * - Cỏ: xanh lá trung bình.
 * - Quặng sắt: nền đá xám xanh đậm (chi tiết đá sáng vẽ ở drawEnvironmentTiles).
 * - Quặng đồng: nền đất nâu (chi tiết cục quặng cam vẽ ở drawEnvironmentTiles).
 * - Cát: kem nhạt.
 * - Nước: xanh ngọc (teal).
 */
const TERRAIN_COLORS: Record<number, number> = {
  [TERRAIN_GRASS]: 0x55a639,
  [TERRAIN_IRON_ORE]: 0x454e5c,
  [TERRAIN_COPPER_ORE]: 0x6e4a33,
  [TERRAIN_SAND]: 0xf2e3b3,
  [TERRAIN_WATER]: 0x1f8fa0,
};

/**
 * Trả về màu hiển thị của từng loại địa hình.
 * @param terrainId Mã địa hình (TERRAIN_*).
 * @returns Màu 0xRRGGBB, hoặc UNKNOWN_TILE_COLOR (hồng tím) nếu mã không hợp lệ.
 */
export function getTerrainColor(terrainId: number): number {
  return TERRAIN_COLORS[terrainId] ?? UNKNOWN_TILE_COLOR;
}
