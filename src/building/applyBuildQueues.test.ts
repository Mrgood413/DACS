import { describe, expect, it } from 'vitest';
import { BUILDING_IRON_WALL, UNIT_DRONE } from '../config';
import { createEntity } from '../entity/createEntity';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import type { BuildQueues, MoveOrders } from '../types';
import { applyBuildQueues } from './applyBuildQueues';

const map = createEnvironmentMap(20, 20);

function setup() {
  const drone = { ...createEntity(UNIT_DRONE, 5, 5), id: 1 };
  const entities = [drone];
  const queues: BuildQueues = new Map([[1, [{ type: BUILDING_IRON_WALL, x: 5, y: 5, rotation: 0, entityId: null }]]]);
  return { drone, entities, queues };
}

describe('applyBuildQueues', () => {
  it('drone rảnh → làm hàng chờ, trả về công trình vừa tạo', () => {
    const { entities, queues } = setup();
    const created = applyBuildQueues(queues, entities, new Map(), map, 6, 0.016);
    expect(created).toHaveLength(1);
    expect(created[0]?.type).toBe(BUILDING_IRON_WALL);
  });

  it('drone đang có lệnh di chuyển → tạm dừng xây, hàng chờ giữ nguyên', () => {
    const { entities, queues } = setup();
    const moveOrders: MoveOrders = new Map([[1, { x: 15, y: 15 }]]);
    expect(applyBuildQueues(queues, entities, moveOrders, map, 6, 0.016)).toEqual([]);
    expect(queues.get(1)).toHaveLength(1);
  });

  it('drone không còn tồn tại → xoá hàng chờ của nó', () => {
    const { queues } = setup();
    applyBuildQueues(queues, [], new Map(), map, 6, 0.016);
    expect(queues.size).toBe(0);
  });

  it('hàng chờ rỗng → bị xoá khỏi danh sách', () => {
    const { entities } = setup();
    const queues: BuildQueues = new Map([[1, []]]);
    applyBuildQueues(queues, entities, new Map(), map, 6, 0.016);
    expect(queues.size).toBe(0);
  });
});
