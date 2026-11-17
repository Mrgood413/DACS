import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_CORE, BUILDING_DRILL, TILE_SIZE, UNIT_BUG } from '../config';
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

  it('băng rôn: rotation khác nhau → góc xoay của container con khác nhau (mỗi bước 90°)', () => {
    // Container ngoài giữ rotation = 0 (gốc ở góc trên-trái); xoay nằm ở container con bên trong.
    const rotationOf = (r: number) => {
      const container = drawEntity(createEntity(BUILDING_BANNER, 0, 0, r));
      return container.children[0].rotation;
    };
    expect(drawEntity(createEntity(BUILDING_BANNER, 0, 0, 0)).rotation).toBe(0);
    expect(rotationOf(0)).toBeCloseTo(0);
    expect(rotationOf(1)).toBeCloseTo(Math.PI / 2);
    expect(rotationOf(3)).toBeCloseTo((3 * Math.PI) / 2);
  });

  it('thực thể không xoay được → container không xoay dù rotation dữ liệu là 0', () => {
    expect(drawEntity(createEntity(BUILDING_CORE, 0, 0)).rotation).toBe(0);
  });
});
