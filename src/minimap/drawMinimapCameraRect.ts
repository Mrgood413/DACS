import { Graphics } from 'pixi.js';
import { MINIMAP_CAMERA_COLOR } from '../config';
import type { Rect } from '../types';

/**
 * Xoá hình cũ rồi vẽ lại khung camera trên minimap. Được gọi mỗi khung hình.
 * @param graphics Graphics dùng riêng cho khung camera.
 * @param rect Khung cần vẽ, từ getMinimapCameraRect.
 */
export function drawMinimapCameraRect(graphics: Graphics, rect: Rect): void {
  graphics.clear();
  graphics.rect(rect.x, rect.y, rect.width, rect.height).stroke({ width: 1, color: MINIMAP_CAMERA_COLOR });
}
