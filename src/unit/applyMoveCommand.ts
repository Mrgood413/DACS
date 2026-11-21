import type { Entity, MoveOrders } from '../types';
import { getMoveTarget } from './getMoveTarget';

/**
 * Ra lệnh cho các đơn vị đang được chọn di chuyển tới điểm người chơi bấm chuột phải (sửa tại chỗ orders).
 * Lệnh mới thay lệnh cũ của cùng đơn vị. Id không tìm thấy trong entities thì bỏ qua.
 * @param orders Danh sách lệnh đang chờ (bị thêm/ghi đè).
 * @param entities Danh sách thực thể.
 * @param selectedIds Id các đơn vị đang được chọn.
 * @param worldX Toạ độ x điểm bấm trong thế giới (pixel).
 * @param worldY Toạ độ y điểm bấm trong thế giới (pixel).
 * @param map Map hiện tại (chỉ cần width, height theo ô).
 */
export function applyMoveCommand(
  orders: MoveOrders,
  entities: Entity[],
  selectedIds: number[],
  worldX: number,
  worldY: number,
  map: { width: number; height: number },
): void {
  for (const id of selectedIds) {
    const entity = entities.find((candidate) => candidate.id === id);
    if (entity !== undefined) {
      orders.set(id, getMoveTarget(worldX, worldY, entity, map));
    }
  }
}
