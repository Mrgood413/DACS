import { BUILDING_ROUTER, ROUTER_CAPACITY } from '../config';
import type { ConveyorItems, Entity } from '../types';
import { findConveyorAt } from './findConveyorAt';
import { getConveyorDirection } from './getConveyorDirection';
import { tryAcceptOnConveyor } from './tryAcceptOnConveyor';

/** Xác suất dump ngẫu nhiên theo hướng rotation hiện tại (giống Mindustry 0.35). */
const ROUTER_RANDOM_DUMP_CHANCE = 0.35;

/**
 * Cập nhật mọi router theo đúng nghiệp vụ Mindustry Router (Router.java):
 * - Router chứa item trong kho (tối đa ROUTER_CAPACITY).
 * - Mỗi khung hình, nếu có item:
 *   + Nếu hướng item vừa đến (routerExtra) khác rotation, hoặc ngẫu nhiên 35% → dump theo hướng rotation.
 *   + Sau đó LUÔN xoay rotation sang hướng kế tiếp (0→1→2→3→0), dù dump có thành công hay không.
 * - Như vậy item được chia đều tuần tự tới các conveyor ở 4 phía (round-robin).
 * - Nếu không có conveyor phía đầu rotation hiện tại, tryDump 실패, item giữ nguyên, nhưng rotation vẫn xoay.
 * @param entities Danh sách thực thể.
 * @param conveyorItems Vật phẩm trên băng chuyền (sửa tại chỗ).
 * @param deltaSeconds Thời gian khung hình (giây).
 */
export function updateRouters(
  entities: Entity[],
  conveyorItems: ConveyorItems,
  deltaSeconds: number,
): void {
  const random = Math.random;

  for (const router of entities) {
    if (router.type !== BUILDING_ROUTER || router.constructing) {
      continue;
    }
    const inventory = router.routerInventory;
    if (inventory === undefined || inventory.size === 0) {
      continue;
    }

    let rotation = ((Math.round(router.rotation) % 4) + 4) % 4;

    // Quyết định có dump theo hướng rotation hay không (giống Mindustry):
    // dump nếu hướng item đến (extra) khác rotation, hoặc ngẫu nhiên 35%.
    const routerExtra = router.routerExtra ?? -1;
    const shouldDump = routerExtra !== rotation || random() < ROUTER_RANDOM_DUMP_CHANCE;

    if (shouldDump) {
      const dir = getConveyorDirection(rotation);
      const target = findConveyorAt(entities, router.x + dir.x, router.y + dir.y);
      if (target !== undefined) {
        // Lấy loại vật phẩm đầu tiên trong kho.
        let firstType: number | undefined;
        for (const [type, count] of inventory) {
          if (count > 0) {
            firstType = type;
            break;
          }
        }
        if (firstType !== undefined && tryAcceptOnConveyor(target, firstType, router, conveyorItems)) {
          const remaining = inventory.get(firstType)! - 1;
          if (remaining <= 0) {
            inventory.delete(firstType);
          } else {
            inventory.set(firstType, remaining);
          }
          // Ghi nhớ hướng vừa dump (giống Mindustry handleItem sets extra).
          router.routerExtra = rotation;
        }
      }
    }

    // LUÔN xoay hướng dump sang phía kế tiếp, dù dump có thành công hay không (giống Mindustry).
    router.rotation = ((rotation + 1) % 4 + 4) % 4;
  }
}
