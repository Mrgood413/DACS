import { describe, expect, it } from 'vitest';
import { ENV_WALL_NONE, ENV_WALL_STONE, TERRAIN_COPPER_ORE, TERRAIN_GRASS, TERRAIN_IRON_ORE } from '../config';
import { createEnvironmentMap } from './createEnvironmentMap';
import { createLaneEnvironment } from './createLaneEnvironment';

// Map 100×100: hành lang cột 38..61; làn sắt x 40..42, làn đồng x 57..59, cả hai y 82..95 (xem getLaneLayout).
const map = createLaneEnvironment(createEnvironmentMap(100, 100));
const wallAt = (x: number, y: number) => map.wall[y * 100 + x];
const terrainAt = (x: number, y: number) => map.terrain[y * 100 + x];

describe('createLaneEnvironment', () => {
  it('hai bên ngoài hành lang là tường đá, từ trên xuống dưới', () => {
    expect(wallAt(0, 0)).toBe(ENV_WALL_STONE);
    expect(wallAt(37, 50)).toBe(ENV_WALL_STONE);
    expect(wallAt(62, 50)).toBe(ENV_WALL_STONE);
    expect(wallAt(99, 99)).toBe(ENV_WALL_STONE);
  });

  it('hành lang (cột 38..61) không có tường, nền cỏ', () => {
    expect(wallAt(38, 0)).toBe(ENV_WALL_NONE);
    expect(wallAt(61, 99)).toBe(ENV_WALL_NONE);
    expect(terrainAt(50, 10)).toBe(TERRAIN_GRASS);
  });

  it('đếm đúng: mỗi hàng có 76 ô tường (100 − 24)', () => {
    let walls = 0;
    for (let x = 0; x < 100; x++) {
      if (wallAt(x, 30) === ENV_WALL_STONE) {
        walls++;
      }
    }
    expect(walls).toBe(76);
  });

  it('làn quặng sắt bên trái, quặng đồng bên phải, ở đáy hành lang', () => {
    expect(terrainAt(40, 82)).toBe(TERRAIN_IRON_ORE);
    expect(terrainAt(42, 95)).toBe(TERRAIN_IRON_ORE);
    expect(terrainAt(57, 82)).toBe(TERRAIN_COPPER_ORE);
    expect(terrainAt(59, 95)).toBe(TERRAIN_COPPER_ORE);
  });

  it('ngay ngoài làn quặng vẫn là cỏ', () => {
    expect(terrainAt(43, 82)).toBe(TERRAIN_GRASS);
    expect(terrainAt(40, 81)).toBe(TERRAIN_GRASS);
    expect(terrainAt(40, 96)).toBe(TERRAIN_GRASS);
  });
});
