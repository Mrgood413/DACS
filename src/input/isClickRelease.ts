import { SELECTION_DRAG_THRESHOLD } from '../config';

/**
 * Cho biết một lần thả chuột là "click" (không kéo) hay là kết thúc một lần kéo.
 * Cùng ngưỡng với getMouseAction: kéo không quá SELECTION_DRAG_THRESHOLD pixel thì là click.
 * @param startX Toạ độ x lúc nhấn chuột (pixel màn hình).
 * @param startY Toạ độ y lúc nhấn chuột.
 * @param endX Toạ độ x lúc thả chuột.
 * @param endY Toạ độ y lúc thả chuột.
 * @returns true nếu là click.
 */
export function isClickRelease(startX: number, startY: number, endX: number, endY: number): boolean {
  return Math.hypot(endX - startX, endY - startY) <= SELECTION_DRAG_THRESHOLD;
}
