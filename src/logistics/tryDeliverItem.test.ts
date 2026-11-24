import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_CORE, BUILDING_TURRET, ITEM_COPPER, ITEM_IRON, TURRET_MAX_AMMO } from '../config';
import { createEntity } from '../entity/createEntity';
import type { ConveyorItems, CoreResources } from '../types';
import { getConveyorTarget } from './getConveyorTarget';
import { tryDeliverItem } from './tryDeliverItem';

describe('tryDeliverItem', () => {
  it('trụ súng nhận đồng: +1 đạn, tối đa 10; từ chối sắt', () => {
    const turret = createEntity(BUILDING_TURRET, 1, 0);
    turret.id = 11;
    const conveyor = createEntity(BUILDING_BANNER, 0, 0, 1);
    const items: ConveyorItems = new Map();
    const resources: CoreResources = new Map();
    const target = getConveyorTarget(conveyor, [conveyor, turret]);

    expect(tryDeliverItem(target, ITEM_COPPER, conveyor, items, resources)).toBe(true);
    expect(turret.ammo).toBe(1);
    expect(tryDeliverItem(target, ITEM_IRON, conveyor, items, resources)).toBe(false);
    expect(turret.ammo).toBe(1);
    for (let i = 0; i < TURRET_MAX_AMMO; i++) {
      tryDeliverItem(target, ITEM_COPPER, conveyor, items, resources);
    }
    expect(turret.ammo).toBe(TURRET_MAX_AMMO);
    expect(tryDeliverItem(target, ITEM_COPPER, conveyor, items, resources)).toBe(false);
  });

  it('nhà chính nhận mọi loại vào kho', () => {
    const core = createEntity(BUILDING_CORE, 0, 0);
    core.id = 10;
    const conveyor = createEntity(BUILDING_BANNER, 0, 3, 0); // hướng lên vào cạnh dưới của core (0,2)
    const items: ConveyorItems = new Map();
    const resources: CoreResources = new Map();
    const target = getConveyorTarget(conveyor, [conveyor, core]);

    expect(tryDeliverItem(target, ITEM_COPPER, conveyor, items, resources)).toBe(true);
    expect(tryDeliverItem(target, ITEM_IRON, conveyor, items, resources)).toBe(true);
    expect(resources.get(ITEM_COPPER)).toBe(1);
    expect(resources.get(ITEM_IRON)).toBe(1);
  });

  it('băng chuyền khác nhận theo khoảng trống phía đuôi, không giới hạn 1 item/ô', () => {
    const first = createEntity(BUILDING_BANNER, 0, 0, 2);
    first.id = 1;
    const second = createEntity(BUILDING_BANNER, 0, 1, 2);
    second.id = 2;
    const items: ConveyorItems = new Map();
    const resources: CoreResources = new Map();
    const target = getConveyorTarget(first, [first, second]);

    expect(tryDeliverItem(target, ITEM_COPPER, first, items, resources)).toBe(true);
    expect(items.get(second.id)).toEqual([{ type: ITEM_COPPER, progress: 0 }]);

    // Item vừa vào còn sát đuôi → chưa nhận thêm.
    expect(tryDeliverItem(target, ITEM_IRON, first, items, resources)).toBe(false);

    // Item đầu đã đi quá 0.05 → nhận thêm, danh sách vẫn sắp xếp tăng dần.
    const existing = items.get(second.id);
    if (existing !== undefined) {
      existing[0].progress = 0.4;
    }
    expect(tryDeliverItem(target, ITEM_IRON, first, items, resources)).toBe(true);
    expect(items.get(second.id)).toEqual([
      { type: ITEM_IRON, progress: 0 },
      { type: ITEM_COPPER, progress: 0.4 },
    ]);
  });

  it('không có đích thì trả false', () => {
    const conveyor = createEntity(BUILDING_BANNER, 0, 0, 1);
    const target = getConveyorTarget(conveyor, [conveyor]);
    expect(tryDeliverItem(target, ITEM_COPPER, conveyor, new Map(), new Map())).toBe(false);
  });
});
