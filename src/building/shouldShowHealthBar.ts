import { HEALTH_BAR_HOVER_RADIUS, TILE_SIZE } from '../config';
import { getEntityDefinition } from '../entity/getEntityDefinition';
import type { Entity, Point } from '../types';

/**
 * Cho biết có vẽ thanh máu dưới công trình này không.
 * - Đơn vị (drone, bug): không.
 * - Công trình đang xây: luôn hiện.
 * - Công trình đã xây xong: chỉ hiện khi chuột cách tâm công trình không quá HEALTH_BAR_HOVER_RADIUS ô.
 * @param entity Thực thể cần xét.
 * @param mouseWorld Vị trí chuột trong thế giới (pixel), hoặc null khi chuột không ở trên map.
 * @returns true nếu cần vẽ thanh máu.
 */
export function shouldShowHealthBar(entity: Entity, mouseWorld: Point | null): boolean {
  if (getEntityDefinition(entity.type).group === 'Unit') {
    return false;
  }
  if (entity.constructing) {
    return true;
  }
  if (mouseWorld === null) {
    return false;
  }
  const centerX = (entity.x + entity.width / 2) * TILE_SIZE;
  const centerY = (entity.y + entity.height / 2) * TILE_SIZE;
  const distance = Math.hypot(mouseWorld.x - centerX, mouseWorld.y - centerY);
  return distance <= HEALTH_BAR_HOVER_RADIUS * TILE_SIZE;
}
