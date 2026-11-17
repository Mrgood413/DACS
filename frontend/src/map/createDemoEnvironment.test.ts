import { describe, expect, it } from 'vitest';
import {
  ENV_WALL_BUSH,
  ENV_WALL_GRASS,
  ENV_WALL_NONE,
  ENV_WALL_STONE,
  TERRAIN_COPPER_ORE,
  TERRAIN_GRASS,
  TERRAIN_IRON_ORE,
  TERRAIN_SAND,
  TERRAIN_WATER,
} from '../config';
import { createEnvironmentMap } from './createEnvironmentMap';
import { createDemoEnvironment } from './createDemoEnvironment';

describe('createDemoEnvironment', () => {
  it('đủ 5 loại địa hình đều xuất hiện trong map demo', () => {
    const map = createDemoEnvironment(createEnvironmentMap(100, 100));
    const terrainIds = new Set(map.terrain);
    for (const id of [TERRAIN_GRASS, TERRAIN_IRON_ORE, TERRAIN_COPPER_ORE, TERRAIN_SAND, TERRAIN_WATER]) {
      expect(terrainIds.has(id)).toBe(true);
    }
  });

  it('đủ 3 loại tường đều xuất hiện trong map demo', () => {
    const map = createDemoEnvironment(createEnvironmentMap(100, 100));
    const wallIds = new Set(map.wall);
    for (const id of [ENV_WALL_NONE, ENV_WALL_STONE, ENV_WALL_GRASS, ENV_WALL_BUSH]) {
      expect(wallIds.has(id)).toBe(true);
    }
  });

  it('phần lớn map vẫn là cỏ (trên 80% ô)', () => {
    const map = createDemoEnvironment(createEnvironmentMap(100, 100));
    let grass = 0;
    for (const terrain of map.terrain) {
      if (terrain === TERRAIN_GRASS) {
        grass++;
      }
    }
    expect(grass).toBeGreaterThan(8000);
  });

  it('bố cục demo dạng lưới: mỗi loại 1 ô, từ dưới đi lên, mỗi hàng từ phải qua trái', () => {
    const map = createDemoEnvironment(createEnvironmentMap(100, 100));
    const at = (x: number, y: number) => map.terrain[y * 100 + x];
    const wallAt = (x: number, y: number) => map.wall[y * 100 + x];

    // Lưới 3×3 ở góc dưới-trái, mỗi ô đứng giữa chỗ 6×6 của nó.
    // Hàng dưới (y=7): nước phải nhất → cát → quặng đồng trái nhất.
    expect(at(19, 7)).toBe(TERRAIN_WATER);
    expect(at(13, 7)).toBe(TERRAIN_SAND);
    expect(at(7, 7)).toBe(TERRAIN_COPPER_ORE);
    // Hàng giữa (y=13): quặng sắt phải nhất → tường đá → tường cỏ trái nhất.
    expect(at(19, 13)).toBe(TERRAIN_IRON_ORE);
    expect(wallAt(13, 13)).toBe(ENV_WALL_STONE);
    expect(wallAt(7, 13)).toBe(ENV_WALL_GRASS);
    // Hàng trên (y=19): tường bụi cây phải nhất.
    expect(wallAt(19, 19)).toBe(ENV_WALL_BUSH);

    // Mỗi loại chỉ đúng 1 ô (các ô kề cạnh là cỏ / không tường).
    for (const [x, y] of [[19, 7], [13, 7], [7, 7], [19, 13], [13, 13], [7, 13], [19, 19]] as Array<[number, number]>) {
      expect(at(x - 1, y)).toBe(TERRAIN_GRASS);
      expect(at(x + 1, y)).toBe(TERRAIN_GRASS);
      expect(wallAt(x - 1, y)).toBe(ENV_WALL_NONE);
      expect(wallAt(x + 1, y)).toBe(ENV_WALL_NONE);
    }
  });

  it('các ô demo cùng hàng ngang hàng nhau (cùng y) và cách nhau đều 6 ô', () => {
    const map = createDemoEnvironment(createEnvironmentMap(100, 100));
    const at = (x: number, y: number) => map.terrain[y * 100 + x];
    const wallAt = (x: number, y: number) => map.wall[y * 100 + x];
    // Hàng dưới: 3 ô cùng y=7, cách nhau 6 ô.
    expect(at(19, 7)).toBe(TERRAIN_WATER);
    expect(at(13, 7)).toBe(TERRAIN_SAND);
    expect(at(7, 7)).toBe(TERRAIN_COPPER_ORE);
    // Hàng giữa: 3 ô cùng y=13 (trong đó 1 ô địa hình, 2 ô tường).
    expect(at(19, 13)).toBe(TERRAIN_IRON_ORE);
    expect(wallAt(13, 13)).toBe(ENV_WALL_STONE);
    expect(wallAt(7, 13)).toBe(ENV_WALL_GRASS);
    // Giữa các hàng là khoảng trống (cỏ, không tường).
    for (const y of [10, 16]) {
      expect(at(19, y)).toBe(TERRAIN_GRASS);
      expect(wallAt(19, y)).toBe(ENV_WALL_NONE);
    }
  });

  it('thêm tường không ghi đè địa hình (các ô tường vẫn là cỏ)', () => {
    const map = createDemoEnvironment(createEnvironmentMap(100, 100));
    // Ba ô tường (13,13), (7,13), (19,19) đều không phải ô địa hình demo → bên dưới vẫn là cỏ.
    for (const [x, y] of [[13, 13], [7, 13], [19, 19]] as Array<[number, number]>) {
      expect(map.terrain[y * 100 + x]).toBe(TERRAIN_GRASS);
      expect(map.wall[y * 100 + x]).not.toBe(ENV_WALL_NONE);
    }
  });

  it('không ghi dữ liệu ngoài phạm vi map (map 10×10 chỉ nhận các ô nằm trọn trong map)', () => {
    const small = createDemoEnvironment(createEnvironmentMap(10, 10));
    // Mọi ô của map nhỏ phải thuộc một trong 5 mã địa hình và 4 mã tường (không undefined).
    for (const terrain of small.terrain) {
      expect([TERRAIN_GRASS, TERRAIN_IRON_ORE, TERRAIN_COPPER_ORE, TERRAIN_SAND, TERRAIN_WATER]).toContain(terrain);
    }
    for (const wall of small.wall) {
      expect([ENV_WALL_NONE, ENV_WALL_STONE, ENV_WALL_GRASS, ENV_WALL_BUSH]).toContain(wall);
    }
    // Trong map 10×10 chỉ ô quặng đồng (7,7) nằm trọn trong lưới demo; ô khác vẫn cỏ, không tường.
    expect(small.terrain[7 * 10 + 7]).toBe(TERRAIN_COPPER_ORE);
    for (let i = 0; i < 100; i++) {
      if (i !== 7 * 10 + 7) {
        expect(small.terrain[i]).toBe(TERRAIN_GRASS);
        expect(small.wall[i]).toBe(ENV_WALL_NONE);
      }
    }
  });

  it('trả về chính object map truyền vào (sửa tại chỗ)', () => {
    const map = createEnvironmentMap(100, 100);
    expect(createDemoEnvironment(map)).toBe(map);
  });
});
