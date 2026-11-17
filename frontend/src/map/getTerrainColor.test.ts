import { describe, expect, it } from 'vitest';
import {
  TERRAIN_COPPER_ORE,
  TERRAIN_GRASS,
  TERRAIN_IRON_ORE,
  TERRAIN_SAND,
  TERRAIN_WATER,
  UNKNOWN_TILE_COLOR,
} from '../config';
import { getTerrainColor } from './getTerrainColor';

describe('getTerrainColor', () => {
  it('cỏ → màu xanh lá', () => {
    expect(getTerrainColor(TERRAIN_GRASS)).toBe(0x5a9e3f);
  });

  it('quặng sắt → nền đá xám ánh kim loại', () => {
    expect(getTerrainColor(TERRAIN_IRON_ORE)).toBe(0x9aa2ad);
  });

  it('quặng đồng → nâu đỏ đặc trưng quặng đồng', () => {
    expect(getTerrainColor(TERRAIN_COPPER_ORE)).toBe(0xc47f4a);
  });

  it('cát → vàng cát nhạt', () => {
    expect(getTerrainColor(TERRAIN_SAND)).toBe(0xd8c078);
  });

  it('nước → xanh nước', () => {
    expect(getTerrainColor(TERRAIN_WATER)).toBe(0x3d7ea6);
  });

  it('mỗi loại địa hình có màu riêng', () => {
    const colors = [
      getTerrainColor(TERRAIN_GRASS),
      getTerrainColor(TERRAIN_IRON_ORE),
      getTerrainColor(TERRAIN_COPPER_ORE),
      getTerrainColor(TERRAIN_SAND),
      getTerrainColor(TERRAIN_WATER),
    ];
    expect(new Set(colors).size).toBe(colors.length);
  });

  it('ID không hợp lệ → UNKNOWN_TILE_COLOR (hồng tím)', () => {
    expect(getTerrainColor(0)).toBe(UNKNOWN_TILE_COLOR);
    expect(getTerrainColor(6)).toBe(UNKNOWN_TILE_COLOR);
    expect(getTerrainColor(99)).toBe(UNKNOWN_TILE_COLOR);
    expect(getTerrainColor(-1)).toBe(UNKNOWN_TILE_COLOR);
  });
});
