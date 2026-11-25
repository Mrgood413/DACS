import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_ROUTER, ITEM_COPPER, ITEM_IRON, ROUTER_CAPACITY } from '../config';
import { createEntity } from '../entity/createEntity';
import type { ConveyorItems } from '../types';
import { updateRouters } from './updateRouters';

describe('updateRouters', () => {
  it('router có item, extra khác rotation → dump, xoay hướng', () => {
    const router = createEntity(BUILDING_ROUTER, 5, 5, 1); // hướng phải
    router.id = 1;
    router.routerInventory = new Map([[ITEM_COPPER, 1]]);
    router.routerExtra = 0; // item đến từ hướng lên, khác rotation=1
    const conveyor = createEntity(BUILDING_BANNER, 6, 5, 1);
    conveyor.id = 2;
    const items: ConveyorItems = new Map();

    updateRouters([router, conveyor], items, 0);

    // Item bị dump sang conveyor phía phải (hướng rotation=1).
    expect(items.get(conveyor.id)).toEqual([{ type: ITEM_COPPER, progress: 0 }]);
    // Kho router trống.
    expect(router.routerInventory?.size).toBe(0);
    // Trong Router.java, extra KHÔNG đổi khi dump (chỉ đổi khi item mới đến qua handleItem).
    // extra vẫn giữ nguyên giá trị ban đầu = 0.
    expect(router.routerExtra).toBe(0);
    // Hướng bị xoay sang kế tiếp (1 → 2).
    expect(router.rotation).toBe(2);
  });

  it('router extra bằng rotation và không may mắn (random=0) → không dump, vẫn xoay', () => {
    // Math.random bị mock sẵn bằng vitest? Ta dùng cách kiểm tra rotation xoay dù không dump.
    const router = createEntity(BUILDING_ROUTER, 5, 5, 1); // hướng phải
    router.id = 1;
    router.routerInventory = new Map([[ITEM_COPPER, 1]]);
    router.routerExtra = 1; // item đến từ hướng phải, bằng rotation=1
    const conveyor = createEntity(BUILDING_BANNER, 6, 5, 1);
    conveyor.id = 2;
    const items: ConveyorItems = new Map();

    // Giả lập Math.random trả 1 (không bao giờ < 0.35) → không dump.
    const origRandom = Math.random;
    Math.random = () => 1;
    try {
      updateRouters([router, conveyor], items, 0);
    } finally {
      Math.random = origRandom;
    }

    // Không dump vì extra == rotation và random không may.
    expect(items.size).toBe(0);
    expect(router.routerInventory?.get(ITEM_COPPER)).toBe(1);
    // Nhưng rotation vẫn xoay (1 → 2).
    expect(router.rotation).toBe(2);
  });

  it('router trống kho → không làm gì, không xoay', () => {
    const router = createEntity(BUILDING_ROUTER, 5, 5, 1);
    router.id = 1;
    router.routerInventory = new Map();
    const conveyor = createEntity(BUILDING_BANNER, 6, 5, 1);
    conveyor.id = 2;
    const items: ConveyorItems = new Map();

    updateRouters([router, conveyor], items, 0);

    expect(items.size).toBe(0);
    expect(router.rotation).toBe(1); // không xoay vì không có item
  });

  it('router không có conveyor phía trước rotation → không dump, vẫn xoay', () => {
    const router = createEntity(BUILDING_ROUTER, 5, 5, 1); // hướng phải, ô (6,5) trống
    router.id = 1;
    router.routerInventory = new Map([[ITEM_IRON, 3]]);
    router.routerExtra = 0; // khác rotation → muốn dump
    const items: ConveyorItems = new Map();

    updateRouters([router], items, 0);

    expect(items.size).toBe(0);
    expect(router.routerInventory?.get(ITEM_IRON)).toBe(3);
    // Rotation vẫn xoay dù không có conveyor.
    expect(router.rotation).toBe(2);
  });

  it('router chứa nhiều loại → dump loại đầu tiên, xoay hướng', () => {
    const router = createEntity(BUILDING_ROUTER, 5, 5, 0); // hướng lên
    router.id = 1;
    router.routerInventory = new Map([
      [ITEM_COPPER, 2],
      [ITEM_IRON, 1],
    ]);
    router.routerExtra = 1; // khác rotation=0 → dump
    const conveyor = createEntity(BUILDING_BANNER, 5, 4, 0); // phía trên (hướng lên)
    conveyor.id = 2;
    const items: ConveyorItems = new Map();

    updateRouters([router, conveyor], items, 0);

    expect(items.get(conveyor.id)).toEqual([{ type: ITEM_COPPER, progress: 0 }]);
    expect(router.routerInventory?.get(ITEM_COPPER)).toBe(1);
    expect(router.routerInventory?.get(ITEM_IRON)).toBe(1);
    // Trong Router.java, extra KHÔNG đổi khi dump. extra vẫn giữ nguyên = 1.
    expect(router.routerExtra).toBe(1);
    expect(router.rotation).toBe(1);
  });

  it('router đang xây → không xử lý', () => {
    const router = createEntity(BUILDING_ROUTER, 5, 5, 1);
    router.id = 1;
    router.constructing = true;
    router.routerInventory = new Map([[ITEM_COPPER, 1]]);
    const conveyor = createEntity(BUILDING_BANNER, 6, 5, 1);
    conveyor.id = 2;
    const items: ConveyorItems = new Map();

    updateRouters([router, conveyor], items, 0);

    expect(items.size).toBe(0);
    expect(router.routerInventory?.get(ITEM_COPPER)).toBe(1);
    expect(router.rotation).toBe(1); // không xoay vì đang xây
  });

  it('router dump thành công thì conveyor phía sau nhận item với progress 0', () => {
    const router = createEntity(BUILDING_ROUTER, 5, 5, 1);
    router.id = 1;
    router.routerInventory = new Map([[ITEM_IRON, 1]]);
    router.routerExtra = 0;
    const conveyor = createEntity(BUILDING_BANNER, 6, 5, 1); // bên phải
    conveyor.id = 2;
    const items: ConveyorItems = new Map();

    updateRouters([router, conveyor], items, 0);

    expect(items.get(conveyor.id)).toEqual([{ type: ITEM_IRON, progress: 0 }]);
  });
});
