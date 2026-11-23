import type { Graphics } from 'pixi.js';
import {
  HEALTH_BAR_BACKGROUND_COLOR,
  HEALTH_BAR_COLOR,
  HEALTH_BAR_HEIGHT,
  HEALTH_BAR_OFFSET,
  TILE_SIZE,
} from '../config';
import type { Entity, Point } from '../types';
import { shouldShowHealthBar } from './shouldShowHealthBar';

/**
 * Xoá hình cũ rồi vẽ thanh máu dưới các công trình cần hiện (xem shouldShowHealthBar). Gọi mỗi khung hình.
 * Thanh rộng bằng công trình, nằm ngay dưới đáy; phần màu xanh dài theo tỉ lệ hp / maxHp.
 * graphics phải nằm trong lớp thế giới (di chuyển theo camera).
 * @param graphics Graphics dùng riêng cho thanh máu.
 * @param entities Danh sách thực thể.
 * @param mouseWorld Vị trí chuột trong thế giới (pixel), hoặc null khi chuột không ở trên map.
 */
export function drawHealthBars(graphics: Graphics, entities: Entity[], mouseWorld: Point | null): void {
  graphics.clear();
  for (const entity of entities) {
    if (!shouldShowHealthBar(entity, mouseWorld)) {
      continue;
    }
    const x = entity.x * TILE_SIZE;
    const y = (entity.y + entity.height) * TILE_SIZE + HEALTH_BAR_OFFSET;
    const width = entity.width * TILE_SIZE;
    const ratio = entity.maxHp > 0 ? Math.max(0, Math.min(1, entity.hp / entity.maxHp)) : 0;
    graphics.rect(x, y, width, HEALTH_BAR_HEIGHT).fill(HEALTH_BAR_BACKGROUND_COLOR);
    if (ratio > 0) {
      graphics.rect(x, y, width * ratio, HEALTH_BAR_HEIGHT).fill(HEALTH_BAR_COLOR);
    }
  }
}
