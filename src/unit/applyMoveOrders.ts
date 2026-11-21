import type { Entity, MoveOrders } from '../types';
import { applyUnitMovement } from './applyUnitMovement';

/**
 * Cho mọi đơn vị có lệnh di chuyển đi thêm một bước. Gọi mỗi khung hình.
 * Đơn vị tới đích (hoặc không còn tồn tại) thì lệnh của nó bị xoá khỏi orders (sửa tại chỗ).
 * @param entities Danh sách thực thể (toạ độ đơn vị bị sửa).
 * @param orders Danh sách lệnh đang chờ.
 * @param speed Tốc độ (ô mỗi giây).
 * @param deltaSeconds Thời gian từ khung hình trước (giây).
 */
export function applyMoveOrders(entities: Entity[], orders: MoveOrders, speed: number, deltaSeconds: number): void {
  for (const [id, target] of orders) {
    const entity = entities.find((candidate) => candidate.id === id);
    if (entity === undefined) {
      orders.delete(id);
      continue;
    }
    const arrived = applyUnitMovement(entity, target, speed, deltaSeconds);
    if (arrived) {
      orders.delete(id);
    }
  }
}
