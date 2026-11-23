import type { BuildGhost, BuildPlan } from '../types';

/**
 * Đưa các bóng hợp lệ vào cuối hàng chờ xây của drone (sửa tại chỗ queue). Bóng không hợp lệ bị bỏ qua.
 * @param queue Hàng chờ xây của một drone.
 * @param ghosts Bóng từ getBuildPreview.
 * @returns Số công trình được thêm vào hàng chờ.
 */
export function applyPlacePlans(queue: BuildPlan[], ghosts: BuildGhost[]): number {
  let added = 0;
  for (const ghost of ghosts) {
    if (ghost.valid) {
      queue.push({ type: ghost.type, x: ghost.x, y: ghost.y, rotation: ghost.rotation, entityId: null });
      added++;
    }
  }
  return added;
}
