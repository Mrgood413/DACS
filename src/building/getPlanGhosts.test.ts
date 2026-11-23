import { describe, expect, it } from 'vitest';
import { BUILDING_DRILL, BUILDING_IRON_WALL } from '../config';
import type { BuildGhost, BuildQueues } from '../types';
import { getAllPlans } from './getAllPlans';
import { getGhostsKey } from './getGhostsKey';
import { getPlanGhosts } from './getPlanGhosts';

const queues: BuildQueues = new Map([
  [
    1,
    [
      { type: BUILDING_IRON_WALL, x: 1, y: 1, rotation: 0, entityId: 9 },
      { type: BUILDING_IRON_WALL, x: 2, y: 1, rotation: 0, entityId: null },
    ],
  ],
  [2, [{ type: BUILDING_DRILL, x: 5, y: 5, rotation: 0, entityId: null }]],
]);

describe('getAllPlans', () => {
  it('gom plan của mọi drone', () => {
    expect(getAllPlans(queues).map((p) => p.x)).toEqual([1, 2, 5]);
  });

  it('không có hàng chờ → rỗng', () => {
    expect(getAllPlans(new Map())).toEqual([]);
  });
});

describe('getPlanGhosts', () => {
  it('chỉ tạo bóng cho plan chưa bắt đầu xây, bóng luôn hợp lệ, không ô đỏ', () => {
    expect(getPlanGhosts(queues)).toEqual([
      { type: BUILDING_IRON_WALL, x: 2, y: 1, rotation: 0, valid: true, blockedTiles: [] },
      { type: BUILDING_DRILL, x: 5, y: 5, rotation: 0, valid: true, blockedTiles: [] },
    ]);
  });
});

describe('getGhostsKey', () => {
  const ghost: BuildGhost = { type: BUILDING_IRON_WALL, x: 2, y: 1, rotation: 0, valid: true, blockedTiles: [] };

  it('cùng danh sách → cùng khoá', () => {
    expect(getGhostsKey([ghost])).toBe(getGhostsKey([{ ...ghost }]));
  });

  it('đổi vị trí hoặc đổi ô bị chặn → khoá khác', () => {
    expect(getGhostsKey([ghost])).not.toBe(getGhostsKey([{ ...ghost, x: 3 }]));
    expect(getGhostsKey([ghost])).not.toBe(
      getGhostsKey([{ ...ghost, valid: false, blockedTiles: [{ x: 2, y: 1 }] }]),
    );
  });

  it('danh sách rỗng → chuỗi rỗng', () => {
    expect(getGhostsKey([])).toBe('');
  });
});
