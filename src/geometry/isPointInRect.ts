import type { Rect } from '../types';

/**
 * Cho biết một điểm có nằm trong hình chữ nhật không.
 * Tính cả cạnh trái/trên, không tính cạnh phải/dưới — để 2 hình nằm sát nhau không cùng nhận một điểm.
 * @param rect Hình chữ nhật.
 * @param x Toạ độ x của điểm (cùng hệ toạ độ với rect).
 * @param y Toạ độ y của điểm.
 * @returns true nếu điểm nằm trong.
 */
export function isPointInRect(rect: Rect, x: number, y: number): boolean {
  return x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;
}
