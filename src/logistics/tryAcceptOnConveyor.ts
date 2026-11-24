import {
  CONVEYOR_ACCEPT_BACK_PROGRESS,
  CONVEYOR_ACCEPT_SIDE_PROGRESS,
} from '../config';
import { getEntityDefinition } from '../entity/getEntityDefinition';
import type { ConveyorItem, ConveyorItems, Entity, ItemType, Point } from '../types';
import { getDirectionBetween } from './getDirectionBetween';
import { insertConveyorItem } from './insertConveyorItem';

/**
 * Tìm ô thuộc khối nguồn nằm ngay cạnh ô đích (nguồn có thể là khối nhiều ô như máy đào 2×2).
 * @param source Thực thể nguồn.
 * @param targetX Toạ độ ô ngang của đích.
 * @param targetY Toạ độ ô dọc của đích.
 * @returns Ô nguồn kề đích, hoặc undefined nếu không kề theo 4 hướng.
 */
function getAdjacentSourceTile(source: Entity, targetX: number, targetY: number): Point | undefined {
  for (let y = source.y; y < source.y + source.height; y++) {
    for (let x = source.x; x < source.x + source.width; x++) {
      if (getDirectionBetween(x, y, targetX, targetY) !== -1) {
        return { x, y };
      }
    }
  }
  return undefined;
}

/**
 * Lấy tiến độ của vật phẩm nằm sau cùng trên băng chuyền (nhỏ nhất); băng trống thì coi như 1.
 * Mindustry gọi giá trị này là minitem và dùng nó để biết còn chỗ cho vật phẩm mới hay không.
 * @param items Danh sách vật phẩm đã sắp xếp tăng dần theo progress.
 * @returns Tiến độ nhỏ nhất, hoặc 1 nếu danh sách rỗng.
 */
function getBackProgress(items: ConveyorItem[]): number {
  if (items.length === 0) {
    return 1;
  }
  let smallest = items[0].progress;
  for (const item of items) {
    if (item.progress < smallest) {
      smallest = item.progress;
    }
  }
  return smallest;
}

/**
 * Thử đưa một vật phẩm từ nguồn vào băng chuyền đích theo đúng luật của Mindustry:
 * - Vào từ phía sau đuôi băng: chỉ cần vật phẩm sau cùng đã đi quá CONVEYOR_ACCEPT_BACK_PROGRESS.
 * - Vào từ bên cạnh: nửa sau băng phải trống (vật phẩm sau cùng đi quá CONVEYOR_ACCEPT_SIDE_PROGRESS).
 * - Vào từ đầu ra (nguồn nằm trước mặt băng): từ chối.
 * - Nguồn xoay được mà đang hướng ra khỏi băng đích (ngược chiều): từ chối, giống Mindustry.
 * Vật phẩm vào từ sau có progress 0, vào từ cạnh có progress 0.5 và lệch ngang về phía nguồn.
 * @param target Băng chuyền đích.
 * @param itemType Loại vật phẩm.
 * @param source Thực thể nguồn (băng chuyền khác, máy đào...).
 * @param conveyorItems Trạng thái vật phẩm trên các băng chuyền (sửa tại chỗ).
 * @returns true nếu băng chuyền nhận vật phẩm, false nếu không đủ chỗ hoặc sai hướng.
 */
export function tryAcceptOnConveyor(
  target: Entity,
  itemType: ItemType,
  source: Entity,
  conveyorItems: ConveyorItems,
): boolean {
  if (target.constructing) {
    return false;
  }
  const sourceTile = getAdjacentSourceTile(source, target.x, target.y);
  if (sourceTile === undefined) {
    return false;
  }
  const direction = getDirectionBetween(sourceTile.x, sourceTile.y, target.x, target.y);
  const rotation = ((Math.round(target.rotation) % 4) + 4) % 4;
  const relative = ((direction - rotation) % 4 + 4) % 4;

  if (getEntityDefinition(source.type).rotatable) {
    const sourceRotation = ((Math.round(source.rotation) % 4) + 4) % 4;
    if ((sourceRotation + 2) % 4 === rotation) {
      return false;
    }
  }

  const list = conveyorItems.get(target.id) ?? [];
  const backProgress = getBackProgress(list);
  let progress: number;
  if (relative === 0) {
    if (backProgress <= CONVEYOR_ACCEPT_BACK_PROGRESS) {
      return false;
    }
    progress = 0;
  } else if (relative === 1 || relative === 3) {
    if (backProgress <= CONVEYOR_ACCEPT_SIDE_PROGRESS) {
      return false;
    }
    progress = 0.5;
  } else {
    return false;
  }

  insertConveyorItem(list, { type: itemType, progress });
  conveyorItems.set(target.id, list);
  return true;
}
