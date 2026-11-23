import type { BuildGhost, BuildQueues } from '../types';
import { getAllPlans } from './getAllPlans';

/**
 * Tạo bóng mờ cho các công trình đang chờ mà drone chưa bắt đầu xây.
 * Công trình đã bắt đầu xây (entityId khác null) không cần bóng vì đã có hình thật đang xây.
 * @param buildQueues Hàng chờ của từng drone.
 * @returns Danh sách bóng (luôn hợp lệ).
 */
export function getPlanGhosts(buildQueues: BuildQueues): BuildGhost[] {
  const ghosts: BuildGhost[] = [];
  for (const plan of getAllPlans(buildQueues)) {
    if (plan.entityId === null) {
      ghosts.push({ type: plan.type, x: plan.x, y: plan.y, rotation: plan.rotation, valid: true, blockedTiles: [] });
    }
  }
  return ghosts;
}
