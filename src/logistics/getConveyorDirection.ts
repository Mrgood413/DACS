import type { Point } from '../types';

/** Hướng di chuyển của băng chuyền theo rotation: 0 = lên, 1 = phải, 2 = xuống, 3 = trái. */
const DIRECTIONS: Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

/**
 * Lấy vec tơ hướng của băng chuyền theo rotation (0–3).
 * @param rotation Hướng xoay của băng chuyền.
 * @returns Vec tơ (dx, dy) — một thành phần ±1, thành phần còn lại 0.
 */
export function getConveyorDirection(rotation: number): Point {
  const index = ((Math.round(rotation) % 4) + 4) % 4;
  return DIRECTIONS[index] ?? DIRECTIONS[0];
}
