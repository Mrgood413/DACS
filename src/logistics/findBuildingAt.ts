import { getEntityDefinition } from '../entity/getEntityDefinition';
import type { Entity, EntityType, Point } from '../types';

/**
 * Tìm công trình phủ lên ô (x, y) (xét toàn bộ footprint, không chỉ ô góc trên-trái).
 * Chỉ xét thực thể nhóm Architecture, kể cả đang xây.
 * @param entities Danh sách thực thể.
 * @param x Toạ độ ô ngang.
 * @param y Toạ độ ô dọc.
 * @param type Mã loại cần lọc (tuỳ chọn).
 * @returns Thực thể tìm thấy hoặc undefined.
 */
export function findBuildingAt(entities: Entity[], x: number, y: number, type?: EntityType): Entity | undefined {
  return entities.find(
    (entity) =>
      (type === undefined || entity.type === type) &&
      x >= entity.x &&
      x < entity.x + entity.width &&
      y >= entity.y &&
      y < entity.y + entity.height &&
      getEntityDefinition(entity.type).group === 'Architecture',
  );
}
