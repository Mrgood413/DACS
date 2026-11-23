import { isPointInRect } from '../geometry/isPointInRect';
import type { BuildMenuLayout } from '../types';

/**
 * Tìm ô của menu xây dựng nằm dưới một điểm trên màn hình.
 * @param layout Bố cục từ getBuildMenuLayout.
 * @param x Toạ độ x trên màn hình (pixel).
 * @param y Toạ độ y trên màn hình (pixel).
 * @returns Chỉ số ô (0, 1, 2...), hoặc null nếu điểm nằm ở khe giữa các ô hay ngoài menu.
 */
export function getBuildMenuSlotAt(layout: BuildMenuLayout, x: number, y: number): number | null {
  for (let i = 0; i < layout.slots.length; i++) {
    const slot = layout.slots[i];
    if (slot !== undefined && isPointInRect(slot, x, y)) {
      return i;
    }
  }
  return null;
}
