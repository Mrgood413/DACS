import { describe, expect, it } from 'vitest';
import { ENV_WALL_BUSH, TERRAIN_IRON_ORE, TERRAIN_SAND, TERRAIN_WATER } from '../config';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import { isTerrainBuildable } from './isTerrainBuildable';

/** Map 5×1 với ô (1, 0) đổi thành loại địa hình cho trước. */
function mapWithTerrain(terrain: number) {
  const map = createEnvironmentMap(5, 1);
  map.terrain[1] = terrain;
  return map;
}

describe('isTerrainBuildable', () => {
  it('cỏ và cát → đặt được', () => {
    expect(isTerrainBuildable(createEnvironmentMap(5, 1), 1, 0)).toBe(true);
    expect(isTerrainBuildable(mapWithTerrain(TERRAIN_SAND), 1, 0)).toBe(true);
  });

  it('quặng → nền đất cho phép (luật chỉ máy đào được đặt lên quặng nằm ở getBlockedTiles)', () => {
    expect(isTerrainBuildable(mapWithTerrain(TERRAIN_IRON_ORE), 1, 0)).toBe(true);
  });

  it('nước → không đặt được', () => {
    expect(isTerrainBuildable(mapWithTerrain(TERRAIN_WATER), 1, 0)).toBe(false);
  });

  it('có tường môi trường (bụi cây) → không đặt được', () => {
    const map = createEnvironmentMap(5, 1);
    map.wall[2] = ENV_WALL_BUSH;
    expect(isTerrainBuildable(map, 2, 0)).toBe(false);
  });

  it('ngoài map → không đặt được', () => {
    const map = createEnvironmentMap(5, 1);
    expect(isTerrainBuildable(map, -1, 0)).toBe(false);
    expect(isTerrainBuildable(map, 5, 0)).toBe(false);
    expect(isTerrainBuildable(map, 0, 1)).toBe(false);
  });
});
