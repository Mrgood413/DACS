import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_DRILL, ITEM_COPPER, ITEM_IRON } from '../config';
import { createEntity } from '../entity/createEntity';
import type { ConveyorItems } from '../types';
import { tryAcceptOnConveyor } from './tryAcceptOnConveyor';

describe('tryAcceptOnConveyor', () => {
  it('băng trống nhận item từ phía sau: progress 0, không lệch cạnh', () => {
    const target = createEntity(BUILDING_BANNER, 5, 5, 1); // hướng phải
    target.id = 1;
    const source = createEntity(BUILDING_BANNER, 4, 5, 1);
    source.id = 2;
    const items: ConveyorItems = new Map();

    expect(tryAcceptOnConveyor(target, ITEM_COPPER, source, items)).toBe(true);
    expect(items.get(target.id)).toEqual([{ type: ITEM_COPPER, progress: 0, lateral: 0 }]);
  });

  it('nhận item từ bên cạnh: progress 0.5, lệch về phía nguồn', () => {
    const target = createEntity(BUILDING_BANNER, 5, 5, 1); // hướng phải
    target.id = 1;
    const above = createEntity(BUILDING_BANNER, 5, 4, 0); // ở trên, hướng lên (không chĩa vào target)
    above.id = 2;
    const items: ConveyorItems = new Map();

    expect(tryAcceptOnConveyor(target, ITEM_IRON, above, items)).toBe(true);
    expect(items.get(target.id)?.[0]).toEqual({ type: ITEM_IRON, progress: 0.5, lateral: -0.9 });
  });

  it('nửa sau băng còn item gần đuôi → không nhận từ cạnh', () => {
    const target = createEntity(BUILDING_BANNER, 5, 5, 1);
    target.id = 1;
    const above = createEntity(BUILDING_BANNER, 5, 4, 0);
    above.id = 2;
    const items: ConveyorItems = new Map([[target.id, [{ type: ITEM_COPPER, progress: 0.4, lateral: 0 }]]]);

    expect(tryAcceptOnConveyor(target, ITEM_IRON, above, items)).toBe(false);
  });

  it('vật phẩm sau cùng đã đi quá 0.05 thì vẫn nhận từ phía sau', () => {
    const target = createEntity(BUILDING_BANNER, 5, 5, 1);
    target.id = 1;
    const source = createEntity(BUILDING_BANNER, 4, 5, 1);
    source.id = 2;
    const items: ConveyorItems = new Map([[target.id, [{ type: ITEM_COPPER, progress: 0.4, lateral: 0 }]]]);

    expect(tryAcceptOnConveyor(target, ITEM_IRON, source, items)).toBe(true);
    expect(items.get(target.id)?.map((item) => item.progress)).toEqual([0, 0.4]);
  });

  it('nguồn nằm trước mặt băng (đi vào đầu ra) → từ chối', () => {
    const target = createEntity(BUILDING_BANNER, 5, 5, 1); // hướng phải
    target.id = 1;
    const ahead = createEntity(BUILDING_BANNER, 6, 5, 1);
    ahead.id = 2;
    const items: ConveyorItems = new Map();

    expect(tryAcceptOnConveyor(target, ITEM_COPPER, ahead, items)).toBe(false);
  });

  it('nguồn xoay được mà hướng ra khỏi băng đích (ngược chiều) → từ chối', () => {
    const target = createEntity(BUILDING_BANNER, 5, 5, 1); // hướng phải
    target.id = 1;
    const source = createEntity(BUILDING_BANNER, 4, 5, 3); // ở bên trái nhưng hướng trái (ra xa target)
    source.id = 2;
    const items: ConveyorItems = new Map();

    expect(tryAcceptOnConveyor(target, ITEM_COPPER, source, items)).toBe(false);
  });

  it('nguồn nhiều ô (máy đào 2×2) vẫn xác định đúng cạnh kề', () => {
    const drill = createEntity(BUILDING_DRILL, 5, 5); // phủ ô 5–6 × 5–6
    drill.id = 1;
    const target = createEntity(BUILDING_BANNER, 7, 5, 1); // kề cạnh phải của drill
    target.id = 2;
    const items: ConveyorItems = new Map();

    expect(tryAcceptOnConveyor(target, ITEM_COPPER, drill, items)).toBe(true);
    expect(items.get(target.id)?.[0]?.progress).toBe(0);
  });

  it('nguồn không kề đích theo 4 hướng → từ chối', () => {
    const target = createEntity(BUILDING_BANNER, 5, 5, 1);
    target.id = 1;
    const far = createEntity(BUILDING_BANNER, 0, 0, 1);
    far.id = 2;
    expect(tryAcceptOnConveyor(target, ITEM_COPPER, far, new Map())).toBe(false);
  });

  it('băng đang xây → từ chối', () => {
    const target = createEntity(BUILDING_BANNER, 5, 5, 1);
    target.id = 1;
    target.constructing = true;
    const source = createEntity(BUILDING_BANNER, 4, 5, 1);
    source.id = 2;
    expect(tryAcceptOnConveyor(target, ITEM_COPPER, source, new Map())).toBe(false);
  });
});
