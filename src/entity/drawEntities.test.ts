import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_CORE, UNIT_DRONE, TILE_SIZE } from '../config';
import { createEntity } from './createEntity';
import { drawEntities } from './drawEntities';

describe('drawEntities', () => {
  it('số đối tượng con bằng số dữ liệu đầu vào', () => {
    const entities = [
      createEntity(BUILDING_CORE, 1, 2),
      createEntity(UNIT_DRONE, 3, 4),
      createEntity(BUILDING_BANNER, 5, 6, 1),
    ];
    expect(drawEntities(entities).children.length).toBe(3);
  });

  it('danh sách rỗng → Container trống', () => {
    expect(drawEntities([]).children.length).toBe(0);
  });

  it('đặt đúng toạ độ thế giới (ô × TILE_SIZE)', () => {
    const entities = [createEntity(BUILDING_CORE, 2, 3), createEntity(UNIT_DRONE, 7, 11)];
    const container = drawEntities(entities);
    expect(container.children[0].position.x).toBe(2 * TILE_SIZE);
    expect(container.children[0].position.y).toBe(3 * TILE_SIZE);
    expect(container.children[1].position.x).toBe(7 * TILE_SIZE);
    expect(container.children[1].position.y).toBe(11 * TILE_SIZE);
  });
});
