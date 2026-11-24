import {
  BUILDING_ELECTRIC_TURRET,
  BUILDING_TURRET,
  TILE_SIZE,
  TURRET_FIRE_INTERVAL,
  TURRET_RANGE,
  UNIT_BUG,
} from '../config';
import { getEntityCenter } from '../entity/getEntityCenter';
import type { Entity } from '../types';

/**
 * Cập nhật trụ súng: hạ nhiệt độ bắn, nếu có bug trong tầm TURRET_RANGE và còn đạn thì bắn 1 viên.
 * Mỗi phát cách nhau TURRET_FIRE_INTERVAL giây. Không có mục tiêu hoặc hết đạn thì không bắn.
 * @param entities Danh sách thực thể (sửa ammo/cooldown của trụ tại chỗ).
 * @param deltaSeconds Thời gian khung hình (giây).
 */
export function updateTurrets(entities: Entity[], deltaSeconds: number): void {
  const turrets = entities.filter(
    (entity) =>
      (entity.type === BUILDING_TURRET || entity.type === BUILDING_ELECTRIC_TURRET) && !entity.constructing,
  );
  const bugs = entities.filter((entity) => entity.type === UNIT_BUG);
  for (const turret of turrets) {
    turret.cooldown = Math.max(0, (turret.cooldown ?? 0) - deltaSeconds);
    if (turret.cooldown > 0 || (turret.ammo ?? 0) <= 0) {
      continue;
    }
    const center = getEntityCenter(turret);
    const hasTarget = bugs.some((bug) => {
      const target = getEntityCenter(bug);
      return Math.hypot(target.x - center.x, target.y - center.y) <= TURRET_RANGE * TILE_SIZE;
    });
    if (!hasTarget) {
      continue;
    }
    turret.ammo = (turret.ammo ?? 0) - 1;
    turret.cooldown = TURRET_FIRE_INTERVAL;
  }
}
