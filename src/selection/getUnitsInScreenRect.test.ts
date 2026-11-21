import { describe, expect, it } from 'vitest';
import { BUILDING_CORE, UNIT_BUG, UNIT_DRONE } from '../config';
import { createEntity } from '../entity/createEntity';
import type { Entity, EntityType } from '../types';
import { getUnitsInScreenRect } from './getUnitsInScreenRect';

/** Tạo thực thể có id cho trước. */
function entityWithId(id: number, type: EntityType, x: number, y: number): Entity {
  return { ...createEntity(type, x, y), id };
}

const NO_OFFSET = { x: 0, y: 0 };

describe('getUnitsInScreenRect', () => {
  // Drone ở ô (5, 5) → chiếm pixel thế giới 160..192.
  const drone = entityWithId(1, UNIT_DRONE, 5, 5);

  it('hộp kéo trùm một phần drone → chọn drone', () => {
    expect(getUnitsInScreenRect([drone], { x: 150, y: 150, width: 20, height: 20 }, NO_OFFSET)).toEqual([1]);
  });

  it('click (hộp kích thước 0) ngay trên drone → chọn drone', () => {
    expect(getUnitsInScreenRect([drone], { x: 170, y: 170, width: 0, height: 0 }, NO_OFFSET)).toEqual([1]);
  });

  it('hộp ở chỗ trống → không chọn gì', () => {
    expect(getUnitsInScreenRect([drone], { x: 0, y: 0, width: 50, height: 50 }, NO_OFFSET)).toEqual([]);
  });

  it('tính theo vị trí camera: world dời (-100, -100) → điểm màn hình (70, 70) là điểm thế giới (170, 170)', () => {
    expect(getUnitsInScreenRect([drone], { x: 70, y: 70, width: 0, height: 0 }, { x: -100, y: -100 })).toEqual([1]);
  });

  it('chỉ chọn đơn vị của người chơi: bỏ qua quái và công trình trong hộp', () => {
    const entities = [
      entityWithId(1, UNIT_BUG, 1, 1),
      entityWithId(2, BUILDING_CORE, 2, 2),
      entityWithId(3, UNIT_DRONE, 3, 3),
    ];
    expect(getUnitsInScreenRect(entities, { x: 0, y: 0, width: 500, height: 500 }, NO_OFFSET)).toEqual([3]);
  });

  it('danh sách rỗng → mảng rỗng', () => {
    expect(getUnitsInScreenRect([], { x: 0, y: 0, width: 500, height: 500 }, NO_OFFSET)).toEqual([]);
  });
});
