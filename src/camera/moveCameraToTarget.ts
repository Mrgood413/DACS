import { CAMERA_SPEED, TILE_SIZE } from '../config';
import type { Camera, CameraTarget } from '../types';

/**
 * Di chuyển camera mượt đến vị trí đích sau khi người chơi click vào bản đồ.
 * Mỗi lần gọi đi được tối đa CAMERA_SPEED * deltaSeconds pixel, không vượt quá đích, không ra ngoài map.
 * @param camera Vị trí camera hiện tại (không bị sửa).
 * @param target Đích đến trên map (pixel).
 * @param deltaSeconds Thời gian từ khung hình trước (giây).
 * @param map Map hiện tại (chỉ cần width, height).
 * @returns Object Camera mới sau khi di chuyển.
 */
export function moveCameraToTarget(camera: Camera, target: CameraTarget, deltaSeconds: number, map: { width: number; height: number }): Camera {
  const dx = target.x - camera.x;
  const dy = target.y - camera.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) {
    return { x: camera.x, y: camera.y };
  }
  const step = Math.min(CAMERA_SPEED * deltaSeconds, distance);
  const x = camera.x + (dx / distance) * step;
  const y = camera.y + (dy / distance) * step;
  return {
    x: Math.max(0, Math.min(map.width * TILE_SIZE, x)),
    y: Math.max(0, Math.min(map.height * TILE_SIZE, y)),
  };
}
