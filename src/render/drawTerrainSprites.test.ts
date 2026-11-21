import { describe, expect, it } from 'vitest';
import {
  GRID_LINE_WIDTH,
  TERRAIN_COPPER_ORE,
  TERRAIN_GRASS,
  TERRAIN_IRON_ORE,
  TERRAIN_SAND,
  TERRAIN_WATER,
  TILE_SIZE,
} from '../config';
import type { Texture } from 'pixi.js';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import { buildTerrainSprites, TERRAIN_TEXTURE_URLS } from './drawTerrainSprites';

describe('TERRAIN_TEXTURE_URLS', () => {
  it('đủ đường dẫn sprite cho cả 5 loại địa hình, đều nằm trong thư mục asset terrain', () => {
    const ids = [TERRAIN_GRASS, TERRAIN_IRON_ORE, TERRAIN_COPPER_ORE, TERRAIN_SAND, TERRAIN_WATER];
    for (const id of ids) {
      // Mẫu: ./assets/terrain/<tên>/<tên>.png (mỗi loại một thư mục).
      expect(TERRAIN_TEXTURE_URLS[id]).toMatch(/^\.\/assets\/terrain\/([a-z_]+)\/\1\.png$/);
    }
    expect(Object.keys(TERRAIN_TEXTURE_URLS).length).toBe(5);
  });
});

describe('buildTerrainSprites', () => {
  it('không có texture nào (tải lỗi) → fallback màu phẳng, kích thước đúng bằng ô × TILE_SIZE (+ lưới lấn 0.5px mỗi mép)', () => {
    const map = createEnvironmentMap(2, 3);
    const container = buildTerrainSprites(map, () => undefined);
    // Bounds xác định bởi fallback Graphics + lưới (sprite thiếu toàn bộ).
    expect(container.getLocalBounds().width).toBeCloseTo(2 * TILE_SIZE + GRID_LINE_WIDTH);
    expect(container.getLocalBounds().height).toBeCloseTo(3 * TILE_SIZE + GRID_LINE_WIDTH);
    expect(container.getLocalBounds().x).toBeCloseTo(-GRID_LINE_WIDTH / 2);
  });

  it('có texture cho từng loại → mỗi ô một sprite đặt đúng toạ độ ô, co về TILE_SIZE, kèm 1 Graphics lưới trên cùng', () => {
    const map = createEnvironmentMap(3, 2);
    map.terrain[0] = TERRAIN_GRASS;
    map.terrain[1] = TERRAIN_IRON_ORE;
    map.terrain[2] = TERRAIN_COPPER_ORE;
    map.terrain[3] = TERRAIN_SAND;
    map.terrain[4] = TERRAIN_WATER;
    map.terrain[5] = TERRAIN_GRASS;
    // Texture giả cho mọi loại (không vẽ thật, chỉ kiểm tra số lượng và vị trí sprite).
    const fakeTexture = {} as Texture;
    const container = buildTerrainSprites(map, () => fakeTexture);

    // 6 ô → 6 sprite; hai lớp trên cùng là fallback màu phẳng (trống) và Graphics lưới.
    const lastTwo = container.children.slice(-2);
    const sprites = container.children.filter((child) => !lastTwo.includes(child));
    expect(sprites.length).toBe(6);
    // Sprite đầu tiên ở ô (0, 0), sprite thứ hai ở ô (1, 0).
    expect(sprites[0].x).toBe(0);
    expect(sprites[0].y).toBe(0);
    expect(sprites[1].x).toBe(TILE_SIZE);
    expect(sprites[1].y).toBe(0);
    // Hai lớp trên cùng là fallback màu phẳng và Graphics lưới.
    expect(container.children.at(-2)).toBeDefined();
    expect(container.children.at(-1)).toBeDefined();
  });

  it('ô nào thiếu texture (loại không có sprite) → ô đó rơi vào fallback màu phẳng, các ô còn lại vẫn là sprite', () => {
    const map = createEnvironmentMap(2, 1);
    map.terrain[0] = TERRAIN_GRASS;
    map.terrain[1] = TERRAIN_WATER;
    // Chỉ cỏ có sprite, nước không có.
    const fakeTexture = {} as Texture;
    const container = buildTerrainSprites(map, (id) => (id === TERRAIN_GRASS ? fakeTexture : undefined));
    // Chỉ 1 sprite (ô cỏ); ô nước nằm trong lớp fallback.
    const fallbackAndGrid = container.children.slice(-2);
    const sprites = container.children.filter((child) => !fallbackAndGrid.includes(child));
    expect(sprites.length).toBe(1);
    expect(sprites[0].x).toBe(0);
    expect(sprites[0].y).toBe(0);
  });
});
