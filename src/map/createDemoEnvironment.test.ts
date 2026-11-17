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

  it('bố cục demo dạng lưới nối tiếp lưới thực thể: từ dưới đi lên, mỗi hàng từ phải qua trái', () => {
    const map = createDemoEnvironment(createEnvironmentMap(100, 100));
    const at = (x: number, y: number) => map.terrain[y * 100 + x];
    const wallAt = (x: number, y: number) => map.wall[y * 100 + x];

    // Lưới phong cảnh ở đáy map, cùng hệ slot 6×6 với lưới thực thể,
    // chiếm 3 slot bên trái mỗi hàng (slot cột 3→5; 3 slot phải là thực thể).
    // Hàng dưới (y=93): nước (75) → cát (69) → quặng đồng (63).
    expect(at(75, 93)).toBe(TERRAIN_WATER);
    expect(at(69, 93)).toBe(TERRAIN_SAND);
    expect(at(63, 93)).toBe(TERRAIN_COPPER_ORE);
    // Hàng giữa (y=87): quặng sắt (75) → tường đá (69) → tường cỏ (63).
    expect(at(75, 87)).toBe(TERRAIN_IRON_ORE);
    expect(wallAt(69, 87)).toBe(ENV_WALL_STONE);
    expect(wallAt(63, 87)).toBe(ENV_WALL_GRASS);
    // Hàng trên (y=81): tường bụi cây (75).
    expect(wallAt(75, 81)).toBe(ENV_WALL_BUSH);

    // Mỗi loại chỉ đúng 1 ô (các ô kề cạnh là cỏ / không tường).
    for (const [x, y] of [[75, 93], [69, 93], [63, 93], [75, 87], [69, 87], [63, 87], [75, 81]] as Array<[number, number]>) {
      expect(at(x - 1, y)).toBe(TERRAIN_GRASS);
      expect(at(x + 1, y)).toBe(TERRAIN_GRASS);
      expect(wallAt(x - 1, y)).toBe(ENV_WALL_NONE);
      expect(wallAt(x + 1, y)).toBe(ENV_WALL_NONE);
    }
  });

  it('các ô phong cảnh cùng hàng ngang hàng nhau (cùng y), cách đều 6 ô và liền kề lưới thực thể', () => {
    const map = createDemoEnvironment(createEnvironmentMap(100, 100));
    const at = (x: number, y: number) => map.terrain[y * 100 + x];
    const wallAt = (x: number, y: number) => map.wall[y * 100 + x];
    // Hàng dưới: 3 ô cùng y=93, cách nhau 6 ô.
    expect(at(75, 93)).toBe(TERRAIN_WATER);
    expect(at(69, 93)).toBe(TERRAIN_SAND);
    expect(at(63, 93)).toBe(TERRAIN_COPPER_ORE);
    // Hàng giữa: 3 ô cùng y=87 (trong đó 1 ô địa hình, 2 ô tường).
    expect(at(75, 87)).toBe(TERRAIN_IRON_ORE);
    expect(wallAt(69, 87)).toBe(ENV_WALL_STONE);
    expect(wallAt(63, 87)).toBe(ENV_WALL_GRASS);
    // Nhóm phong cảnh liền kề lưới thực thể: ô nước (75,93) cách ô trụ điện trái nhất (81,93) đúng 6 ô,
    // giữa hai nhóm không có khoảng trống lệch hàng.
    expect(at(81, 93)).toBe(TERRAIN_GRASS); // ô trụ điện không ghi địa hình (phong cảnh không đè lên chỗ thực thể)
    // Giữa các hàng là khoảng trống (cỏ, không tường).
    for (const [x, y] of [[75, 90], [75, 84]] as Array<[number, number]>) {
      expect(at(x, y)).toBe(TERRAIN_GRASS);
      expect(wallAt(x, y)).toBe(ENV_WALL_NONE);
    }
  });

  it('thêm tường không ghi đè địa hình (các ô tường vẫn là cỏ)', () => {
    const map = createDemoEnvironment(createEnvironmentMap(100, 100));
    // Ba ô tường (69,87), (63,87), (75,81) đều không phải ô địa hình demo → bên dưới vẫn là cỏ.
    for (const [x, y] of [[69, 87], [63, 87], [75, 81]] as Array<[number, number]>) {
      expect(map.terrain[y * 100 + x]).toBe(TERRAIN_GRASS);
      expect(map.wall[y * 100 + x]).not.toBe(ENV_WALL_NONE);
    }
  });

  it('không ghi dữ liệu ngoài phạm vi map (map 10×10 nhỏ hơn bố cục demo thì bỏ qua, không hỏng dữ liệu)', () => {
    const small = createDemoEnvironment(createEnvironmentMap(10, 10));
    // Mọi ô của map nhỏ phải thuộc một trong 5 mã địa hình và 4 mã tường (không undefined).
    for (const terrain of small.terrain) {
      expect([TERRAIN_GRASS, TERRAIN_IRON_ORE, TERRAIN_COPPER_ORE, TERRAIN_SAND, TERRAIN_WATER]).toContain(terrain);
    }
    for (const wall of small.wall) {
      expect([ENV_WALL_NONE, ENV_WALL_STONE, ENV_WALL_GRASS, ENV_WALL_BUSH]).toContain(wall);
    }
    // Map 10×10 không có ô phong cảnh nào nằm trọn trong map → không bị ghi gì.
    for (let i = 0; i < 100; i++) {
      expect(small.terrain[i]).toBe(TERRAIN_GRASS);
      expect(small.wall[i]).toBe(ENV_WALL_NONE);
    }
  });

  it('trả về chính object map truyền vào (sửa tại chỗ)', () => {
    const map = createEnvironmentMap(100, 100);
    expect(createDemoEnvironment(map)).toBe(map);
  });
});
