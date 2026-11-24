import { UNIT_BUG, ENEMY_MAX_HP } from '../config';
import type { Entity } from '../types';
import { getEntityDefinition } from './getEntityDefinition';
import { getNextEntityId } from './getNextEntityId';

/**
 * Tạo một entity enemy (bug) tại vị trí (x, y). Toạ độ có thể âm hoặc >= map width/height
 * vì enemy spawn ngoài ranh giới bản đồ.
 * @param entities Danh sách thực thể hiện có (dùng để cấp id mới).
 * @param x Ô góc trên-trái theo chiều ngang (có thể nằm ngoài ranh giới).
 * @param y Ô góc trên-trái theo chiều dọc (có thể nằm ngoài ranh giới).
 * @param spawnNodeId ID của spawn node mà enemy xuất từ đó.
 * @returns Entity enemy mới, trạng thái 'spawning', mục tiêu là Core (id 1).
 */
export function createEnemy(
  entities: Entity[],
  x: number,
  y: number,
  spawnNodeId: number,
): Entity {
  const definition = getEntityDefinition(UNIT_BUG);
  const entity: Entity = {
    id: getNextEntityId(entities),
    type: UNIT_BUG,
    x,
    y,
    width: definition.width,
    height: definition.height,
    rotation: 0,
    hp: ENEMY_MAX_HP,
    maxHp: ENEMY_MAX_HP,
    constructing: false,
    enemyState: 'spawning',
    enemyTargetId: 1, // Core luôn có id = 1 (tạo trong createStartingEntities)
    enemyPath: [],
    enemyPathIndex: 0,
    enemyLastAttackTime: 0,
    enemySpawnNodeId: spawnNodeId,
  };
  return entity;
}
