import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_DRILL, ITEM_IRON, TERRAIN_IRON_ORE } from '../config';
import { createEntity } from '../entity/createEntity';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import type { ConveyorItems, DrillAccumulators } from '../types';
import { updateDrills } from './updateDrills';

describe('updateDrills', () => {
  it('1 ô quặng → sau 1 giây tích lũy 0.5 item (chưa đủ 1 item để đẩy ra)', () => {
    const map = createEnvironmentMap(20, 20);
    map.terrain[5 * 20 + 5] = TERRAIN_IRON_ORE;
    const drill = createEntity(BUILDING_DRILL, 5, 5);
    const conveyor = createEntity(BUILDING_BANNER, 5, 4, 0);
    const items: ConveyorItems = new Map();
    const accumulators: DrillAccumulators = new Map();

    updateDrills([drill, conveyor], map, accumulators, items, 1, () => 0);
    expect(items.size).toBe(0);
    expect(accumulators.get(drill.id)).toBeCloseTo(0.5);
  });

  it('1 ô quắng → sau 2 giây tạo 1 item (0.5 item/s mỗi ô)', () => {
    const map = createEnvironmentMap(20, 20);
    map.terrain[5 * 20 + 5] = TERRAIN_IRON_ORE;
    const drill = createEntity(BUILDING_DRILL, 5, 5);
    drill.id = 1;
    const conveyor = createEntity(BUILDING_BANNER, 5, 4, 0);
    conveyor.id = 2;
    const items: ConveyorItems = new Map();
    const accumulators: DrillAccumulators = new Map();

    updateDrills([drill, conveyor], map, accumulators, items, 2, () => 0);
    expect(items.get(conveyor.id)).toEqual([{ type: ITEM_IRON, progress: 0 }]);
    expect(accumulators.get(drill.id)).toBe(0);
  });

  it('2 ô quặng → sau 1 giây tạo 1 item (0.5 × 2 = 1)', () => {
    const map = createEnvironmentMap(20, 20);
    map.terrain[5 * 20 + 5] = TERRAIN_IRON_ORE;
    map.terrain[5 * 20 + 6] = TERRAIN_IRON_ORE;
    const drill = createEntity(BUILDING_DRILL, 5, 5);
    drill.id = 1;
    const conveyor = createEntity(BUILDING_BANNER, 5, 4, 0);
    conveyor.id = 2;
    const items: ConveyorItems = new Map();
    const accumulators: DrillAccumulators = new Map();

    updateDrills([drill, conveyor], map, accumulators, items, 1, () => 0);
    expect(items.get(conveyor.id)).toEqual([{ type: ITEM_IRON, progress: 0 }]);
    expect(accumulators.get(drill.id)).toBe(0);
  });

  it('nhiều băng chuyền → random chọn một (thứ tự đổi theo hàm random)', () => {
    const map = createEnvironmentMap(20, 20);
    map.terrain[5 * 20 + 5] = TERRAIN_IRON_ORE;
    const drill = createEntity(BUILDING_DRILL, 5, 5);
    drill.id = 1;
    const top = createEntity(BUILDING_BANNER, 5, 4, 0);
    top.id = 2;
    const bottom = createEntity(BUILDING_BANNER, 5, 7, 2);
    bottom.id = 3;
    const items: ConveyorItems = new Map();
    const accumulators: DrillAccumulators = new Map([[drill.id, 1]]);

    updateDrills([drill, top, bottom], map, accumulators, items, 0, () => 0.99);
    expect(items.size).toBe(1);
    expect([...items.values()][0]?.[0]?.type).toBe(ITEM_IRON);
  });

  it('không có băng chuyền trống thì tích lũy tối đa 1 item', () => {
    const map = createEnvironmentMap(20, 20);
    map.terrain[5 * 20 + 5] = TERRAIN_IRON_ORE;
    const drill = createEntity(BUILDING_DRILL, 5, 5);
    const items: ConveyorItems = new Map();
    const accumulators: DrillAccumulators = new Map();

    updateDrills([drill], map, accumulators, items, 10, () => 0);
    expect(items.size).toBe(0);
    expect(accumulators.get(drill.id)).toBe(1);
  });
});
