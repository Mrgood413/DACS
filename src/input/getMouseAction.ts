import { SELECTION_DRAG_THRESHOLD } from '../config';
import type { Mouse, MouseAction } from '../types';

/**
 * Phân biệt thao tác click với thao tác kéo chuột trái.
 * @param mouse Trạng thái chuột từ createMouse.
 * @returns 'NONE' nếu không giữ chuột trái, 'CLICK_PENDING' nếu khoảng cách từ điểm bắt đầu kéo
 *          chưa vượt SELECTION_DRAG_THRESHOLD, 'DRAGGING' nếu đã vượt ngưỡng.
 */
export function getMouseAction(mouse: Mouse): MouseAction {
  if (!mouse.leftDown) {
    return 'NONE';
  }
  const dx = mouse.x - mouse.dragStartX;
  const dy = mouse.y - mouse.dragStartY;
  const distance = Math.hypot(dx, dy);
  if (distance <= SELECTION_DRAG_THRESHOLD) {
    return 'CLICK_PENDING';
  }
  return 'DRAGGING';
}
