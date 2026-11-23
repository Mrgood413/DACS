import { describe, expect, it } from 'vitest';
import { BUILDING_CORE, UNIT_DRONE } from '../config';
import { getLaneLayout } from '../map/getLaneLayout';
import { createStartingEntities } from './createStartingEntities';

describe('createStartingEntities', () => {
  const layout = getLaneLayout(100, 100);
  const entities = createStartingEntities(layout);

  it('đúng 2 thực thể: nhà chính id 1 và drone id 2', () => {
    expect(entities.map((e) => [e.id, e.type])).toEqual([
      [1, BUILDING_CORE],
      [2, UNIT_DRONE],
    ]);
  });

  it('đặt đúng vị trí của bố cục, đầy máu, không đang xây', () => {
    const [core, drone] = entities;
    expect(core).toMatchObject({ x: layout.core.x, y: layout.core.y, width: 3, height: 3, hp: 100, constructing: false });
    expect(drone).toMatchObject({ x: layout.drone.x, y: layout.drone.y });
  });
});
