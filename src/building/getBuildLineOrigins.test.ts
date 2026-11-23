import { describe, expect, it } from 'vitest';
import { getBuildLineOrigins } from './getBuildLineOrigins';

describe('getBuildLineOrigins', () => {
  it('kéo sang phải (lệch dọc ít hơn) → hàng ngang, giữ y của điểm bắt đầu', () => {
    expect(getBuildLineOrigins({ x: 2, y: 3 }, { x: 6, y: 4 }, 1)).toEqual([
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
    ]);
  });

  it('kéo lên trên → hàng dọc đi ngược, giữ x của điểm bắt đầu', () => {
    expect(getBuildLineOrigins({ x: 5, y: 5 }, { x: 6, y: 2 }, 1)).toEqual([
      { x: 5, y: 5 },
      { x: 5, y: 4 },
      { x: 5, y: 3 },
      { x: 5, y: 2 },
    ]);
  });

  it('công trình 2×2 → bước 2 ô, bỏ phần lẻ không đủ một công trình', () => {
    expect(getBuildLineOrigins({ x: 2, y: 3 }, { x: 7, y: 3 }, 2)).toEqual([
      { x: 2, y: 3 },
      { x: 4, y: 3 },
      { x: 6, y: 3 },
    ]);
  });

  it('chưa kéo (start = end) → đúng 1 vị trí', () => {
    expect(getBuildLineOrigins({ x: 1, y: 1 }, { x: 1, y: 1 }, 1)).toEqual([{ x: 1, y: 1 }]);
  });
});
