import { ITEM_COPPER, TURRET_MAX_AMMO } from '../config';
import type { ConveyorItems, CoreResources, Entity, ItemType } from '../types';
import type { ConveyorTarget } from './getConveyorTarget';
import { tryAcceptOnConveyor } from './tryAcceptOnConveyor';

/**
 * Giao một vật phẩm từ nguồn tới công trình đích.
 * - Trụ súng: chỉ nhận đồng, mỗi viên +1 đạn (tối đa TURRET_MAX_AMMO); trả false nếu đầy hoặc sai loại.
 * - Nhà chính: nhận mọi loại, cộng vào kho tài nguyên; luôn trả true.
 * - Băng chuyền khác: theo luật nhận của Mindustry (xem tryAcceptOnConveyor);
 *   trả false nếu hết chỗ hoặc vật phẩm đi vào sai hướng.
 * @param target Đích lấy từ getConveyorTarget.
 * @param itemType Loại vật phẩm được giao.
 * @param source Thực thể nguồn (băng chuyền đang chở hoặc máy đào đang đẩy ra).
 * @param conveyorItems Trạng thái item trên các băng chuyền (sửa tại chỗ).
 * @param coreResources Kho nhà chính (sửa tại chỗ).
 * @returns true nếu vật phẩm được nhận, false nếu đích đầy/không nhận/loại sai.
 */
export function tryDeliverItem(
  target: ConveyorTarget,
  itemType: ItemType,
  source: Entity,
  conveyorItems: ConveyorItems,
  coreResources: CoreResources,
): boolean {
  if (target.kind === 'turret') {
    if (itemType !== ITEM_COPPER) {
      return false;
    }
    const turret = target.entity;
    if ((turret.ammo ?? 0) >= (turret.maxAmmo ?? TURRET_MAX_AMMO)) {
      return false;
    }
    turret.ammo = (turret.ammo ?? 0) + 1;
    return true;
  }
  if (target.kind === 'core') {
    coreResources.set(itemType, (coreResources.get(itemType) ?? 0) + 1);
    return true;
  }
  if (target.kind === 'conveyor') {
    return tryAcceptOnConveyor(target.entity, itemType, source, conveyorItems);
  }
  return false;
}
