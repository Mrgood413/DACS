import { describe, expect, it } from 'vitest';
import { isPointInRect } from './isPointInRect';

const rect = { x: 10, y: 20, width: 30, height: 40 };

describe('isPointInRect', () => {
  it('điểm ở giữa → true', () => {
    expect(isPointInRect(rect, 25, 40)).toBe(true);
  });

  it('điểm ngay góc trên-trái → true (tính cạnh trái/trên)', () => {
    expect(isPointInRect(rect, 10, 20)).toBe(true);
  });

  it('điểm ngay cạnh phải hoặc cạnh dưới → false', () => {
    expect(isPointInRect(rect, 40, 40)).toBe(false);
    expect(isPointInRect(rect, 25, 60)).toBe(false);
  });

  it('điểm ở ngoài → false', () => {
    expect(isPointInRect(rect, 0, 0)).toBe(false);
  });

  it('hình kích thước 0 → không chứa điểm nào', () => {
    expect(isPointInRect({ x: 5, y: 5, width: 0, height: 0 }, 5, 5)).toBe(false);
  });
});
