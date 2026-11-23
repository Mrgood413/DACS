import { describe, expect, it } from 'vitest';
import { BUILDING_DRILL, BUILDING_IRON_WALL, UNIT_DRONE } from '../config';
import { createConstructionSite } from '../entity/createConstructionSite';
import { createEntity } from '../entity/createEntity';
import type { BuildPlan, BuildQueues } from '../types';
import { applyCancelPlanAt } from './applyCancelPlanAt';

const plan = (type: number, x: number, y: number, entityId: number | null = null): BuildPlan => ({
  type,
  x,
  y,
  rotation: 0,
  entityId,
});

describe('applyCancelPlanAt', () => {
  it('bấm vào công trình chưa bắt đầu → bỏ khỏi hàng chờ, các công trình khác giữ nguyên thứ tự', () => {
    const queues: BuildQueues = new Map([
      [1, [plan(BUILDING_IRON_WALL, 1, 1), plan(BUILDING_IRON_WALL, 2, 1), plan(BUILDING_IRON_WALL, 3, 1)]],
    ]);
    expect(applyCancelPlanAt(queues, [], { x: 2, y: 1 })).toEqual({ cancelled: true, removedEntityId: null });
    expect(queues.get(1)?.map((p) => p.x)).toEqual([1, 3]);
  });

  it('bấm vào bất kỳ ô nào của drill 2×2 → huỷ được', () => {
    const queues: BuildQueues = new Map([[1, [plan(BUILDING_DRILL, 4, 4)]]]);
    expect(applyCancelPlanAt(queues, [], { x: 5, y: 5 }).cancelled).toBe(true);
  });

  it('huỷ công trình cuối cùng → hàng chờ của drone bị xoá', () => {
    const queues: BuildQueues = new Map([[1, [plan(BUILDING_IRON_WALL, 1, 1)]]]);
    applyCancelPlanAt(queues, [], { x: 1, y: 1 });
    expect(queues.size).toBe(0);
  });

  it('công trình đang xây dở → xoá luôn khỏi entities, trả id để xoá hình', () => {
    const drone = { ...createEntity(UNIT_DRONE, 0, 0), id: 1 };
    const site = createConstructionSite(5, BUILDING_IRON_WALL, 3, 3);
    const entities = [drone, site];
    const queues: BuildQueues = new Map([[1, [plan(BUILDING_IRON_WALL, 3, 3, 5)]]]);
    expect(applyCancelPlanAt(queues, entities, { x: 3, y: 3 })).toEqual({ cancelled: true, removedEntityId: 5 });
    expect(entities).toEqual([drone]);
  });

  it('bấm chỗ không có công trình chờ → không huỷ gì', () => {
    const queues: BuildQueues = new Map([[1, [plan(BUILDING_IRON_WALL, 1, 1)]]]);
    expect(applyCancelPlanAt(queues, [], { x: 8, y: 8 })).toEqual({ cancelled: false, removedEntityId: null });
    expect(queues.get(1)).toHaveLength(1);
  });
});
