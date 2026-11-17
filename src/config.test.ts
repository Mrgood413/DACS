import { describe, expect, it } from 'vitest';
import {
  BUILDING_BANNER,
  BUILDING_COPPER_WALL,
  BUILDING_CORE,
  BUILDING_DRILL,
  BUILDING_ELECTRIC_TURRET,
  BUILDING_IRON_WALL,
  BUILDING_TURRET,
  ENV_WALL_BUSH,
  ENV_WALL_GRASS,
  ENV_WALL_NONE,
  ENV_WALL_STONE,
  TERRAIN_COPPER_ORE,
  TERRAIN_GRASS,
  TERRAIN_IRON_ORE,
  TERRAIN_SAND,
  TERRAIN_WATER,
  UNIT_BUG,
  UNIT_DRONE,
} from './config';

describe('ID môi trường', () => {
  it('5 ID địa hình là số nguyên và không trùng nhau', () => {
    const ids = [TERRAIN_GRASS, TERRAIN_IRON_ORE, TERRAIN_COPPER_ORE, TERRAIN_SAND, TERRAIN_WATER];
    for (const id of ids) {
      expect(Number.isInteger(id)).toBe(true);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('4 ID tường môi trường là số nguyên và không trùng nhau', () => {
    const ids = [ENV_WALL_NONE, ENV_WALL_STONE, ENV_WALL_GRASS, ENV_WALL_BUSH];
    for (const id of ids) {
      expect(Number.isInteger(id)).toBe(true);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ID tường không có (ENV_WALL_NONE) bằng 0 — giá trị mặc định của Uint8Array', () => {
    expect(ENV_WALL_NONE).toBe(0);
    expect(new Uint8Array(3)[0]).toBe(ENV_WALL_NONE);
  });

  it('9 ID thực thể là số nguyên, tăng dần 1→9 và không trùng nhau', () => {
    const ids = [
      BUILDING_CORE,
      BUILDING_TURRET,
      BUILDING_ELECTRIC_TURRET,
      BUILDING_DRILL,
      BUILDING_IRON_WALL,
      BUILDING_COPPER_WALL,
      BUILDING_BANNER,
      UNIT_DRONE,
      UNIT_BUG,
    ];
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const id of ids) {
      expect(Number.isInteger(id)).toBe(true);
    }
  });
});
