import { UNIT_BUG } from '../config';
import { createEnemy } from '../entity/createEnemy';
import type { Entity, EnvironmentMap } from '../types';
import type {
  EnemySpawnInfo,
  EnemySpawnState,
  SpawnNode,
} from './types';

/**
 * Tạo một enemy tại SpawnNode và thêm vào danh sách entities.
 * Enemy ban đầu ở trạng thái 'spawning', sẽ được enemyAI chuyển sang 'entering' rồi 'seeking'.
 * @param entities Danh sách thực thể (bị sửa tại chỗ: thêm enemy mới).
 * @param spawnNode SpawnNode mà enemy xuất từ đó.
 * @param enemyType Loại kẻ địch ('Bug' hoặc 'Tank').
 * @returns Entity enemy mới.
 */
export function spawnEnemyAtNode(
  entities: Entity[],
  spawnNode: SpawnNode,
  enemyType: 'Bug' | 'Tank',
): Entity {
  const { x, y } = spawnNode.position;

  const enemy = createEnemy(entities, x, y, spawnNode.id);

  (enemy as Entity & { enemySpawnInfo?: EnemySpawnInfo }).enemySpawnInfo = {
    spawnNodeId: spawnNode.id,
    spawnState: 'spawning' as EnemySpawnState,
  };

  entities.push(enemy);
  return enemy;
}

/** Lấy thông tin spawn của enemy (nếu có). */
export function getEnemySpawnInfo(
  enemy: Entity,
): EnemySpawnInfo | undefined {
  return (enemy as Entity & { enemySpawnInfo?: EnemySpawnInfo }).enemySpawnInfo;
}

/** Thiết lập trạng thái spawn của enemy. */
export function setEnemySpawnState(
  enemy: Entity,
  state: EnemySpawnState,
): void {
  const info = getEnemySpawnInfo(enemy);
  if (info) {
    info.spawnState = state;
    if (state === 'entering') {
      info.enteringStartTime = performance.now() / 1000;
    }
  }
}
