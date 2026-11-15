import { Graphics } from 'pixi.js';
import { SELECTION_COLOR, SELECTION_FILL_ALPHA } from '../config';
import type { Rect } from '../types';

/**
 * Xoá hình cũ; nếu có rect thì vẽ hộp chọn màu xanh nhạt, tô mờ bên trong. Được gọi mỗi khung hình.
 * @param graphics Graphics dùng riêng cho hộp chọn.
 * @param rect Hộp cần vẽ, hoặc null nếu không vẽ gì.
 */
export function drawSelectionBox(graphics: Graphics, rect: Rect | null): void {
  graphics.clear();
  if (rect === null) {
    return;
  }
  graphics
    .rect(rect.x, rect.y, rect.width, rect.height)
    .fill({ color: SELECTION_COLOR, alpha: SELECTION_FILL_ALPHA })
    .stroke({ width: 1, color: SELECTION_COLOR });
}
