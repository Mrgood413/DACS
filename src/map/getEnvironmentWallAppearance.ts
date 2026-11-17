import { ENV_WALL_BUSH, ENV_WALL_GRASS, ENV_WALL_NONE, ENV_WALL_STONE } from '../config';
import type { WallAppearance } from '../types';

/**
 * Bảng diện mạo của từng loại tường môi trường — theo artstyle.png (sprite sheet ID-094).
 * - Tường đá (Rock Wall): hòn đá xám xanh tối.
 * - Tường cỏ (Overgrown Wall): khối vuông phủ rêu xanh.
 * - Tường bụi cây (Dusty Bush): bụi cây xanh lá.
 */
const WALL_APPEARANCES: Record<number, WallAppearance> = {
  [ENV_WALL_STONE]: { shape: 'stone', color: 0x3c434d },
  [ENV_WALL_GRASS]: { shape: 'grass', color: 0x4e7a33 },
  [ENV_WALL_BUSH]: { shape: 'bush', color: 0x5d8a3a },
};

/**
 * Lấy thông tin hiển thị của tường môi trường.
 * @param wallId Mã tường (ENV_WALL_*).
 * @returns WallAppearance của tường, hoặc null nếu là ENV_WALL_NONE / mã không hợp lệ.
 */
export function getEnvironmentWallAppearance(wallId: number): WallAppearance | null {
  return WALL_APPEARANCES[wallId] ?? null;
}
