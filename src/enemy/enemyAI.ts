import { ENEMY_ATTACK_INTERVAL, ENEMY_ATTACK_RANGE, ENEMY_DAMAGE, ENEMY_SPEED } from '../config';
import { findPath } from '../pathfinding/findPath';
import type { Entity, EnvironmentMap, Point } from '../types';

/**
 * Cập nhật AI của một enemy trong một khung hình.
 * State machine: 'spawning' → 'seeking' → 'moving' → 'attacking'.
 * - 'spawning': vừa xuất hiện, chuyển sang 'seeking' ngay lập tức.
 * - 'seeking': tìm đường đến Core (gọi findPath). Nếu tìm được đường → 'moving'.
 *   Nếu không tìm được đường (bị chặn hẳn), ở lại 'seeking' và thử lại sau.
 * - 'moving': di chuyển theo enemyPath từng ô một. Khi đến cuối path → 'attacking'.
 * - 'attacking': nếu trong tầm tấn công Core → giảm hp Core theo ENEMY_ATTACK_INTERVAL.
 *   Nếu ra ngoài tầm tấn công → quay lại 'seeking'.
 * @param enemy Entity enemy cần cập nhật (bị sửa tại chỗ).
 * @param entities Danh sách tất cả thực thể (để tìm Core và kiểm tra va chạm).
 * @param map Map môi trường.
 * @param deltaSeconds Thời gian khung hình (giây).
 */
export function updateEnemyAI(
  enemy: Entity,
  entities: Entity[],
  map: EnvironmentMap,
  deltaSeconds: number,
): void {
  const core = entities.find((e) => e.type === 1); // BUILDING_CORE = 1
  if (!core) {
    return; // Không có Core, không làm gì
  }

  switch (enemy.enemyState) {
    case 'spawning':
      // Vừa spawn, chuyển sang seeking ngay lập tức.
      enemy.enemyState = 'seeking';
      break;

    case 'seeking': {
      const path = findPath(
        { x: enemy.x, y: enemy.y },
        { x: core.x, y: core.y },
        map,
        entities,
        enemy.id,
      );
      if (path) {
        enemy.enemyPath = path;
        enemy.enemyPathIndex = 0;
        enemy.enemyState = 'moving';
      }
      // Nếu không tìm được đường, ở lại seeking và thử lại sau.
      break;
    }

    case 'moving': {
      const path = enemy.enemyPath ?? [];
      const index = enemy.enemyPathIndex ?? 0;

      if (index >= path.length) {
        // Đã đi hết đường → đã đến Core → chuyển sang attacking.
        enemy.enemyState = 'attacking';
        enemy.enemyLastAttackTime = 0;
        break;
      }

      const target = path[index];
      const dx = target.x - enemy.x;
      const dy = target.y - enemy.y;
      const distance = Math.hypot(dx, dy);
      const step = ENEMY_SPEED * deltaSeconds;

      if (distance <= step) {
        enemy.x = target.x;
        enemy.y = target.y;
        enemy.enemyPathIndex = index + 1;
        // Kiểm tra lại sau khi đã cập nhật enemyPathIndex.
        if (enemy.enemyPathIndex >= path.length) {
          enemy.enemyState = 'attacking';
          enemy.enemyLastAttackTime = 0;
        }
      } else {
        enemy.x += (dx / distance) * step;
        enemy.y += (dy / distance) * step;
      }
      break;
    }

    case 'attacking': {
      const coreCenterX = core.x + core.width / 2;
      const coreCenterY = core.y + core.height / 2;
      const enemyCenterX = enemy.x + enemy.width / 2;
      const enemyCenterY = enemy.y + enemy.height / 2;
      const distance = Math.hypot(coreCenterX - enemyCenterX, coreCenterY - enemyCenterY);

      if (distance <= ENEMY_ATTACK_RANGE) {
        // Trong tầm tấn công → tấn công Core.
        enemy.enemyLastAttackTime = (enemy.enemyLastAttackTime ?? 0) + deltaSeconds;
        if (enemy.enemyLastAttackTime >= ENEMY_ATTACK_INTERVAL) {
          enemy.enemyLastAttackTime = 0;
          core.hp = Math.max(0, core.hp - ENEMY_DAMAGE);
        }
      } else {
        // Ra ngoài tầm tấn công → quay lại seeking để tìm đường mới.
        enemy.enemyState = 'seeking';
      }
      break;
    }
  }
}
