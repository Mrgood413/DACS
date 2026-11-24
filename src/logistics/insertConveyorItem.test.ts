import { describe, expect, it } from 'vitest';
import { ITEM_COPPER, ITEM_IRON } from '../config';
import type { ConveyorItem } from '../types';
import { insertConveyorItem } from './insertConveyorItem';

describe('insertConveyorItem', () => {
  it('chèn vào danh sách rỗng', () => {
    const items: ConveyorItem[] = [];
    insertConveyorItem(items, { type: ITEM_COPPER, progress: 0 });
    expect(items).toEqual([{ type: ITEM_COPPER, progress: 0 }]);
  });

  it('giữ danh sách sắp xếp tăng dần theo progress', () => {
    const items: ConveyorItem[] = [
      { type: ITEM_COPPER, progress: 0.2 },
      { type: ITEM_IRON, progress: 0.8 },
    ];
    insertConveyorItem(items, { type: ITEM_COPPER, progress: 0.5 });
    expect(items.map((item) => item.progress)).toEqual([0.2, 0.5, 0.8]);
  });

  it('cùng progress thì vật phẩm mới nằm sau vật phẩm cũ', () => {
    const items: ConveyorItem[] = [{ type: ITEM_COPPER, progress: 0.5 }];
    insertConveyorItem(items, { type: ITEM_IRON, progress: 0.5 });
    expect(items.map((item) => item.type)).toEqual([ITEM_COPPER, ITEM_IRON]);
  });
});
