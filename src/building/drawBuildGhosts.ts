import { Graphics } from 'pixi.js';
import type { Container, Texture } from 'pixi.js';
import { DEFAULT_MAX_HP, TILE_SIZE, UNBUILDABLE_TILE_ALPHA, UNBUILDABLE_TILE_COLOR } from '../config';
import { drawEntity } from '../entity/drawEntity';
import { getEntityDefinition } from '../entity/getEntityDefinition';
import type { BuildGhost, Entity, EntityType } from '../types';

/**
 * Xoá nội dung cũ rồi vẽ các bóng công trình mờ (hàng chờ xây, hoặc xem trước dưới con trỏ).
 * Bóng không hợp lệ (ghost.valid = false) thì tô đỏ đè lên toàn bộ khối của nó.
 * Chỉ gọi khi danh sách bóng thay đổi. container phải nằm trong lớp thế giới (di chuyển theo camera).
 * @param container Container dùng riêng cho nhóm bóng này.
 * @param ghosts Danh sách bóng.
 * @param alpha Độ mờ của bóng (BUILD_PLAN_ALPHA hoặc BUILD_PREVIEW_ALPHA); ô đỏ dùng độ mờ riêng.
 * @param getTexture Tra ảnh chính theo loại thực thể (tuỳ chọn).
 * @param getBaseTexture Tra ảnh bệ theo loại thực thể (tuỳ chọn).
 */
export function drawBuildGhosts(
  container: Container,
  ghosts: BuildGhost[],
  alpha: number,
  getTexture?: (type: EntityType) => Texture | undefined,
  getBaseTexture?: (type: EntityType) => Texture | undefined,
): void {
  for (const child of container.removeChildren()) {
    child.destroy({ children: true });
  }

  const blockedMarks = new Graphics();
  for (const ghost of ghosts) {
    const entity = toGhostEntity(ghost);
    const view = drawEntity(entity, getTexture, undefined, getBaseTexture);
    view.position.set(ghost.x * TILE_SIZE, ghost.y * TILE_SIZE);
    view.alpha = alpha;
    container.addChild(view);
    // Không đặt được → tô đỏ cả khối (công trình 2×2 đỏ đủ 4 ô), dù chỉ một ô bị chặn.
    if (!ghost.valid) {
      blockedMarks
        .rect(ghost.x * TILE_SIZE, ghost.y * TILE_SIZE, entity.width * TILE_SIZE, entity.height * TILE_SIZE)
        .fill({ color: UNBUILDABLE_TILE_COLOR, alpha: UNBUILDABLE_TILE_ALPHA });
    }
  }

  // Lớp đỏ nằm trên cùng để luôn nhìn thấy. Không có bóng nào không hợp lệ thì không thêm.
  if (ghosts.some((ghost) => !ghost.valid)) {
    container.addChild(blockedMarks);
  } else {
    blockedMarks.destroy();
  }
}

/**
 * Dựng dữ liệu thực thể tạm để vẽ bóng. Không dùng createEntity vì bóng không hợp lệ có thể nằm ở toạ độ âm.
 * @param ghost Bóng cần vẽ.
 * @returns Entity chỉ dùng để vẽ, không đưa vào danh sách thực thể.
 */
function toGhostEntity(ghost: BuildGhost): Entity {
  const { width, height } = getEntityDefinition(ghost.type);
  return {
    id: 0,
    type: ghost.type,
    x: ghost.x,
    y: ghost.y,
    width,
    height,
    rotation: ghost.rotation,
    hp: DEFAULT_MAX_HP,
    maxHp: DEFAULT_MAX_HP,
    constructing: false,
  };
}
