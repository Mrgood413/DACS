import { describe, expect, it } from 'vitest';
import { Rectangle, Texture } from 'pixi.js';
import { BUILDING_BANNER, BUILDING_CORE, BUILDING_DRILL, BUILDING_TURRET, SOURCE_PIXELS_PER_TILE, TILE_SIZE, UNIT_BUG } from '../config';
import { createEntity } from './createEntity';
import { drawEntity } from './drawEntity';

describe('drawEntity', () => {
  it('nhà chính 3×3 → kích thước hiển thị 3 × TILE_SIZE', () => {
    const container = drawEntity(createEntity(BUILDING_CORE, 0, 0));
    const bounds = container.getLocalBounds();
    expect(bounds.width).toBeCloseTo(3 * TILE_SIZE);
    expect(bounds.height).toBeCloseTo(3 * TILE_SIZE);
  });

  it('dàn khoan 2×2 → kích thước hiển thị 2 × TILE_SIZE', () => {
    const container = drawEntity(createEntity(BUILDING_DRILL, 0, 0));
    const bounds = container.getLocalBounds();
    expect(bounds.width).toBeCloseTo(2 * TILE_SIZE);
    expect(bounds.height).toBeCloseTo(2 * TILE_SIZE);
  });

  it('bọ 1×1 → kích thước hiển thị trong phạm vi 1 × TILE_SIZE', () => {
    const container = drawEntity(createEntity(UNIT_BUG, 0, 0));
    const bounds = container.getLocalBounds();
    expect(bounds.width).toBeLessThanOrEqual(TILE_SIZE);
    expect(bounds.height).toBeLessThanOrEqual(TILE_SIZE);
  });

  it('băng rôn: ảnh gốc hướng phải nên rotation 0 (lên) xoay -90°, mỗi bước 90°', () => {
    // Container ngoài giữ rotation = 0 (gốc ở góc trên-trái); xoay nằm ở container con bên trong.
    const rotationOf = (r: number) => {
      const container = drawEntity(createEntity(BUILDING_BANNER, 0, 0, r));
      return container.children[0].rotation;
    };
    expect(drawEntity(createEntity(BUILDING_BANNER, 0, 0, 0)).rotation).toBe(0);
    expect(rotationOf(0)).toBeCloseTo(-Math.PI / 2);
    expect(rotationOf(1)).toBeCloseTo(0);
    expect(rotationOf(2)).toBeCloseTo(Math.PI / 2);
    expect(rotationOf(3)).toBeCloseTo(Math.PI);
  });

  it('thực thể không xoay được → container không xoay dù rotation dữ liệu là 0', () => {
    expect(drawEntity(createEntity(BUILDING_CORE, 0, 0)).rotation).toBe(0);
  });

  it('trụ súng có ảnh bệ → 2 sprite: bệ phủ kín ô ở dưới, đầu súng giữ tỉ lệ gốc ở giữa', () => {
    // Ảnh giả: bệ 8×8 px, đầu súng 10×10 px (giống Mindustry, 1 ô = 8 px).
    const baseTexture = new Texture({ frame: new Rectangle(0, 0, 8, 8) });
    const headTexture = new Texture({ frame: new Rectangle(0, 0, 10, 10) });
    const container = drawEntity(
      createEntity(BUILDING_TURRET, 0, 0),
      () => headTexture,
      undefined,
      () => baseTexture,
    );
    const visual = container.children[0];
    expect(visual.children).toHaveLength(2);
    const [base, head] = visual.children;
    expect(base.width).toBe(TILE_SIZE);
    expect(head.width).toBe((10 * TILE_SIZE) / SOURCE_PIXELS_PER_TILE);
    expect(head.x).toBe((TILE_SIZE - head.width) / 2);
  });

  it('trụ súng không có ảnh (hình dự phòng) → vẫn phủ kín ô nhờ bệ vuông', () => {
    const bounds = drawEntity(createEntity(BUILDING_TURRET, 0, 0)).getLocalBounds();
    expect(bounds.width).toBeCloseTo(TILE_SIZE);
    expect(bounds.height).toBeCloseTo(TILE_SIZE);
  });
});
