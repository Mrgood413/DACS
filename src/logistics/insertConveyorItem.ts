import type { ConveyorItem } from '../types';

/**
 * Chèn một vật phẩm vào danh sách vật phẩm của băng chuyền, giữ danh sách sắp xếp tăng dần theo progress.
 * Vật phẩm đứng sau (progress nhỏ hơn) luôn nằm trước trong mảng, giống Mindustry.
 * @param items Danh sách vật phẩm của một băng chuyền (sửa tại chỗ).
 * @param item Vật phẩm cần chèn.
 */
export function insertConveyorItem(items: ConveyorItem[], item: ConveyorItem): void {
  let index = items.length;
  for (let i = 0; i < items.length; i++) {
    if (items[i].progress > item.progress) {
      index = i;
      break;
    }
  }
  items.splice(index, 0, item);
}
