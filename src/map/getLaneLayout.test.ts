import { describe, expect, it } from 'vitest';
import { getLaneLayout } from './getLaneLayout';

describe('getLaneLayout', () => {
  const layout = getLaneLayout(100, 100);

  it('map 100×100 → hành lang 24 ô ở giữa: cột 38 tới 61', () => {
    expect(layout.corridorLeft).toBe(38);
    expect(layout.corridorRight).toBe(61);
    expect(layout.corridorRight - layout.corridorLeft + 1).toBe(24);
  });

  it('2 làn quặng ở đáy, đối diện nhau, cách tường 2 ô, cách mép dưới 4 ô', () => {
    expect(layout.ironLane).toEqual({ x: 40, y: 82, width: 3, height: 14 });
    expect(layout.copperLane).toEqual({ x: 57, y: 82, width: 3, height: 14 });
    expect(layout.ironLane.y + layout.ironLane.height).toBe(96);
  });

  it('nhà chính ở trên làn quặng (cách 4 ô), drone ở trên nhà chính', () => {
    expect(layout.core).toEqual({ x: 48, y: 75 });
    expect(layout.core.y + 3 + 4).toBe(layout.ironLane.y);
    expect(layout.drone).toEqual({ x: 49, y: 73 });
  });

  it('nhà chính và drone nằm trong hành lang, không chạm làn quặng', () => {
    expect(layout.core.x).toBeGreaterThanOrEqual(layout.corridorLeft);
    expect(layout.core.x + 3 - 1).toBeLessThanOrEqual(layout.corridorRight);
    expect(layout.drone.x).toBeGreaterThan(layout.ironLane.x + layout.ironLane.width);
    expect(layout.drone.x).toBeLessThan(layout.copperLane.x);
  });

  it('map quá hẹp hoặc quá thấp → ném lỗi', () => {
    expect(() => getLaneLayout(20, 100)).toThrow('Map quá nhỏ cho bố cục hành lang');
    expect(() => getLaneLayout(100, 20)).toThrow('Map quá nhỏ cho bố cục hành lang');
  });
});
