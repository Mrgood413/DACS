import { describe, expect, it } from 'vitest';
import {
  BUILDING_BANNER,
  BUILDING_COPPER_WALL,
  BUILDING_CORE,
  BUILDING_DRILL,
  BUILDING_IRON_WALL,
  BUILDING_TURRET,
  UNIT_BUG,
  UNIT_DRONE,
} from '../config';
import { createEntity } from './createEntity';

describe('createEntity', () => {
  it('nhà chính: kích thước 3×3 lấy từ định nghĩa', () => {
    const entity = createEntity(BUILDING_CORE, 10, 20);
    expect(entity).toEqual({
      id: 0,
      type: BUILDING_CORE,
      x: 10,
      y: 20,
      width: 3,
      height: 3,
      rotation: 0,
      hp: 100,
      maxHp: 100,
      constructing: false,
    });
  });

  it('dàn khoan: kích thước 2×2 lấy từ định nghĩa', () => {
    const entity = createEntity(BUILDING_DRILL, 5, 5);
    expect(entity.width).toBe(2);
    expect(entity.height).toBe(2);
  });

  it('trụ súng: kích thước 1×1', () => {
    const entity = createEntity(BUILDING_TURRET, 0, 0);
    expect(entity.width).toBe(1);
    expect(entity.height).toBe(1);
  });

  it('nhóm Unit (drone, bọ): kích thước 1×1', () => {
    const drone = createEntity(UNIT_DRONE, 7, 8);
    const bug = createEntity(UNIT_BUG, 9, 10);
    expect(drone.width).toBe(1);
    expect(bug.width).toBe(1);
  });

  it('băng rôn: rotation 0–3 giữ nguyên', () => {
    expect(createEntity(BUILDING_BANNER, 1, 1, 2).rotation).toBe(2);
    expect(createEntity(BUILDING_BANNER, 1, 1, 0).rotation).toBe(0);
    expect(createEntity(BUILDING_BANNER, 1, 1, 3).rotation).toBe(3);
  });

  it('băng rôn: rotation âm và quá 3 được chuẩn hoá về 0–3', () => {
    expect(createEntity(BUILDING_BANNER, 1, 1, -1).rotation).toBe(3);
    expect(createEntity(BUILDING_BANNER, 1, 1, 4).rotation).toBe(0);
    expect(createEntity(BUILDING_BANNER, 1, 1, 7).rotation).toBe(3);
  });

  it('thực thể không xoay được thì rotation luôn là 0 dù truyền số nào', () => {
    expect(createEntity(BUILDING_CORE, 1, 1, 2).rotation).toBe(0);
    expect(createEntity(UNIT_DRONE, 1, 1, 3).rotation).toBe(0);
    expect(createEntity(BUILDING_IRON_WALL, 1, 1, -2).rotation).toBe(0);
  });

  it('toạ độ không hợp lệ → ném lỗi', () => {
    expect(() => createEntity(BUILDING_CORE, -1, 0)).toThrow('Toạ độ thực thể không hợp lệ');
    expect(() => createEntity(BUILDING_CORE, 0, -1)).toThrow('Toạ độ thực thể không hợp lệ');
    expect(() => createEntity(BUILDING_CORE, 1.5, 0)).toThrow('Toạ độ thực thể không hợp lệ');
  });
});
