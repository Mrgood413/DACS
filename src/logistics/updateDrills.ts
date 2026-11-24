import { BUILDING_DRILL } from '../config';
import type { ConveyorItems, DrillAccumulators, Entity, EnvironmentMap } from '../types';
import { findConveyorAt } from './findConveyorAt';
import { getDrillOutput } from './getDrillOutput';
import { tryAcceptOnConveyor } from './tryAcceptOnConveyor';

/**
 * Cho mọi máy đào sản xuất vật phẩm theo số ô quặng bên dưới (mỗi ô = 1 item/giây).
 * Item được đẩy ra một băng chuyền ngẫu nhiên nằm ở cạnh máy đào, theo luật nhận của băng chuyền
 * (không nhận băng hướng vào máy). Nếu không có băng chuyền nhận được thì tích lũy thời gian
 * (tối đa 1 item) để đẩy khi có chỗ.
 * @param entities Danh sách thực thể.
 * @param map Map môi trường.
 * @param accumulators Bộ đếm thời gian sản xuất (sửa tại chỗ).
 * @param conveyorItems Item trên băng chuyền (sửa tại chỗ).
 * @param deltaSeconds Thời gian khung hình (giây).
 * @param random Hàm ngẫu nhiên [0,1) — truyền vào để test được (mặc định Math.random).
 */
export function updateDrills(
  entities: Entity[],
  map: EnvironmentMap,
  accumulators: DrillAccumulators,
  conveyorItems: ConveyorItems,
  deltaSeconds: number,
  random: () => number = Math.random,
): void {
  for (const drill of entities) {
    if (drill.type !== BUILDING_DRILL || drill.constructing) {
      continue;
    }
    const output = getDrillOutput(drill, map, entities);
    if (output.itemsPerSecond <= 0) {
      accumulators.delete(drill.id);
      continue;
    }
    // Tích lũy, tối đa 1 item để không tạo hàng đợi vô hạn khi không có chỗ đẩy.
    const value = Math.min(1, (accumulators.get(drill.id) ?? 0) + output.itemsPerSecond * deltaSeconds);
    if (value < 1 || output.outputTiles.length === 0) {
      accumulators.set(drill.id, value);
      continue;
    }
    // Thử các cạnh theo thứ tự ngẫu nhiên cho tới khi có băng chuyền nhận được item.
    const candidates = [...output.outputTiles];
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    let delivered = false;
    for (const tile of candidates) {
      const conveyor = findConveyorAt(entities, tile.x, tile.y);
      if (conveyor === undefined) {
        continue;
      }
      if (tryAcceptOnConveyor(conveyor, output.itemType, drill, conveyorItems)) {
        delivered = true;
        break;
      }
    }
    accumulators.set(drill.id, delivered ? value - 1 : 1);
  }
}
