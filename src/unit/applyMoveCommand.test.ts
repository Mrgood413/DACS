import { describe, expect, it } from 'vitest';
import { UNIT_DRONE } from '../config';
import { createEntity } from '../entity/createEntity';
import type { MoveOrders } from '../types';
import { applyMoveCommand } from './applyMoveCommand';

const map = { width: 100, height: 100 };

describe('applyMoveCommand', () => {
  const drone = { ...createEntity(UNIT_DRONE, 0, 0), id: 1 };

  it('đơn vị được chọn → thêm lệnh đi tới điểm bấm', () => {
    const orders: MoveOrders = new Map();
    applyMoveCommand(orders, [drone], [1], 320, 640, map);
    expect(orders.get(1)).toEqual({ x: 9.5, y: 19.5 });
  });

  it('lệnh mới ghi đè lệnh cũ của cùng đơn vị', () => {
    const orders: MoveOrders = new Map([[1, { x: 50, y: 50 }]]);
    applyMoveCommand(orders, [drone], [1], 320, 640, map);
    expect(orders.size).toBe(1);
    expect(orders.get(1)).toEqual({ x: 9.5, y: 19.5 });
  });

  it('không chọn đơn vị nào → không thêm lệnh', () => {
    const orders: MoveOrders = new Map();
    applyMoveCommand(orders, [drone], [], 320, 640, map);
    expect(orders.size).toBe(0);
  });

  it('id không tồn tại → bỏ qua', () => {
    const orders: MoveOrders = new Map();
    applyMoveCommand(orders, [drone], [99], 320, 640, map);
    expect(orders.size).toBe(0);
  });
});
