import { describe, expect, it } from 'vitest';
import { BUILDING_CORE, BUILDING_IRON_WALL, UNIT_DRONE } from '../config';
import { createEntity } from '../entity/createEntity';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import type { BuildPlan, Entity } from '../types';
import { applyBuildStep } from './applyBuildStep';

const map = createEnvironmentMap(20, 20);
const wallPlan = (x: number, y: number): BuildPlan => ({ type: BUILDING_IRON_WALL, x, y, rotation: 0, entityId: null });

/** Drone id 1 đứng sẵn đúng trên ô (x, y). */
function droneAt(x: number, y: number): Entity {
  return { ...createEntity(UNIT_DRONE, x, y), id: 1 };
}

describe('applyBuildStep', () => {
  it('hàng chờ rỗng → không làm gì', () => {
    const drone = droneAt(0, 0);
    expect(applyBuildStep(drone, [], [drone], map, 6, 1)).toBeNull();
    expect(drone.x).toBe(0);
  });

  it('công trình ngoài tầm 5 ô (cách 10 ô) → drone bay về phía nó, chưa tạo công trình', () => {
    const drone = droneAt(0, 0);
    const entities = [drone];
    expect(applyBuildStep(drone, [wallPlan(10, 0)], entities, map, 6, 0.5)).toBeNull();
    expect(drone.x).toBeCloseTo(3);
    expect(entities).toHaveLength(1);
  });

  it('công trình trong tầm (cách 4 ô) → xây luôn, drone không di chuyển', () => {
    const drone = droneAt(0, 0);
    const entities = [drone];
    const site = applyBuildStep(drone, [wallPlan(4, 0)], entities, map, 6, 0.5);
    expect(site).not.toBeNull();
    expect(drone.x).toBe(0);
    expect(drone.y).toBe(0);
  });

  it('công trình cách đúng 5 ô (sát mép tầm) → vẫn xây được', () => {
    const drone = droneAt(0, 0);
    expect(applyBuildStep(drone, [wallPlan(5, 0)], [drone], map, 6, 0.5)).not.toBeNull();
    expect(drone.x).toBe(0);
  });

  it('drone đã tới → tạo công trình 0 máu, đang xây, id mới; plan nhớ id đó', () => {
    const drone = droneAt(5, 5);
    const entities = [drone];
    const queue = [wallPlan(5, 5)];
    const site = applyBuildStep(drone, queue, entities, map, 6, 0.016);
    expect(site).not.toBeNull();
    expect(site?.id).toBe(2);
    expect(site?.hp).toBe(0);
    expect(site?.constructing).toBe(true);
    expect(entities).toContain(site);
    expect(queue[0]?.entityId).toBe(2);
  });

  it('đang xây 0.5 giây → máu tăng 100 / 1 × 0.5 = 50', () => {
    const drone = droneAt(5, 5);
    const entities = [drone];
    const queue = [wallPlan(5, 5)];
    const site = applyBuildStep(drone, queue, entities, map, 6, 0.016);
    applyBuildStep(drone, queue, entities, map, 6, 0.5);
    expect(site?.hp).toBeCloseTo(50);
    expect(site?.constructing).toBe(true);
    expect(queue).toHaveLength(1);
  });

  it('xây đủ 1 giây → đầy máu, xong, bỏ khỏi hàng chờ', () => {
    const drone = droneAt(5, 5);
    const entities = [drone];
    const queue = [wallPlan(5, 5), wallPlan(6, 5)];
    const site = applyBuildStep(drone, queue, entities, map, 6, 0.016);
    applyBuildStep(drone, queue, entities, map, 6, 1);
    expect(site?.hp).toBe(100);
    expect(site?.constructing).toBe(false);
    expect(queue.map((p) => p.x)).toEqual([6]);
  });

  it('chỗ đã bị công trình khác chiếm trước khi bắt đầu → bỏ plan, không tạo gì', () => {
    const drone = droneAt(5, 5);
    const core = { ...createEntity(BUILDING_CORE, 4, 4), id: 7 };
    const entities = [drone, core];
    const queue = [wallPlan(5, 5)];
    expect(applyBuildStep(drone, queue, entities, map, 6, 0.016)).toBeNull();
    expect(queue).toHaveLength(0);
    expect(entities).toHaveLength(2);
  });
});
