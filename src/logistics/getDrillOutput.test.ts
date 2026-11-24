import { describe, expect, it } from 'vitest';
import {
  BUILDING_BANNER,
  BUILDING_DRILL,
  ITEM_COPPER,
  ITEM_IRON,
  TERRAIN_COPPER_ORE,
  TERRAIN_IRON_ORE,
} from '../config';
import { createEntity } from '../entity/createEntity';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import { getDrillOutput } from './getDrillOutput';

describe('getDrillOutput', () => {
  it('mỗi ô quặng dưới máy đào = 1 item/s; ưu tiên loại quặng chiếm đa số', () => {
    const map = createEnvironmentMap(20, 20);
    map.terrain[5 * 20 + 5] = TERRAIN_IRON_ORE;
    map.terrain[5 * 20 + 6] = TERRAIN_IRON_ORE;
    map.terrain[6 * 20 + 5] = TERRAIN_COPPER_ORE;
    const drill = createEntity(BUILDING_DRILL, 5, 5);
    expect(getDrillOutput(drill, map, [drill])).toMatchObject({ itemsPerSecond: 3, itemType: ITEM_IRON });
  });

  it('không có quặng thì itemsPerSecond = 0', () => {
    const map = createEnvironmentMap(20, 20);
    const drill = createEntity(BUILDING_DRILL, 5, 5);
    expect(getDrillOutput(drill, map, [drill]).itemsPerSecond).toBe(0);
  });

  it('đồng >= sắt thì itemType là đồng', () => {
    const map = createEnvironmentMap(20, 20);
    map.terrain[5 * 20 + 5] = TERRAIN_COPPER_ORE;
    const drill = createEntity(BUILDING_DRILL, 5, 5);
    expect(getDrillOutput(drill, map, [drill]).itemType).toBe(ITEM_COPPER);
  });

  it('loại bỏ băng chuyền cạnh hướng thẳng vào máy đào; giữ băng hướng ra', () => {
    const map = createEnvironmentMap(20, 20);
    map.terrain[5 * 20 + 5] = TERRAIN_COPPER_ORE;
    const drill = createEntity(BUILDING_DRILL, 5, 5);
    const toward = createEntity(BUILDING_BANNER, 7, 5, 3); // ở phải, hướng trái vào drill
    const away = createEntity(BUILDING_BANNER, 5, 4, 0); // ở trên (y=4), hướng lên (ra ngoài)
    const output = getDrillOutput(drill, map, [drill, toward, away]);
    expect(output.outputTiles).toEqual([{ x: 5, y: 4 }]);
  });
});
