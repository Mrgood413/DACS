import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_DRILL, BUILDING_IRON_WALL, ENV_WALL_STONE, TERRAIN_COPPER_ORE } from '../config';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import { getBuildPreview } from './getBuildPreview';

describe('getBuildPreview', () => {
  const map = createEnvironmentMap(10, 10);

  it('không giữ Shift → đúng 1 bóng ở ô con trỏ, hợp lệ, không ô nào bị chặn', () => {
    expect(getBuildPreview(map, [], [], BUILDING_IRON_WALL, null, { x: 4, y: 5 })).toEqual([
      { type: BUILDING_IRON_WALL, x: 4, y: 5, rotation: 0, valid: true, blockedTiles: [] },
    ]);
  });

  it('máy đào 2×2 có 1 ô trên quặng → hợp lệ', () => {
    const ore = createEnvironmentMap(10, 10);
    ore.terrain[6 * 10 + 5] = TERRAIN_COPPER_ORE;
    const [ghost] = getBuildPreview(ore, [], [], BUILDING_DRILL, null, { x: 4, y: 5 });
    expect(ghost?.valid).toBe(true);
    expect(ghost?.blockedTiles).toEqual([]);
  });

  it('máy đào trên toàn cỏ → không hợp lệ, cả 4 ô bị chặn', () => {
    const [ghost] = getBuildPreview(map, [], [], BUILDING_DRILL, null, { x: 4, y: 5 });
    expect(ghost?.valid).toBe(false);
    expect(ghost?.blockedTiles).toHaveLength(4);
  });

  it('tường đặt lên quặng → không hợp lệ', () => {
    const ore = createEnvironmentMap(10, 10);
    ore.terrain[5 * 10 + 4] = TERRAIN_COPPER_ORE;
    expect(getBuildPreview(ore, [], [], BUILDING_IRON_WALL, null, { x: 4, y: 5 })[0]?.valid).toBe(false);
  });

  it('giữ Shift kéo từ (1, 2) tới (4, 2) → hàng 4 bóng', () => {
    const ghosts = getBuildPreview(map, [], [], BUILDING_IRON_WALL, { x: 1, y: 2 }, { x: 4, y: 2 });
    expect(ghosts.map((g) => g.x)).toEqual([1, 2, 3, 4]);
    expect(ghosts.every((g) => g.valid)).toBe(true);
  });

  it('ô có tường đá giữa hàng → riêng bóng đó không hợp lệ, các bóng khác vẫn hợp lệ', () => {
    const rocky = createEnvironmentMap(10, 10);
    rocky.wall[2 * 10 + 3] = ENV_WALL_STONE;
    const ghosts = getBuildPreview(rocky, [], [], BUILDING_IRON_WALL, { x: 1, y: 2 }, { x: 4, y: 2 });
    expect(ghosts.map((g) => g.valid)).toEqual([true, true, false, true]);
  });

  it('hướng xoay: băng chuyền giữ hướng được truyền vào (5 → 1), tường không xoay được luôn là 0', () => {
    expect(getBuildPreview(map, [], [], BUILDING_BANNER, null, { x: 4, y: 5 }, 2)[0]?.rotation).toBe(2);
    expect(getBuildPreview(map, [], [], BUILDING_BANNER, null, { x: 4, y: 5 }, 5)[0]?.rotation).toBe(1);
    expect(getBuildPreview(map, [], [], BUILDING_IRON_WALL, null, { x: 4, y: 5 }, 3)[0]?.rotation).toBe(0);
  });

  it('con trỏ ngoài map → bóng không hợp lệ', () => {
    expect(getBuildPreview(map, [], [], BUILDING_IRON_WALL, null, { x: -3, y: 0 })[0]?.valid).toBe(false);
  });
});
