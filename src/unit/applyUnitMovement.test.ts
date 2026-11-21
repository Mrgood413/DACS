import { describe, expect, it } from 'vitest';
import { UNIT_DRONE } from '../config';
import { createEntity } from '../entity/createEntity';
import { applyUnitMovement } from './applyUnitMovement';

describe('applyUnitMovement', () => {
  it('đích cách 5 ô, tốc độ 6 ô/giây, 0.5 giây → đi được 3 ô theo hướng (3, 4), chưa tới', () => {
    const drone = createEntity(UNIT_DRONE, 0, 0);
    expect(applyUnitMovement(drone, { x: 3, y: 4 }, 6, 0.5)).toBe(false);
    expect(drone.x).toBeCloseTo(1.8);
    expect(drone.y).toBeCloseTo(2.4);
  });

  it('bước đi dài hơn khoảng cách còn lại → đứng đúng đích, trả true', () => {
    const drone = createEntity(UNIT_DRONE, 0, 0);
    expect(applyUnitMovement(drone, { x: 3, y: 4 }, 6, 1)).toBe(true);
    expect(drone.x).toBe(3);
    expect(drone.y).toBe(4);
  });

  it('đang đứng đúng đích → trả true, không đổi toạ độ', () => {
    const drone = createEntity(UNIT_DRONE, 7, 8);
    expect(applyUnitMovement(drone, { x: 7, y: 8 }, 6, 0.016)).toBe(true);
    expect(drone.x).toBe(7);
    expect(drone.y).toBe(8);
  });
});
