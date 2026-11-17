import { ENV_WALL_BUSH, ENV_WALL_GRASS, ENV_WALL_NONE, ENV_WALL_STONE } from '../config';
import type { WallAppearance } from '../types';

/**
 * Bảng diện mạo của từng loại tường môi trường.
 * - Tường đá: cụm đá xám đậm hơn nền.
 * - Tường cỏ: bụi cỏ xanh đậm hơn nền cỏ.
 * - Tường bụi cây: bụi cây xanh sẫm có cụm quả/chồi sáng.
 */
const WALL_APPEARANCES: Record<number, WallAppearance> = {
  [ENV_WALL_STONE]: { shape: 'stone', color: 0x8a8f98 },
  [ENV_WALL_GRASS]: { shape: 'grass', color: 0x3f7a2c },
  [ENV_WALL_BUSH]: { shape: 'bush', color: 0x2c5d22 },
};

/**
 * Lấy thông tin hiển thị của tường môi trường.
 * @param wallId Mã tường (ENV_WALL_*).
 * @returns WallAppearance của tường, hoặc null nếu là ENV_WALL_NONE / mã không hợp lệ.
 */
export function getEnvironmentWallAppearance(wallId: number): WallAppearance | null {
  return WALL_APPEARANCES[wallId] ?? null;
}
