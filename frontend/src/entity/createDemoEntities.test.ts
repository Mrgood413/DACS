import { describe, expect, it } from 'vitest';
import {
  BUILDING_BANNER,
  BUILDING_COPPER_WALL,
  BUILDING_CORE,
  BUILDING_DRILL,
  BUILDING_ELECTRIC_TURRET,
  BUILDING_IRON_WALL,
  BUILDING_TURRET,
  UNIT_BUG,
  UNIT_DRONE,
} from '../config';
import { createDemoEntities } from './createDemoEntities';

describe('createDemoEntities', () => {
  it('tạo đúng 9 thực thể', () => {
    expect(createDemoEntities().length).toBe(9);
  });

  it('đủ 9 loại, mỗi loại đúng một lần (không trùng loại)', () => {
    const entities = createDemoEntities();
    const types = entities.map((entity) => entity.type);
    expect(new Set(types).size).toBe(9);
    expect(new Set(types)).toEqual(
      new Set([
        BUILDING_CORE,
        BUILDING_TURRET,
        BUILDING_ELECTRIC_TURRET,
        BUILDING_DRILL,
        BUILDING_IRON_WALL,
        BUILDING_COPPER_WALL,
        BUILDING_BANNER,
        UNIT_DRONE,
        UNIT_BUG,
      ]),
    );
  });

  it('id đánh số 1 → 9, không lặp', () => {
    const ids = createDemoEntities().map((entity) => entity.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('kích thước theo định nghĩa (core 3×3, drill 2×2, còn lại 1×1)', () => {
    const entities = createDemoEntities();
    const byType = new Map(entities.map((entity) => [entity.type, entity]));
    expect(byType.get(BUILDING_CORE)?.width).toBe(3);
    expect(byType.get(BUILDING_CORE)?.height).toBe(3);
    expect(byType.get(BUILDING_DRILL)?.width).toBe(2);
    expect(byType.get(BUILDING_TURRET)?.width).toBe(1);
    expect(byType.get(UNIT_BUG)?.height).toBe(1);
  });

  it('băng rôn có hướng xoay 1', () => {
    const banner = createDemoEntities().find((entity) => entity.type === BUILDING_BANNER);
    expect(banner?.rotation).toBe(1);
  });
});
