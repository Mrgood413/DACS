import { describe, expect, it } from 'vitest';
import type { Mouse } from '../types';
import { getMouseAction } from './getMouseAction';

function fakeMouse(x: number, y: number, leftDown: boolean, dragStartX = 0, dragStartY = 0): Mouse {
  return { x, y, inside: true, rightDown: false, leftDown, dragStartX, dragStartY };
}

describe('getMouseAction', () => {
  it('không giữ chuột trái → NONE', () => {
    expect(getMouseAction(fakeMouse(100, 100, false))).toBe('NONE');
  });

  it('giữ chuột trái nhưng chưa vượt ngưỡng 5 px → CLICK_PENDING', () => {
    expect(getMouseAction(fakeMouse(3, 4, true))).toBe('CLICK_PENDING');
  });

  it('kéo ngang vượt ngưỡng → DRAGGING', () => {
    expect(getMouseAction(fakeMouse(10, 0, true))).toBe('DRAGGING');
  });

  it('kéo dọc vượt ngưỡng → DRAGGING', () => {
    expect(getMouseAction(fakeMouse(0, 10, true))).toBe('DRAGGING');
  });

  it('kéo chéo vượt ngưỡng → DRAGGING', () => {
    expect(getMouseAction(fakeMouse(4, 4, true))).toBe('DRAGGING');
  });

  it('kéo ngược (điểm bắt đầu phía sau vị trí hiện tại) → DRAGGING', () => {
    expect(getMouseAction(fakeMouse(0, 0, true, 10, 10))).toBe('DRAGGING');
  });
});
