import { describe, expect, it } from 'vitest';
import type { MouseClicks } from '../types';
import { clearMouseClicks } from './clearMouseClicks';

describe('clearMouseClicks', () => {
  it('tắt cả 3 cờ (thả trái, bấm phải, Esc), giữ nguyên vị trí đã lưu', () => {
    const clicks: MouseClicks = {
      leftReleased: true,
      leftX: 5,
      leftY: 6,
      leftShift: true,
      rightPressed: true,
      rightX: 40,
      rightY: 70,
      escapePressed: true,
      rotatePressed: true,
    };
    clearMouseClicks(clicks);
    expect(clicks).toEqual({
      leftReleased: false,
      leftX: 5,
      leftY: 6,
      leftShift: true,
      rightPressed: false,
      rightX: 40,
      rightY: 70,
      escapePressed: false,
      rotatePressed: false,
    });
  });

  it('cờ đã tắt sẵn → vẫn tắt', () => {
    const clicks: MouseClicks = {
      leftReleased: false,
      leftX: 0,
      leftY: 0,
      leftShift: false,
      rightPressed: false,
      rightX: 0,
      rightY: 0,
      escapePressed: false,
      rotatePressed: false,
    };
    clearMouseClicks(clicks);
    expect(clicks.leftReleased).toBe(false);
    expect(clicks.rightPressed).toBe(false);
    expect(clicks.escapePressed).toBe(false);
  });
});
