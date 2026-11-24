import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_CORE, BUILDING_IRON_WALL, BUILDING_TURRET } from '../config';
import { createConstructionSite } from '../entity/createConstructionSite';
import { createEntity } from '../entity/createEntity';
import { getConveyorTarget } from './getConveyorTarget';

describe('getConveyorTarget', () => {
  it('băng chuyền hướng vào trụ súng → kind turret', () => {
    const conveyor = createEntity(BUILDING_BANNER, 5, 5, 1); // hướng phải
    const turret = createEntity(BUILDING_TURRET, 6, 5);
    expect(getConveyorTarget(conveyor, [conveyor, turret])).toEqual({ kind: 'turret', entity: turret });
  });

  it('băng chuyền hướng vào nhà chính 3×3 → kind core (ô góc trùng)', () => {
    const conveyor = createEntity(BUILDING_BANNER, 5, 8, 0); // hướng lên
    const core = createEntity(BUILDING_CORE, 5, 5); // chiếm (5..7, 5..7)
    const result = getConveyorTarget(conveyor, [conveyor, core]);
    expect(result).toEqual({ kind: 'core', entity: core });
  });

  it('băng chuyền hướng vào băng chuyền khác → kind conveyor', () => {
    const first = createEntity(BUILDING_BANNER, 2, 2, 2); // hướng xuống
    const second = createEntity(BUILDING_BANNER, 2, 3, 2);
    expect(getConveyorTarget(first, [first, second])).toEqual({ kind: 'conveyor', entity: second });
  });

  it('đích đang xây hoặc là tường → kind none', () => {
    const conveyor = createEntity(BUILDING_BANNER, 5, 5, 1);
    const site = createConstructionSite(1, BUILDING_TURRET, 6, 5);
    expect(getConveyorTarget(conveyor, [conveyor, site]).kind).toBe('none');
    const wall = createEntity(BUILDING_IRON_WALL, 6, 5);
    expect(getConveyorTarget(conveyor, [conveyor, wall]).kind).toBe('none');
  });
});
