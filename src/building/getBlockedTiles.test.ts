import { describe, expect, it } from 'vitest';
import { BUILDING_CORE, BUILDING_DRILL, BUILDING_IRON_WALL, TERRAIN_IRON_ORE, UNIT_DRONE } from '../config';
import { createEntity } from '../entity/createEntity';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import { getBlockedTiles } from './getBlockedTiles';

/** Map 10×10 toàn cỏ, các ô cho trước là quặng sắt. */
function mapWithOre(...tiles: Array<[number, number]>) {
  const map = createEnvironmentMap(10, 10);
  for (const [x, y] of tiles) {
    map.terrain[y * 10 + x] = TERRAIN_IRON_ORE;
  }
  return map;
}

describe('getBlockedTiles — công trình thường (không phải máy đào)', () => {
  it('ô cỏ trống → không ô nào bị chặn', () => {
    expect(getBlockedTiles(mapWithOre(), [], [], BUILDING_IRON_WALL, 2, 2)).toEqual([]);
  });

  it('đặt lên quặng → ô quặng bị chặn (chỉ máy đào được đặt lên quặng)', () => {
    expect(getBlockedTiles(mapWithOre([2, 2]), [], [], BUILDING_IRON_WALL, 2, 2)).toEqual([{ x: 2, y: 2 }]);
  });

  it('core 3×3 chồng 1 ô lên công trình có sẵn → đúng ô chồng bị chặn', () => {
    const wall = createEntity(BUILDING_IRON_WALL, 4, 4);
    expect(getBlockedTiles(mapWithOre(), [wall], [], BUILDING_CORE, 2, 2)).toEqual([{ x: 4, y: 4 }]);
  });

  it('chồng lên công trình đang chờ xây → ô chồng bị chặn', () => {
    const plan = { type: BUILDING_IRON_WALL, x: 3, y: 2, rotation: 0, entityId: null };
    expect(getBlockedTiles(mapWithOre(), [], [plan], BUILDING_CORE, 2, 2)).toEqual([{ x: 3, y: 2 }]);
  });

  it('drone đứng trên ô không chặn', () => {
    const drone = createEntity(UNIT_DRONE, 2, 2);
    expect(getBlockedTiles(mapWithOre(), [drone], [], BUILDING_IRON_WALL, 2, 2)).toEqual([]);
  });
});

describe('getBlockedTiles — máy đào', () => {
  it('có đúng 1 ô quặng bên dưới, 3 ô còn lại là cỏ → đặt được', () => {
    expect(getBlockedTiles(mapWithOre([5, 5]), [], [], BUILDING_DRILL, 4, 4)).toEqual([]);
  });

  it('cả 4 ô đều là quặng → đặt được', () => {
    expect(getBlockedTiles(mapWithOre([4, 4], [5, 4], [4, 5], [5, 5]), [], [], BUILDING_DRILL, 4, 4)).toEqual([]);
  });

  it('không có ô quặng nào bên dưới → cả 4 ô bị chặn', () => {
    expect(getBlockedTiles(mapWithOre(), [], [], BUILDING_DRILL, 4, 4)).toEqual([
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
    ]);
  });

  it('có quặng nhưng thò ra mép phải map → 2 ô ngoài map bị chặn', () => {
    expect(getBlockedTiles(mapWithOre([9, 0]), [], [], BUILDING_DRILL, 9, 0)).toEqual([
      { x: 10, y: 0 },
      { x: 10, y: 1 },
    ]);
  });

  it('có quặng nhưng chồng lên công trình khác → ô chồng bị chặn', () => {
    const wall = createEntity(BUILDING_IRON_WALL, 4, 4);
    expect(getBlockedTiles(mapWithOre([5, 5]), [wall], [], BUILDING_DRILL, 4, 4)).toEqual([{ x: 4, y: 4 }]);
  });
});
