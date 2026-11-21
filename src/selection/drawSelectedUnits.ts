import type { Graphics } from 'pixi.js';
import { TILE_SIZE, UNIT_SELECTED_COLOR } from '../config';
import type { Entity } from '../types';

/**
 * Xoá hình cũ rồi vẽ khung xanh lá quanh các đơn vị đang được chọn. Gọi mỗi khung hình.
 * graphics phải nằm trong lớp thế giới (di chuyển theo camera), vẽ bằng toạ độ thế giới.
 * @param graphics Graphics dùng riêng cho khung đánh dấu.
 * @param entities Danh sách thực thể.
 * @param selectedIds Id các đơn vị đang được chọn.
 */
export function drawSelectedUnits(graphics: Graphics, entities: Entity[], selectedIds: number[]): void {
  graphics.clear();
  for (const entity of entities) {
    if (!selectedIds.includes(entity.id)) {
      continue;
    }
    graphics
      .rect(entity.x * TILE_SIZE - 2, entity.y * TILE_SIZE - 2, entity.width * TILE_SIZE + 4, entity.height * TILE_SIZE + 4)
      .stroke({ width: 2, color: UNIT_SELECTED_COLOR });
  }
}
