import { describe, expect, it } from 'vitest';
import {
  BUILDING_BANNER,
  BUILDING_CORE,
  BUILDING_TURRET,
  CONVEYOR_ITEM_SPACING,
  CONVEYOR_SPEED_TILES_PER_SECOND,
  ITEM_COPPER,
  ITEM_IRON,
  TURRET_MAX_AMMO,
} from '../config';
import { createEntity } from '../entity/createEntity';
import type { ConveyorItem, ConveyorItems, CoreResources } from '../types';
import { updateConveyors } from './updateConveyors';

function item(type: number, progress: number): ConveyorItem {
  return { type, progress };
}

describe('updateConveyors', () => {
  it('item tiến theo tốc độ băng chuyền', () => {
    const conveyor = createEntity(BUILDING_BANNER, 0, 0, 1);
    const items: ConveyorItems = new Map([[conveyor.id, [item(ITEM_COPPER, 0)]]]);
    updateConveyors([conveyor], items, new Map(), 0.5);
    expect(items.get(conveyor.id)?.[0]?.progress).toBeCloseTo(0.6);
  });

  it('nhiều item trên một ô: item trước đi trước, item sau giữ khoảng cách', () => {
    const conveyor = createEntity(BUILDING_BANNER, 0, 0, 1);
    const items: ConveyorItems = new Map([
      [conveyor.id, [item(ITEM_COPPER, 0), item(ITEM_IRON, 0.1)]],
    ]);
    updateConveyors([conveyor], items, new Map(), 0.1);
    const list = items.get(conveyor.id) ?? [];
    const frontProgress = 0.1 + CONVEYOR_SPEED_TILES_PER_SECOND * 0.1;
    expect(list[1].progress).toBeCloseTo(frontProgress);
    expect(list[1].progress - list[0].progress).toBeCloseTo(CONVEYOR_ITEM_SPACING);
    expect(list[0].progress).toBeCloseTo(frontProgress - CONVEYOR_ITEM_SPACING);
  });

  it('tới đầu băng và có trụ súng nhận đồng → item biến mất, đạn +1', () => {
    const conveyor = createEntity(BUILDING_BANNER, 0, 0, 1);
    const turret = createEntity(BUILDING_TURRET, 1, 0);
    const items: ConveyorItems = new Map([[conveyor.id, [item(ITEM_COPPER, 1)]]]);
    updateConveyors([conveyor, turret], items, new Map(), 0.1);
    expect(items.has(conveyor.id)).toBe(false);
    expect(turret.ammo).toBe(1);
  });

  it('trụ súng đầy đạn thì item đứng lại ở đầu băng', () => {
    const conveyor = createEntity(BUILDING_BANNER, 0, 0, 1);
    const turret = createEntity(BUILDING_TURRET, 1, 0);
    turret.ammo = TURRET_MAX_AMMO;
    const items: ConveyorItems = new Map([[conveyor.id, [item(ITEM_COPPER, 1)]]]);
    updateConveyors([conveyor, turret], items, new Map(), 0.1);
    expect(items.get(conveyor.id)?.[0]?.progress).toBe(1);
    expect(turret.ammo).toBe(TURRET_MAX_AMMO);
  });

  it('vào nhà chính → cộng vào kho', () => {
    const conveyor = createEntity(BUILDING_BANNER, 0, 3, 0);
    const core = createEntity(BUILDING_CORE, 0, 0);
    const resources: CoreResources = new Map();
    const items: ConveyorItems = new Map([[conveyor.id, [item(ITEM_IRON, 1)]]]);
    updateConveyors([conveyor, core], items, resources, 0.1);
    expect(resources.get(ITEM_IRON)).toBe(1);
    expect(items.size).toBe(0);
  });

  it('chuyển item sang băng chuyền kế khi tới đầu ra', () => {
    const first = createEntity(BUILDING_BANNER, 0, 0, 2); // hướng xuống
    first.id = 1;
    const second = createEntity(BUILDING_BANNER, 0, 1, 2);
    second.id = 2;
    const items: ConveyorItems = new Map([[first.id, [item(ITEM_COPPER, 1)]]]);
    updateConveyors([first, second], items, new Map(), 0);
    expect(items.has(first.id)).toBe(false);
    expect(items.get(second.id)).toEqual([item(ITEM_COPPER, 0)]);
  });

  it('băng chuyền đang xây thì không vận chuyển', () => {
    const conveyor = createEntity(BUILDING_BANNER, 0, 0, 1);
    conveyor.constructing = true;
    const items: ConveyorItems = new Map([[conveyor.id, [item(ITEM_COPPER, 0)]]]);
    updateConveyors([conveyor], items, new Map(), 1);
    expect(items.get(conveyor.id)?.[0]?.progress).toBe(0);
  });

  it('băng chuyền không có item thì bỏ qua', () => {
    const conveyor = createEntity(BUILDING_BANNER, 0, 0, 1);
    const items: ConveyorItems = new Map();
    updateConveyors([conveyor], items, new Map(), 1);
    expect(items.size).toBe(0);
  });
});
