import { describe, expect, it } from 'vitest';
import { ENV_WALL_NONE, TERRAIN_GRASS } from '../config';
import { createEnvironmentMap } from './createEnvironmentMap';

describe('createEnvironmentMap', () => {
  it('tạo map 3×2: terrain toàn cỏ, wall toàn NONE', () => {
    const map = createEnvironmentMap(3, 2);
    expect(map.width).toBe(3);
    expect(map.height).toBe(2);
    expect(map.terrain.length).toBe(6);
    expect(map.wall.length).toBe(6);
    for (const terrain of map.terrain) {
      expect(terrain).toBe(TERRAIN_GRASS);
    }
    for (const wall of map.wall) {
      expect(wall).toBe(ENV_WALL_NONE);
    }
  });

  it('tạo map 100×100 đủ 10000 ô cho từng lớp', () => {
    const map = createEnvironmentMap(100, 100);
    expect(map.terrain.length).toBe(10000);
    expect(map.wall.length).toBe(10000);
  });

  it('terrain và wall là hai mảng độc lập', () => {
    const map = createEnvironmentMap(2, 2);
    map.terrain[0] = 99;
    expect(map.wall[0]).toBe(ENV_WALL_NONE);
  });

  it('kích thước không hợp lệ thì ném lỗi', () => {
    expect(() => createEnvironmentMap(0, 5)).toThrow('Kích thước map không hợp lệ');
    expect(() => createEnvironmentMap(2.5, 3)).toThrow('Kích thước map không hợp lệ');
  });
});
