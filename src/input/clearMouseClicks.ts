import type { MouseClicks } from '../types';

/**
 * Tắt các cờ bấm chuột "một lần" sau khi đã xử lý xong trong khung hình (sửa tại chỗ).
 * Vị trí bấm chuột phải giữ nguyên, chỉ tắt cờ.
 * @param clicks Object từ createMouseClicks.
 */
export function clearMouseClicks(clicks: MouseClicks): void {
  clicks.leftReleased = false;
  clicks.rightPressed = false;
  clicks.escapePressed = false;
  clicks.rotateDelta = 0;
}
