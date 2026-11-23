import { describe, expect, it } from 'vitest';
import { TERRAIN_COPPER_ORE, TERRAIN_GRASS, TERRAIN_IRON_ORE, TERRAIN_SAND, TERRAIN_WATER } from '../config';
import { isOreTerrain } from './isOreTerrain';

describe('isOreTerrain', () => {
  it('quặng sắt và quặng đồng → true', () => {
    expect(isOreTerrain(TERRAIN_IRON_ORE)).toBe(true);
    expect(isOreTerrain(TERRAIN_COPPER_ORE)).toBe(true);
  });

  it('cỏ, cát, nước, mã lạ → false', () => {
    expect(isOreTerrain(TERRAIN_GRASS)).toBe(false);
    expect(isOreTerrain(TERRAIN_SAND)).toBe(false);
    expect(isOreTerrain(TERRAIN_WATER)).toBe(false);
    expect(isOreTerrain(999)).toBe(false);
  });
});
