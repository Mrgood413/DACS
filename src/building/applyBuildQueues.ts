import type { BuildQueues, Entity, EnvironmentMap, MoveOrders } from '../types';
import { applyBuildStep } from './applyBuildStep';

/**
 * Cho mọi drone làm tiếp hàng chờ xây của mình. Gọi mỗi khung hình.
 * Drone đang có lệnh di chuyển (người chơi bấm chuột phải) thì tạm dừng xây; tới nơi xong sẽ tự bay lại xây tiếp.
 * Drone không còn tồn tại thì xoá hàng chờ của nó. Hàng chờ rỗng thì xoá khỏi buildQueues.
 * @param buildQueues Hàng chờ của từng drone (sửa tại chỗ).
 * @param entities Danh sách thực thể (sửa tại chỗ — xem applyBuildStep).
 * @param moveOrders Lệnh di chuyển đang chờ.
 * @param map Map môi trường.
 * @param speed Tốc độ bay của drone (ô mỗi giây).
 * @param deltaSeconds Thời gian từ khung hình trước (giây).
 * @returns Danh sách công trình vừa được tạo trong khung hình này (để vẽ thêm).
 */
export function applyBuildQueues(
  buildQueues: BuildQueues,
  entities: Entity[],
  moveOrders: MoveOrders,
  map: EnvironmentMap,
  speed: number,
  deltaSeconds: number,
): Entity[] {
  const created: Entity[] = [];
  for (const [droneId, queue] of buildQueues) {
    const drone = entities.find((entity) => entity.id === droneId);
    if (drone === undefined || queue.length === 0) {
      buildQueues.delete(droneId);
      continue;
    }
    if (moveOrders.has(droneId)) {
      continue;
    }
    const site = applyBuildStep(drone, queue, entities, map, speed, deltaSeconds);
    if (site !== null) {
      created.push(site);
    }
  }
  return created;
}
