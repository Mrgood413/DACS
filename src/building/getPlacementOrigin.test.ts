import { describe, expect, it } from 'vitest';
import { BUILDING_CORE, BUILDING_DRILL, BUILDING_IRON_WALL } from '../config';
import { getPlacementOrigin } from './getPlacementOrigin';

describe('getPlacementOrigin', () => {
  it('1×1 → chính ô con trỏ', () => {
    expect(getPlacementOrigin({ x: 5, y: 7 }, BUILDING_IRON_WALL)).toEqual({ x: 5, y: 7 });
  });

  it('2×2 → chính ô con trỏ (con trỏ ở ô trên-trái)', () => {
    expect(getPlacementOrigin({ x: 5, y: 7 }, BUILDING_DRILL)).toEqual({ x: 5, y: 7 });
  });

  it('3×3 → lùi 1 ô để con trỏ nằm ở ô giữa', () => {
    expect(getPlacementOrigin({ x: 5, y: 7 }, BUILDING_CORE)).toEqual({ x: 4, y: 6 });
  });

  it('3×3 sát mép trái → gốc âm (chỗ kiểm tra hợp lệ sẽ loại)', () => {
    expect(getPlacementOrigin({ x: 0, y: 0 }, BUILDING_CORE)).toEqual({ x: -1, y: -1 });
  });
});
