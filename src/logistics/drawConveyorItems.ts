import { Graphics } from 'pixi.js';
import { BUILDING_BANNER, ITEM_COLORS, ITEM_SIZE, TILE_SIZE } from '../config';
import type { ConveyorItems, Entity } from '../types';
import { getConveyorDirection } from './getConveyorDirection';

/**
 * Vẽ mọi vật phẩm đang đi trên các băng chuyền (hình vuông màu theo loại).
 * Vật phẩm được đặt theo progress dọc băng trên đường tâm (không lệch ngang).
 * @param graphics Graphics dùng riêng cho vật phẩm (nằm trong lớp thế giới).
 * @param entities Danh sách thực thể.
 * @param conveyorItems Vật phẩm trên băng chuyền.
 */
export function drawConveyorItems(graphics: Graphics, entities: Entity[], conveyorItems: ConveyorItems): void {
  graphics.clear();
  for (const conveyor of entities) {
    if (conveyor.type !== BUILDING_BANNER || conveyor.constructing) {
      continue;
    }
    const items = conveyorItems.get(conveyor.id);
    if (items === undefined) {
      continue;
    }
    const dir = getConveyorDirection(conveyor.rotation);
    const centerX = conveyor.x * TILE_SIZE + TILE_SIZE / 2;
    const centerY = conveyor.y * TILE_SIZE + TILE_SIZE / 2;
    for (const item of items) {
      const x = centerX + dir.x * item.progress * TILE_SIZE - ITEM_SIZE / 2;
      const y = centerY + dir.y * item.progress * TILE_SIZE - ITEM_SIZE / 2;
      graphics.rect(x, y, ITEM_SIZE, ITEM_SIZE).fill(ITEM_COLORS[item.type] ?? 0xff00ff);
    }
  }
}
