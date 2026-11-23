import type { Entity } from '../types';

/**
 * Cấp id cho thực thể mới: lớn hơn mọi id đang có.
 * @param entities Danh sách thực thể hiện có.
 * @returns Id lớn nhất + 1; danh sách rỗng thì trả 1.
 */
export function getNextEntityId(entities: Entity[]): number {
  let maxId = 0;
  for (const entity of entities) {
    if (entity.id > maxId) {
      maxId = entity.id;
    }
  }
  return maxId + 1;
}
