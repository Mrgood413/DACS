import { describe, expect, it } from 'vitest';
import { ENV_WALL_NONE, TERRAIN_GRASS, TERRAIN_WATER } from '../config';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import type { Entity, EnvironmentMap } from '../types';
import { findPath } from './findPath';

function makeEmptyMap(width = 20, height = 20): EnvironmentMap {
  const map = createEnvironmentMap(width, height);
  // Tất cả ô là cỏ, không có tường.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      map.terrain[y * width + x] = TERRAIN_GRASS;
      map.wall[y * width + x] = ENV_WALL_NONE;
    }
  }
  return map;
}

function makeWallMap(width = 20, height = 20): EnvironmentMap {
  const map = makeEmptyMap(width, height);
  // Tạo tường đá ngăn cản đường đi trực tiếp từ (0, 0) đến (19, 19).
  // Tường ở cột x=5, từ y=0 đến y=19 (trừ ô (5, 10) để có một khe hở).
  for (let y = 0; y < height; y++) {
    if (y !== 10) {
      map.wall[y * width + 5] = 1; // ENV_WALL_STONE
    }
  }
  return map;
}

describe('findPath', () => {
  it('đường thẳng không có cản trở → trả về đường đi ngắn nhất', () => {
    const map = makeEmptyMap();
    const entities: Entity[] = [];
    const path = findPath({ x: 0, y: 0 }, { x: 5, y: 5 }, map, entities, 0);
    expect(path).not.toBeNull();
    const firstStep = path![0];
    // Bước đầu tiên phải là (1, 0) hoặc (0, 1) (di chuyển lên hoặc phải).
    expect(
      (firstStep.x === 1 && firstStep.y === 0) || (firstStep.x === 0 && firstStep.y === 1),
    ).toBe(true);
    expect(path![path!.length - 1]).toEqual({ x: 5, y: 5 }); // kết thúc tại đích
  });

  it('cùng vị trí → trả về mảng rỗng', () => {
    const map = makeEmptyMap();
    const entities: Entity[] = [];
    const path = findPath({ x: 5, y: 5 }, { x: 5, y: 5 }, map, entities, 0);
    expect(path).toEqual([]);
  });

  it('đích ngoài ranh giới → trả về null', () => {
    const map = makeEmptyMap();
    const entities: Entity[] = [];
    const path = findPath({ x: 5, y: 5 }, { x: 100, y: 100 }, map, entities, 0);
    expect(path).toBeNull();
  });

  it('bắt đầu ngoài ranh giới → trả về null', () => {
    const map = makeEmptyMap();
    const entities: Entity[] = [];
    const path = findPath({ x: -1, y: 5 }, { x: 5, y: 5 }, map, entities, 0);
    expect(path).toBeNull();
  });

  it('có tường chặn đường thẳng → tìm đường đi vòng qua khe hở', () => {
    const map = makeWallMap();
    const entities: Entity[] = [];
    const path = findPath({ x: 0, y: 0 }, { x: 19, y: 0 }, map, entities, 0);
    expect(path).not.toBeNull();
    // Đường đi không được đi qua bất kỳ ô nào có tường.
    for (const p of path!) {
      const wall = map.wall[p.y * map.width + p.x];
      expect(wall).toBe(0); // ENV_WALL_NONE
    }
  });

  it('điểm đích bị bao vây hoàn toàn bằng tường → trả về null', () => {
    const map = makeEmptyMap();
    // Bao vây ô (10, 10) bằng tường ở 4 phía.
    map.wall[9 * 20 + 10] = 1;   // trên
    map.wall[11 * 20 + 10] = 1;  // dưới
    map.wall[10 * 20 + 9] = 1;   // trái
    map.wall[10 * 20 + 11] = 1;  // phải
    const entities: Entity[] = [];
    const path = findPath({ x: 0, y: 0 }, { x: 10, y: 10 }, map, entities, 0);
    expect(path).toBeNull();
  });

  it('công trình chặn đường → tìm đường khác', () => {
    const map = makeEmptyMap();
    const entities: Entity[] = [
      { id: 1, type: 2, x: 5, y: 0, width: 1, height: 1, rotation: 0, hp: 100, maxHp: 100, constructing: false }, // turret chặn cột 5
    ];
    const path = findPath({ x: 0, y: 0 }, { x: 19, y: 0 }, map, entities, 0);
    expect(path).not.toBeNull();
    // Đường đi không được đi qua ô (5, 0) nơi có turret.
    for (const p of path!) {
      expect(p.x === 5 && p.y === 0).toBe(false);
    }
  });

  it('không đi qua nước', () => {
    const map = makeEmptyMap();
    map.terrain[5 * 20 + 5] = TERRAIN_WATER;
    const entities: Entity[] = [];
    const path = findPath({ x: 4, y: 5 }, { x: 6, y: 5 }, map, entities, 0);
    expect(path).not.toBeNull();
    for (const p of path!) {
      expect(map.terrain[p.y * 20 + p.x]).not.toBe(TERRAIN_WATER);
    }
  });
});
