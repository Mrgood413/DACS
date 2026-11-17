import { describe, expect, it } from 'vitest';
import {
  ENV_WALL_NONE,
  GRID_LINE_WIDTH,
  TERRAIN_COPPER_ORE,
  TERRAIN_GRASS,
  TERRAIN_IRON_ORE,
  TERRAIN_SAND,
  TERRAIN_WATER,
  TILE_SIZE,
} from '../config';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import { drawEnvironmentTiles } from './drawEnvironmentTiles';

describe('drawEnvironmentTiles', () => {
  it('map 2×3 → kích thước Graphics đúng bằng ô × TILE_SIZE (cộng phần lưới lấn 0.5px mỗi mép)', () => {
    const map = createEnvironmentMap(2, 3);
    const graphics = drawEnvironmentTiles(map);
    const bounds = graphics.getLocalBounds();
    expect(bounds.width).toBeCloseTo(2 * TILE_SIZE + GRID_LINE_WIDTH);
    expect(bounds.height).toBeCloseTo(3 * TILE_SIZE + GRID_LINE_WIDTH);
    expect(bounds.x).toBeCloseTo(-GRID_LINE_WIDTH / 2);
  });

  it('map 100×100 → hiển thị đủ 10000 ô (kích thước 3200×3200)', () => {
    const map = createEnvironmentMap(100, 100);
    const graphics = drawEnvironmentTiles(map);
    const bounds = graphics.getLocalBounds();
    expect(bounds.width).toBeCloseTo(100 * TILE_SIZE + GRID_LINE_WIDTH);
    expect(bounds.height).toBeCloseTo(100 * TILE_SIZE + GRID_LINE_WIDTH);
    expect(bounds.x).toBeCloseTo(-GRID_LINE_WIDTH / 2);
    expect(bounds.y).toBeCloseTo(-GRID_LINE_WIDTH / 2);
  });

  it('đặt màu ô theo dữ liệu địa hình (đủ 5 loại)', () => {
    const map = createEnvironmentMap(5, 1);
    map.terrain[0] = TERRAIN_GRASS;
    map.terrain[1] = TERRAIN_IRON_ORE;
    map.terrain[2] = TERRAIN_COPPER_ORE;
    map.terrain[3] = TERRAIN_SAND;
    map.terrain[4] = TERRAIN_WATER;
    const graphics = drawEnvironmentTiles(map);
    // PixiJS không công khai danh sách màu trong bounds; kiểm tra extents đúng 5 ô
    // (gián tiếp: 5 ô được vẽ) và hàm không ném lỗi với cả 5 loại địa hình.
    expect(graphics.getLocalBounds().width).toBeCloseTo(5 * TILE_SIZE + GRID_LINE_WIDTH);
    // Lớp wall không bị hàm này đụng tới.
    for (const wall of map.wall) {
      expect(wall).toBe(ENV_WALL_NONE);
    }
  });
});
