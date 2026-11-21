import type { Entity, Point } from '../types';

/**
 * Cho đơn vị bay thẳng về đích với tốc độ cho trước (sửa tại chỗ entity.x, entity.y).
 * Drone bay nên không cần tìm đường, đi xuyên qua địa hình và công trình.
 * @param entity Đơn vị đang di chuyển (bị sửa toạ độ).
 * @param target Ô đích (toạ độ ô góc trên-trái, từ getMoveTarget).
 * @param speed Tốc độ (ô mỗi giây).
 * @param deltaSeconds Thời gian từ khung hình trước (giây).
 * @returns true nếu đã tới đích (toạ độ được đặt đúng bằng đích), false nếu còn đang đi.
 */
export function applyUnitMovement(entity: Entity, target: Point, speed: number, deltaSeconds: number): boolean {
  const dx = target.x - entity.x;
  const dy = target.y - entity.y;
  const distance = Math.hypot(dx, dy);
  const step = speed * deltaSeconds;

  if (distance <= step) {
    entity.x = target.x;
    entity.y = target.y;
    return true;
  }

  entity.x += (dx / distance) * step;
  entity.y += (dy / distance) * step;
  return false;
}
