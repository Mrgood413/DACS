import {
  TERRAIN_COPPER_ORE,
  TERRAIN_GRASS,
  TERRAIN_IRON_ORE,
  TERRAIN_SAND,
  TERRAIN_WATER,
  UNKNOWN_TILE_COLOR,
} from '../config';

/**
 * Bảng màu của từng loại địa hình.
 * - Cỏ: xanh lá (giống hệ thống cũ).
 * - Quặng sắt: nền đá xám ánh kim loại với đốm quặng sắt.
 * - Quặng đồng: nền đá xám với đốm quặng đồng nâu đỏ.
 * - Cát: vàng cát nhạt.
 * - Nước: xanh nước biển.
 */
const TERRAIN_COLORS: Record<number, number> = {
  [TERRAIN_GRASS]: 0x5a9e3f,
  [TERRAIN_IRON_ORE]: 0x9aa2ad,
  [TERRAIN_COPPER_ORE]: 0xc47f4a,
  [TERRAIN_SAND]: 0xd8c078,
  [TERRAIN_WATER]: 0x3d7ea6,
};

/**
 * Trả về màu hiển thị của từng loại địa hình.
 * @param terrainId Mã địa hình (TERRAIN_*).
 * @returns Màu 0xRRGGBB, hoặc UNKNOWN_TILE_COLOR (hồng tím) nếu mã không hợp lệ.
 */
export function getTerrainColor(terrainId: number): number {
  return TERRAIN_COLORS[terrainId] ?? UNKNOWN_TILE_COLOR;
}
