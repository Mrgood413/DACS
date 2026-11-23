import type { BuildPlan, BuildQueues } from '../types';

/**
 * Gom mọi công trình trong hàng chờ của mọi drone thành một danh sách (để kiểm tra chồng chéo khi đặt).
 * @param buildQueues Hàng chờ của từng drone.
 * @returns Danh sách mới chứa mọi plan (chính các object plan, không sao chép).
 */
export function getAllPlans(buildQueues: BuildQueues): BuildPlan[] {
  const plans: BuildPlan[] = [];
  for (const queue of buildQueues.values()) {
    plans.push(...queue);
  }
  return plans;
}
