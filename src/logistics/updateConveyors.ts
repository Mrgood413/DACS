import {
  BUILDING_BANNER,
  CONVEYOR_ITEM_SPACING,
  CONVEYOR_LATERAL_RECENTER_PER_SECOND,
  CONVEYOR_SPEED_TILES_PER_SECOND,
} from '../config';
import type { ConveyorItems, CoreResources, Entity } from '../types';
import { getConveyorTarget } from './getConveyorTarget';
import { tryDeliverItem } from './tryDeliverItem';

/**
 * Cập nhật vật phẩm trên mọi băng chuyền theo đúng cơ chế Mindustry:
 * - Mỗi băng chuyền chứa nhiều vật phẩm, giữ khoảng cách CONVEYOR_ITEM_SPACING.
 * - Duyệt từ vật phẩm trước mặt (progress lớn nhất) về phía sau; vật phẩm trước mặt nhường đường trước.
 * - Vật phẩm tới đầu ra (progress ≈ 1) được giao cho đích (băng chuyền kế, trụ súng, nhà chính).
 * - Vật phẩm lệch cạnh (vào từ bên) dần trôi về chính giữa khi di chuyển.
 * @param entities Danh sách thực thể.
 * @param conveyorItems Vật phẩm trên băng chuyền (sửa tại chỗ).
 * @param coreResources Kho nhà chính (sửa tại chỗ).
 * @param deltaSeconds Thời gian khung hình (giây).
 */
export function updateConveyors(
  entities: Entity[],
  conveyorItems: ConveyorItems,
  coreResources: CoreResources,
  deltaSeconds: number,
): void {
  const moveDistance = CONVEYOR_SPEED_TILES_PER_SECOND * deltaSeconds;
  const recenterDistance = CONVEYOR_LATERAL_RECENTER_PER_SECOND * deltaSeconds;

  for (const conveyor of entities) {
    if (conveyor.type !== BUILDING_BANNER || conveyor.constructing) {
      continue;
    }
    const items = conveyorItems.get(conveyor.id);
    if (items === undefined) {
      continue;
    }
    const target = getConveyorTarget(conveyor, entities);
    let removeFromIndex = -1;

    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      const aheadProgress = i === items.length - 1 ? Number.POSITIVE_INFINITY : items[i + 1].progress;
      const maxMove = Math.min(aheadProgress - CONVEYOR_ITEM_SPACING - item.progress, moveDistance);

      if (maxMove > 0) {
        item.progress = Math.min(1, item.progress + maxMove);
        if (item.lateral > 0) {
          item.lateral = Math.max(0, item.lateral - recenterDistance);
        } else {
          item.lateral = Math.min(0, item.lateral + recenterDistance);
        }
      }
      item.progress = Math.max(0, Math.min(1, item.progress));

      if (
        item.progress >= 0.9999 &&
        tryDeliverItem(target, item.type, conveyor, conveyorItems, coreResources)
      ) {
        // Vòng lặp đi từ cuối mảng về đầu nên giá trị cuối cùng là chỉ số nhỏ nhất.
        removeFromIndex = i;
      }
    }

    if (removeFromIndex >= 0) {
      items.splice(removeFromIndex);
      if (items.length === 0) {
        conveyorItems.delete(conveyor.id);
      }
    }
  }
}
