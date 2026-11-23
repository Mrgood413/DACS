import { getEntityDefinition } from '../entity/getEntityDefinition';
import type { BuildQueues, Entity, PlanCancelResult, Point } from '../types';

/**
 * Huỷ công trình trong hàng chờ nằm dưới ô được bấm (sửa tại chỗ buildQueues và entities).
 * Nếu công trình đó đang xây dở (chưa xong) thì xoá luôn nó khỏi entities. Công trình đã xây xong không bị đụng tới.
 * Hàng chờ của drone trở thành rỗng thì bị xoá khỏi buildQueues.
 * @param buildQueues Hàng chờ của từng drone.
 * @param entities Danh sách thực thể.
 * @param tile Ô được bấm.
 * @returns cancelled = true nếu có công trình bị huỷ; removedEntityId = id công trình đang xây dở bị xoá (để xoá hình), hoặc null.
 */
export function applyCancelPlanAt(buildQueues: BuildQueues, entities: Entity[], tile: Point): PlanCancelResult {
  for (const [droneId, queue] of buildQueues) {
    for (let i = 0; i < queue.length; i++) {
      const plan = queue[i];
      if (plan === undefined) {
        continue;
      }
      const { width, height } = getEntityDefinition(plan.type);
      const hit = tile.x >= plan.x && tile.x < plan.x + width && tile.y >= plan.y && tile.y < plan.y + height;
      if (!hit) {
        continue;
      }

      queue.splice(i, 1);
      if (queue.length === 0) {
        buildQueues.delete(droneId);
      }

      let removedEntityId: number | null = null;
      if (plan.entityId !== null) {
        const index = entities.findIndex((entity) => entity.id === plan.entityId);
        const site = entities[index];
        if (site !== undefined && site.constructing) {
          entities.splice(index, 1);
          removedEntityId = site.id;
        }
      }
      return { cancelled: true, removedEntityId };
    }
  }
  return { cancelled: false, removedEntityId: null };
}
