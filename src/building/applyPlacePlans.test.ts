import { describe, expect, it } from 'vitest';
import { BUILDING_IRON_WALL } from '../config';
import type { BuildGhost, BuildPlan } from '../types';
import { applyPlacePlans } from './applyPlacePlans';

const ghost = (x: number, valid: boolean): BuildGhost => ({
  type: BUILDING_IRON_WALL,
  x,
  y: 0,
  rotation: 0,
  valid,
  blockedTiles: valid ? [] : [{ x, y: 0 }],
});

describe('applyPlacePlans', () => {
  it('chỉ thêm bóng hợp lệ, đúng thứ tự, chưa bắt đầu xây (entityId = null)', () => {
    const queue: BuildPlan[] = [];
    expect(applyPlacePlans(queue, [ghost(1, true), ghost(2, false), ghost(3, true)])).toBe(2);
    expect(queue).toEqual([
      { type: BUILDING_IRON_WALL, x: 1, y: 0, rotation: 0, entityId: null },
      { type: BUILDING_IRON_WALL, x: 3, y: 0, rotation: 0, entityId: null },
    ]);
  });

  it('thêm vào cuối hàng chờ đang có', () => {
    const queue: BuildPlan[] = [{ type: BUILDING_IRON_WALL, x: 9, y: 9, rotation: 0, entityId: 5 }];
    applyPlacePlans(queue, [ghost(1, true)]);
    expect(queue.map((p) => p.x)).toEqual([9, 1]);
  });

  it('không có bóng hợp lệ → không thêm gì', () => {
    const queue: BuildPlan[] = [];
    expect(applyPlacePlans(queue, [ghost(1, false)])).toBe(0);
    expect(queue).toEqual([]);
  });
});
