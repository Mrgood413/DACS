import { describe, expect, it } from 'vitest';
import { ENV_WALL_BUSH, ENV_WALL_GRASS, ENV_WALL_NONE, ENV_WALL_STONE, TILE_SIZE } from '../config';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import { drawEnvironmentWalls } from './drawEnvironmentWalls';

describe('drawEnvironmentWalls', () => {
  it('map không có tường nào → Graphics trống (bounds 0)', () => {
    const map = createEnvironmentMap(3, 3);
    const graphics = drawEnvironmentWalls(map);
    const bounds = graphics.getLocalBounds();
    expect(bounds.width).toBe(0);
    expect(bounds.height).toBe(0);
  });

  it('ô có tường → vẽ trong phạm vi ô đó; ô không tường → trống', () => {
    const map = createEnvironmentMap(3, 3);
    map.wall[1 * 3 + 1] = ENV_WALL_STONE; // ô giữa (1, 1)
    const graphics = drawEnvironmentWalls(map);
    const bounds = graphics.getLocalBounds();
    // Tường nằm trọn trong ô (1,1): px từ 32 tới 64 (mép có thể lấn nhẹ do nét stroke).
    expect(bounds.x).toBeGreaterThanOrEqual(1 * TILE_SIZE);
    expect(bounds.y).toBeGreaterThanOrEqual(1 * TILE_SIZE);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(2 * TILE_SIZE + 1);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(2 * TILE_SIZE + 1);
  });

  it('đủ 3 loại tường vẽ được, không ném lỗi và tường không ra ngoài map', () => {
    const map = createEnvironmentMap(2, 1);
    map.wall[0] = ENV_WALL_STONE;
    map.wall[1] = ENV_WALL_GRASS;
    map.wall[1 * 2 + 1] = ENV_WALL_BUSH; // ngoài width → chỉ để kiểm tra không vẽ ra ô thứ 3
    const graphics = drawEnvironmentWalls(map);
    const bounds = graphics.getLocalBounds();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(2 * TILE_SIZE);
  });

  it('thứ tự lớp: hàm chỉ đọc map.wall, dữ liệu terrain giữ nguyên', () => {
    const map = createEnvironmentMap(2, 2);
    const terrainBefore = Uint8Array.from(map.terrain);
    map.wall[0] = ENV_WALL_BUSH;
    drawEnvironmentWalls(map);
    expect(Uint8Array.from(map.terrain)).toEqual(terrainBefore);
    expect(map.wall[0]).toBe(ENV_WALL_BUSH);
  });
});
