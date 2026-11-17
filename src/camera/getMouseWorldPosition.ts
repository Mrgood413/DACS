import type { Camera } from '../types';

/**
 * Chuyển toạ độ chuột trên màn hình thành toạ độ trong thế giới game.
 * @param mouseX Toạ độ x của chuột trên màn hình (pixel).
 * @param mouseY Toạ độ y của chuột trên màn hình (pixel).
 * @param world Vị trí thế giới game đang được dời (world.x, world.y từ applyCamera).
 * @returns Toạ độ thế giới game tương ứng điểm chuột.
 */
export function getMouseWorldPosition(mouseX: number, mouseY: number, world: { x: number; y: number }): { x: number; y: number } {
  return {
    x: mouseX - world.x,
    y: mouseY - world.y,
  };
}
