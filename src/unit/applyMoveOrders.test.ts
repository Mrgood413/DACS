import { describe, expect, it } from 'vitest';
import { UNIT_DRONE } from '../config';
import { createEntity } from '../entity/createEntity';
import type { MoveOrders } from '../types';
import { applyMoveOrders } from './applyMoveOrders';

describe('applyMoveOrders', () => {
  it('đơn vị chưa tới đích → đi một bước, lệnh vẫn còn', () => {
    const drone = { ...createEntity(UNIT_DRONE, 0, 0), id: 1 };
    const orders: MoveOrders = new Map([[1, { x: 10, y: 0 }]]);
    applyMoveOrders([drone], orders, 6, 0.5);
    expect(drone.x).toBeCloseTo(3);
    expect(orders.has(1)).toBe(true);
  });

  it('đơn vị tới đích → đứng đúng đích, lệnh bị xoá', () => {
    const drone = { ...createEntity(UNIT_DRONE, 0, 0), id: 1 };
    const orders: MoveOrders = new Map([[1, { x: 2, y: 0 }]]);
    applyMoveOrders([drone], orders, 6, 1);
    expect(drone.x).toBe(2);
    expect(orders.size).toBe(0);
  });

  it('lệnh của đơn vị không còn tồn tại → bị xoá', () => {
    const orders: MoveOrders = new Map([[99, { x: 2, y: 0 }]]);
    applyMoveOrders([], orders, 6, 1);
    expect(orders.size).toBe(0);
  });

  it('đơn vị không có lệnh → không di chuyển', () => {
    const drone = { ...createEntity(UNIT_DRONE, 4, 4), id: 1 };
    applyMoveOrders([drone], new Map(), 6, 1);
    expect(drone.x).toBe(4);
    expect(drone.y).toBe(4);
  });
});
