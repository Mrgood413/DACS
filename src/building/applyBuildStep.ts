import { BUILD_RANGE, BUILD_TIME_SECONDS, TILE_SIZE } from '../config';
import { createConstructionSite } from '../entity/createConstructionSite';
import { getEntityDefinition } from '../entity/getEntityDefinition';
import { getNextEntityId } from '../entity/getNextEntityId';
import type { BuildPlan, Entity, EnvironmentMap } from '../types';
import { applyUnitMovement } from '../unit/applyUnitMovement';
import { getMoveTarget } from '../unit/getMoveTarget';
import { canPlaceBuilding } from './canPlaceBuilding';

/**
 * Cho một drone làm tiếp công trình đầu hàng chờ, trong một khung hình. Sửa tại chỗ drone, queue, entities.
 * 1. Ngoài tầm xây BUILD_RANGE ô (tâm drone → tâm công trình): bay thẳng về phía công trình, chưa xây.
 * 2. Trong tầm mà chưa bắt đầu: kiểm tra lại chỗ trống, tạo công trình 0 máu, thêm vào entities.
 *    Chỗ đã bị chiếm thì bỏ công trình này khỏi hàng chờ.
 * 3. Đang xây: máu tăng maxHp / BUILD_TIME_SECONDS mỗi giây. Đầy máu thì xây xong, bỏ khỏi hàng chờ.
 * @param drone Drone làm việc (bị sửa toạ độ khi bay).
 * @param queue Hàng chờ xây của drone này.
 * @param entities Danh sách thực thể (bị thêm công trình mới, công trình đang xây bị tăng máu).
 * @param map Map môi trường.
 * @param speed Tốc độ bay của drone (ô mỗi giây).
 * @param deltaSeconds Thời gian từ khung hình trước (giây).
 * @returns Công trình vừa được tạo trong khung hình này (để vẽ thêm), hoặc null.
 */
export function applyBuildStep(
  drone: Entity,
  queue: BuildPlan[],
  entities: Entity[],
  map: EnvironmentMap,
  speed: number,
  deltaSeconds: number,
): Entity | null {
  const plan = queue[0];
  if (plan === undefined) {
    return null;
  }

  // Ngoài tầm xây (khoảng cách tâm drone → tâm công trình, tính bằng ô) thì bay lại gần, khung hình này chưa xây.
  const { width, height } = getEntityDefinition(plan.type);
  const planCenterX = plan.x + width / 2;
  const planCenterY = plan.y + height / 2;
  const distance = Math.hypot(drone.x + drone.width / 2 - planCenterX, drone.y + drone.height / 2 - planCenterY);
  if (distance > BUILD_RANGE) {
    const target = getMoveTarget(planCenterX * TILE_SIZE, planCenterY * TILE_SIZE, drone, map);
    applyUnitMovement(drone, target, speed, deltaSeconds);
    return null;
  }

  if (plan.entityId === null) {
    if (!canPlaceBuilding(map, entities, [], plan.type, plan.x, plan.y)) {
      queue.shift();
      return null;
    }
    const site = createConstructionSite(getNextEntityId(entities), plan.type, plan.x, plan.y, plan.rotation);
    entities.push(site);
    plan.entityId = site.id;
    return site;
  }

  const site = entities.find((entity) => entity.id === plan.entityId);
  if (site === undefined) {
    // Công trình đang xây đã biến mất (bị phá) → bỏ.
    queue.shift();
    return null;
  }
  site.hp = Math.min(site.maxHp, site.hp + (site.maxHp / BUILD_TIME_SECONDS) * deltaSeconds);
  if (site.hp >= site.maxHp) {
    site.constructing = false;
    queue.shift();
  }
  return null;
}
