import { CAMERA_SPEED, TILE_SIZE } from '../config';
import type { Camera, Direction, GameMap } from '../types';

/**
 * Tính vị trí camera mới theo hướng di chuyển cho sẵn. Camera không đi ra ngoài map.
 * @param camera Vị trí camera hiện tại (không bị sửa).
 * @param direction Hướng di chuyển, mỗi thành phần là -1, 0 hoặc 1.
 * @param deltaSeconds Thời gian từ khung hình trước (giây).
 * @param map Map hiện tại.
 * @returns Object Camera mới sau khi di chuyển và giới hạn trong map.
 */
export function moveCamera(camera: Camera, direction: Direction, deltaSeconds: number, map: GameMap): Camera {
  const x = camera.x + direction.x * CAMERA_SPEED * deltaSeconds;
  const y = camera.y + direction.y * CAMERA_SPEED * deltaSeconds;
  return {
    x: Math.max(0, Math.min(map.width * TILE_SIZE, x)),
    y: Math.max(0, Math.min(map.height * TILE_SIZE, y)),
  };
}
