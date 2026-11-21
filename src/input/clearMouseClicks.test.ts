import { describe, expect, it } from 'vitest';
import { clearMouseClicks } from './clearMouseClicks';

describe('clearMouseClicks', () => {
  it('tắt cả 2 cờ, giữ nguyên vị trí bấm chuột phải', () => {
    const clicks = { leftReleased: true, rightPressed: true, rightX: 40, rightY: 70 };
    clearMouseClicks(clicks);
    expect(clicks).toEqual({ leftReleased: false, rightPressed: false, rightX: 40, rightY: 70 });
  });

  it('cờ đã tắt sẵn → vẫn tắt', () => {
    const clicks = { leftReleased: false, rightPressed: false, rightX: 0, rightY: 0 };
    clearMouseClicks(clicks);
    expect(clicks.leftReleased).toBe(false);
    expect(clicks.rightPressed).toBe(false);
  });
});
