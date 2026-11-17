import type { Camera } from '../types';

/**
 * Dời toàn bộ thế giới game sao cho điểm camera nằm ở chính giữa màn hình.
 * @param world Thứ cần dời, hàm gán world.x và world.y.
 * @param camera Vị trí camera.
 * @param screenWidth Chiều rộng màn hình (pixel).
 * @param screenHeight Chiều cao màn hình (pixel).
 */
export function applyCamera(world: { x: number; y: number }, camera: Camera, screenWidth: number, screenHeight: number): void {
  world.x = Math.round(screenWidth / 2 - camera.x);
  world.y = Math.round(screenHeight / 2 - camera.y);
}
