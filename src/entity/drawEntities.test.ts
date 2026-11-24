import { describe, expect, it } from 'vitest';
import { Sprite, Texture } from 'pixi.js';
import { BUILDING_BANNER, BUILDING_CORE, CONVEYOR_FRAME_SECONDS, UNIT_DRONE, TILE_SIZE } from '../config';
import { createConstructionSite } from './createConstructionSite';
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

  it('updateViews: drone đổi toạ độ (kể cả số lẻ) → hình đi theo', () => {
    const drone = { ...createEntity(UNIT_DRONE, 1, 1), id: 7 };
    const layer = drawEntities([drone]);
    drone.x = 2.5;
    drone.y = 4;
    layer.updateViews([drone]);
    expect(layer.children[0].position.x).toBe(2.5 * TILE_SIZE);
    expect(layer.children[0].position.y).toBe(4 * TILE_SIZE);
  });

  it('updateViews: công trình đang xây mờ dần theo máu (0 máu → 0.4, nửa máu → 0.7, xong → 1)', () => {
    const site = createConstructionSite(3, BUILDING_CORE, 0, 0);
    const layer = drawEntities([site]);
    expect(layer.children[0].alpha).toBeCloseTo(0.4);
    site.hp = 50;
    layer.updateViews([site]);
    expect(layer.children[0].alpha).toBeCloseTo(0.7);
    site.hp = 100;
    site.constructing = false;
    layer.updateViews([site]);
    expect(layer.children[0].alpha).toBe(1);
  });

  it('removeEntity: xoá hình công trình; công trình thêm sau vẫn nằm dưới đơn vị', () => {
    const drone = { ...createEntity(UNIT_DRONE, 1, 1), id: 1 };
    const core = { ...createEntity(BUILDING_CORE, 5, 5), id: 2 };
    const layer = drawEntities([core, drone]);
    layer.removeEntity(2);
    expect(layer.children).toHaveLength(1);
    layer.addEntity(createConstructionSite(3, BUILDING_CORE, 9, 9));
    expect(layer.children[0].x).toBe(9 * TILE_SIZE);
    expect(layer.children[1].x).toBe(1 * TILE_SIZE);
  });

  it('removeEntity với id không tồn tại → không làm gì', () => {
    const layer = drawEntities([{ ...createEntity(UNIT_DRONE, 1, 1), id: 1 }]);
    layer.removeEntity(99);
    expect(layer.children).toHaveLength(1);
  });

  it('công trình thêm sau được chèn dưới đơn vị (drone không bị che)', () => {
    const drone = { ...createEntity(UNIT_DRONE, 1, 1), id: 1 };
    const core = { ...createEntity(BUILDING_CORE, 5, 5), id: 2 };
    const layer = drawEntities([core, drone]);
    const site = createConstructionSite(3, BUILDING_CORE, 9, 9);
    layer.addEntity(site);
    // Thứ tự con: core, công trình mới, drone (trên cùng).
    expect(layer.children[1].x).toBe(9 * TILE_SIZE);
    expect(layer.children[2].x).toBe(1 * TILE_SIZE);
  });

  it('băng chuyền: ảnh gốc hướng phải, rotation 0 (lên) xoay -90°, rotation 1 (phải) không xoay', () => {
    const up = drawEntities([createEntity(BUILDING_BANNER, 0, 0, 0)]);
    expect(up.children[0].children[0].rotation).toBeCloseTo(-Math.PI / 2);

    const right = drawEntities([createEntity(BUILDING_BANNER, 0, 0, 1)]);
    expect(right.children[0].children[0].rotation).toBeCloseTo(0);
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

    layer.updateAnimations(CONVEYOR_FRAME_SECONDS);
    expect(sprite.texture).toBe(Texture.EMPTY);

    layer.updateAnimations(CONVEYOR_FRAME_SECONDS);
    expect(sprite.texture).toBe(Texture.WHITE);
  });
});
