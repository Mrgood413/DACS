import { BUILDING_BANNER, ITEM_COPPER, ITEM_IRON, TERRAIN_COPPER_ORE, TERRAIN_IRON_ORE } from '../config';
import { isOreTerrain } from '../map/isOreTerrain';
import type { Entity, EnvironmentMap, ItemType, Point } from '../types';
import { getConveyorDirection } from './getConveyorDirection';

/** Thông tin sản xuất của máy đào: số item mỗi giây và các cạnh hợp lệ để đẩy ra. */
export type DrillOutput = {
  /** Số ô quặng nằm dưới máy đào (mỗi ô sản xuất 0.5 item/giây). */
  itemsPerSecond: number;
  /** Loại vật phẩm tạo ra (loại quặng chiếm đa số bên dưới máy; nếu hoà hơn lấy đồng). */
  itemType: ItemType;
  /** Các ô ngay ngoài cạnh máy đào có băng chuyền hợp lệ để nhận item. */
  outputTiles: Point[];
};

/**
 * Phân tích máy đào: đếm ô quặng bên dưới, xác định loại quặng và các băng chuyền cạnh hợp lệ.
 * Băng chuyền hướng thẳng vào máy đào bị loại (không đẩy ngược vào nguồn).
 * @param drill Máy đào (2×2).
 * @param map Map môi trường.
 * @param entities Danh sách thực thể để tìm băng chuyền.
 * @returns Thông tin sản xuất; itemsPerSecond = 0 nếu không có quặng.
 */
export function getDrillOutput(drill: Entity, map: EnvironmentMap, entities: Entity[]): DrillOutput {
  let iron = 0;
  let copper = 0;
  for (let y = drill.y; y < drill.y + drill.height; y++) {
    for (let x = drill.x; x < drill.x + drill.width; x++) {
      const terrain = map.terrain[y * map.width + x] ?? 0;
      if (!isOreTerrain(terrain)) {
        continue;
      }
      if (terrain === TERRAIN_IRON_ORE) {
        iron++;
      } else if (terrain === TERRAIN_COPPER_ORE) {
        copper++;
      }
    }
  }
  const itemsPerSecond = (iron + copper) * 0.5;

  // Các ô ngay ngoài 4 cạnh của khối máy đào.
  const edgeTiles: Point[] = [];
  for (let x = drill.x; x < drill.x + drill.width; x++) {
    edgeTiles.push({ x, y: drill.y - 1 });
    edgeTiles.push({ x, y: drill.y + drill.height });
  }
  for (let y = drill.y; y < drill.y + drill.height; y++) {
    edgeTiles.push({ x: drill.x - 1, y });
    edgeTiles.push({ x: drill.x + drill.width, y });
  }

  const outputTiles: Point[] = [];
  for (const tile of edgeTiles) {
    // Bỏ qua ô ngoài map.
    if (tile.x < 0 || tile.y < 0 || tile.x >= map.width || tile.y >= map.height) {
      continue;
    }
    const conveyor = entities.find(
      (entity) =>
        entity.type === BUILDING_BANNER &&
        entity.x === tile.x &&
        entity.y === tile.y &&
        !entity.constructing,
    );
    if (conveyor === undefined || conveyor === drill) {
      continue;
    }
    // Băng chuyền hướng thẳng vào máy đào → không nhận.
    const dir = getConveyorDirection(conveyor.rotation);
    if (
      (tile.x + dir.x >= drill.x &&
        tile.x + dir.x < drill.x + drill.width &&
        tile.y + dir.y >= drill.y &&
        tile.y + dir.y < drill.y + drill.height)
    ) {
      continue;
    }
    outputTiles.push(tile);
  }

  return {
    itemsPerSecond,
    itemType: copper >= iron ? ITEM_COPPER : ITEM_IRON,
    outputTiles,
  };
}
