import { ENEMY_MAX_SPAWNS, ENEMY_SPAWN_INTERVAL, UNIT_BUG } from '../config';
import { createEnemy } from '../entity/createEnemy';
import { getRandomSpawnNode, getSpawnPosition } from '../map/enemySpawnNode';
import { updateEnemyAI } from '../enemy/enemyAI';
import type { Entity, EnvironmentMap } from '../types';

/**
 * Cập nhật toàn bộ enemy trong một khung hình:
 * 1. Spawn enemy mới nếu chưa đủ số lượng tối đa (ENEMY_MAX_SPAWNS).
 * 2. Cập nhật AI (di chuyển, tấn công) cho mỗi enemy đang sống.
 * @param entities Danh sách thực thể (bị sửa tại chỗ: thêm enemy mới, cập nhật enemy cũ).
 * @param map Map môi trường.
 * @param enemySpawnAccumulator Thời gian tích luỹ cho spawn (giây), bị sửa tại chỗ.
 * @param deltaSeconds Thời gian khung hình (giây).
 * @returns enemySpawnAccumulator mới (đã trừ ENEMY_SPAWN_INTERVAL nếu vừa spawn).
 */
export function updateEnemies(
  entities: Entity[],
  map: EnvironmentMap,
  enemySpawnAccumulator: number,
  deltaSeconds: number,
): number {
  // Luôn tăng accumulator (dù đã đủ số lượng tối đa) để spawn ngay khi có chỗ trống.
  enemySpawnAccumulator += deltaSeconds;

  // Spawn enemy mới nếu chưa đủ số lượng tối đa và đã đủ thời gian spawn.
  const currentEnemies = entities.filter((e) => e.type === UNIT_BUG);
  if (currentEnemies.length < ENEMY_MAX_SPAWNS && enemySpawnAccumulator >= ENEMY_SPAWN_INTERVAL) {
    enemySpawnAccumulator = 0;
    const node = getRandomSpawnNode();
    const pos = getSpawnPosition(node, map.width, map.height);
    const newEnemy = createEnemy(entities, pos.x, pos.y, entities.length + 1);
    entities.push(newEnemy);
  }

  // Cập nhật AI cho mỗi enemy.
  for (const enemy of entities) {
    if (enemy.type === UNIT_BUG) {
      updateEnemyAI(enemy, entities, map, deltaSeconds);
    }
  }

  return enemySpawnAccumulator;
}
