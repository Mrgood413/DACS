import { TILE_SIZE } from '../config';
import type { Camera, Rect } from '../types';
import { getMinimapScale } from './getMinimapScale';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Tính khung chữ nhật trên minimap thể hiện vùng camera đang nhìn. Khung bị cắt để không vượt ra ngoài minimap.
 * @param camera Vị trí camera (pixel trên map, là tâm màn hình).
 * @param screenWidth Chiều rộng màn hình (pixel).
 * @param screenHeight Chiều cao màn hình (pixel).
 * @param map Map hiện tại (chỉ cần width, height).
 * @returns Rect tính bằng pixel của minimap.
 */
export function getMinimapCameraRect(camera: Camera, screenWidth: number, screenHeight: number, map: { width: number; height: number }): Rect {
  const scale = getMinimapScale(map);
  const maxX = map.width * TILE_SIZE * scale;
  const maxY = map.height * TILE_SIZE * scale;
  const left = clamp((camera.x - screenWidth / 2) * scale, 0, maxX);
  const right = clamp((camera.x + screenWidth / 2) * scale, 0, maxX);
  const top = clamp((camera.y - screenHeight / 2) * scale, 0, maxY);
  const bottom = clamp((camera.y + screenHeight / 2) * scale, 0, maxY);
  return { x: left, y: top, width: right - left, height: bottom - top };
}
