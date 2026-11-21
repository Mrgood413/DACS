import { EDGE_SCROLL_MARGIN } from '../config';
import type { Direction, Mouse } from '../types';

/**
 * Cho biết camera nên chạy hướng nào dựa vào việc chuột có ở sát mép màn hình không.
 * Chuột ra ngoài cửa sổ, hoặc đang giữ chuột trái kéo hộp chọn, thì đứng yên (để hộp chọn không lệch).
 * @param mouse Trạng thái chuột từ createMouse.
 * @param screenWidth Chiều rộng màn hình (pixel).
 * @param screenHeight Chiều cao màn hình (pixel).
 * @returns Direction mới: x = -1 trái / 1 phải / 0 đứng yên, y = -1 lên / 1 xuống / 0 đứng yên.
 */
export function getEdgeScrollDirection(mouse: Mouse, screenWidth: number, screenHeight: number): Direction {
  if (!mouse.inside || mouse.leftDown) {
    return { x: 0, y: 0 };
  }
  let x = 0;
  if (mouse.x < EDGE_SCROLL_MARGIN) {
    x = -1;
  } else if (mouse.x >= screenWidth - EDGE_SCROLL_MARGIN) {
    x = 1;
  }
  let y = 0;
  if (mouse.y < EDGE_SCROLL_MARGIN) {
    y = -1;
  } else if (mouse.y >= screenHeight - EDGE_SCROLL_MARGIN) {
    y = 1;
  }
  return { x, y };
}
