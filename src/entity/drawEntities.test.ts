import { describe, expect, it } from 'vitest';
import { Sprite, Texture } from 'pixi.js';
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

  it('updatePositions: drone đổi toạ độ (kể cả số lẻ) → hình đi theo', () => {
    const drone = { ...createEntity(UNIT_DRONE, 1, 1), id: 7 };
    const layer = drawEntities([drone]);
    drone.x = 2.5;
    drone.y = 4;
    layer.updatePositions([drone]);
    expect(layer.children[0].position.x).toBe(2.5 * TILE_SIZE);
    expect(layer.children[0].position.y).toBe(4 * TILE_SIZE);
  });

  it('băng chuyền: luân phiên frame thường và frame chuyển động', () => {
    const layer = drawEntities(
      [createEntity(BUILDING_BANNER, 0, 0)],
      () => Texture.WHITE,
      () => Texture.EMPTY,
    );
    const sprite = layer.children[0].children[0].children[0].children[0];
    if (!(sprite instanceof Sprite)) {
      throw new Error('Băng chuyền phải được vẽ bằng Sprite');
    }

    layer.updateAnimations(0.25);
    expect(sprite.texture).toBe(Texture.EMPTY);

    layer.updateAnimations(0.25);
    expect(sprite.texture).toBe(Texture.WHITE);
  });
});
