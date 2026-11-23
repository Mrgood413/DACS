import { getEntityDefinition } from '../entity/getEntityDefinition';
import type { BuildGhost, BuildPlan, Entity, EntityType, EnvironmentMap, Point } from '../types';
import { getBlockedTiles } from './getBlockedTiles';
import { getBuildLineOrigins } from './getBuildLineOrigins';
import { getPlacementOrigin } from './getPlacementOrigin';

/**
 * Tính các bóng công trình sẽ được đặt: một bóng ở ô con trỏ, hoặc cả một hàng nếu đang giữ Shift kéo.
 * Mỗi bóng có danh sách ô bị chặn (blockedTiles, để vẽ ô đỏ) và cờ valid (= không ô nào bị chặn).
 * Các bóng trong cùng hàng không được chồng lên nhau.
 * @param map Map môi trường.
 * @param entities Danh sách thực thể hiện có.
 * @param plans Mọi công trình đang chờ xây (của mọi drone).
 * @param type Mã loại công trình đang chọn trong menu.
 * @param startTile Ô bắt đầu kéo khi giữ Shift, hoặc null nếu chỉ đặt một cái.
 * @param endTile Ô dưới con trỏ hiện tại.
 * @param rotation Hướng xoay 0–3 (phím R). Công trình không xoay được thì luôn là 0.
 * @returns Danh sách bóng theo thứ tự sẽ xây.
 */
export function getBuildPreview(
  map: EnvironmentMap,
  entities: Entity[],
  plans: BuildPlan[],
  type: EntityType,
  startTile: Point | null,
  endTile: Point,
  rotation = 0,
): BuildGhost[] {
  const endOrigin = getPlacementOrigin(endTile, type);
  const { width, height, rotatable } = getEntityDefinition(type);
  const ghostRotation = rotatable ? ((rotation % 4) + 4) % 4 : 0;
  const origins =
    startTile === null
      ? [endOrigin]
      : getBuildLineOrigins(getPlacementOrigin(startTile, type), endOrigin, Math.max(width, height));

  // Bóng hợp lệ trước đó trong cùng hàng cũng tính là "đã chiếm chỗ".
  const taken: BuildPlan[] = [...plans];
  const ghosts: BuildGhost[] = [];
  for (const origin of origins) {
    const blockedTiles = getBlockedTiles(map, entities, taken, type, origin.x, origin.y);
    const valid = blockedTiles.length === 0;
    ghosts.push({ type, x: origin.x, y: origin.y, rotation: ghostRotation, valid, blockedTiles });
    if (valid) {
      taken.push({ type, x: origin.x, y: origin.y, rotation: ghostRotation, entityId: null });
    }
  }
  return ghosts;
}
