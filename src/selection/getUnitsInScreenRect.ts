import { TILE_SIZE } from '../config';
import { isSelectableUnit } from '../entity/isSelectableUnit';
import type { Entity, Rect } from '../types';

/**
 * Tìm các đơn vị của người chơi nằm (dù chỉ một phần) trong hộp chọn trên màn hình.
 * Hộp có kích thước 0 (click, không kéo) vẫn chọn được đơn vị nằm dưới điểm click.
 * @param entities Danh sách thực thể.
 * @param screenRect Hộp chọn, toạ độ màn hình (pixel) — từ getSelectionRect.
 * @param world Vị trí lớp thế giới đang được dời (world.x, world.y từ applyCamera).
 * @returns Danh sách id đơn vị được chọn, theo thứ tự trong entities. Không có thì trả mảng rỗng.
 */
export function getUnitsInScreenRect(entities: Entity[], screenRect: Rect, world: { x: number; y: number }): number[] {
  // Đổi hộp chọn từ toạ độ màn hình sang toạ độ thế giới.
  const left = screenRect.x - world.x;
  const top = screenRect.y - world.y;
  const right = left + screenRect.width;
  const bottom = top + screenRect.height;

  const ids: number[] = [];
  for (const entity of entities) {
    if (!isSelectableUnit(entity.type)) {
      continue;
    }
    const entityLeft = entity.x * TILE_SIZE;
    const entityTop = entity.y * TILE_SIZE;
    const entityRight = entityLeft + entity.width * TILE_SIZE;
    const entityBottom = entityTop + entity.height * TILE_SIZE;
    const overlaps = left <= entityRight && right >= entityLeft && top <= entityBottom && bottom >= entityTop;
    if (overlaps) {
      ids.push(entity.id);
    }
  }
  return ids;
}
