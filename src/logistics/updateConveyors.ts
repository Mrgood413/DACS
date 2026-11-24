import {
  BUILDING_BANNER,
  CONVEYOR_ITEM_SPACING,
  CONVEYOR_SPEED_TILES_PER_SECOND,
} from '../config';
import type { ConveyorItems, CoreResources, Entity } from '../types';
import { getConveyorTarget } from './getConveyorTarget';
import { tryDeliverItem } from './tryDeliverItem';

/**
 * Cập nhật vật phẩm trên mọi băng chuyền theo mô hình "node conveyor" của Mindustry:
 * - Mỗi băng chuyền là một node có hướng; vật phẩm chạy theo đường tâm từ đầu vào (progress 0)
 *   tới đầu ra (progress 1).
 * - Giai đoạn 1: di chuyển mọi vật phẩm tiến về phía đầu ra trên băng chuyền hiện tại.
 * - Giai đoạn 2: vật phẩm đã tới đầu ra được giao cho đích (băng chuyền kế, trụ súng, nhà chính).
 *   Vật phẩm vừa sang băng chuyền mới không bị di chuyển lại trong cùng khung hình (không teleport).
 * - Băng chuyền cùng hướng liền kề nối thành đường thẳng; băng chuyền đổi hướng tạo ngả L/T.
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

  // Giai đoạn 1: di chuyển vật phẩm tiến về phía đầu ra; thu thập vật phẩm ở đầu ra để giao đích.
  type ItemAtEnd = { conveyor: Entity; index: number };
  const itemsAtEnd: ItemAtEnd[] = [];

  for (const conveyor of entities) {
    if (conveyor.type !== BUILDING_BANNER || conveyor.constructing) {
      continue;
    }
    const items = conveyorItems.get(conveyor.id);
    if (items === undefined) {
      continue;
    }

    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      const aheadProgress =
        i === items.length - 1 ? Number.POSITIVE_INFINITY : items[i + 1].progress;
      const maxMove = Math.min(
        aheadProgress - CONVEYOR_ITEM_SPACING - item.progress,
        moveDistance,
      );

      if (maxMove > 0) {
        item.progress = Math.min(1, item.progress + maxMove);
      }
      item.progress = Math.max(0, Math.min(1, item.progress));

      if (item.progress >= 0.9999) {
        itemsAtEnd.push({ conveyor, index: i });
      }
    }
  }

  // Giai đoạn 2: giao vật phẩm ở đầu ra cho đích. Xử lý từ cuối mảng về đầu để xóa chỉ số hợp lệ.
  for (let k = itemsAtEnd.length - 1; k >= 0; k--) {
    const { conveyor, index } = itemsAtEnd[k];
    const items = conveyorItems.get(conveyor.id);
    if (items === undefined || index >= items.length) {
      continue;
    }
    const item = items[index];
    const target = getConveyorTarget(conveyor, entities);
    const delivered = tryDeliverItem(target, item.type, conveyor, conveyorItems, coreResources);
    if (delivered) {
      items.splice(index, 1);
      if (items.length === 0) {
        conveyorItems.delete(conveyor.id);
      }
    }
  }
}
