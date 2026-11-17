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
  it('cỏ → màu xanh lá trung bình (artstyle)', () => {
    expect(getTerrainColor(TERRAIN_GRASS)).toBe(0x55a639);
  });

  it('quặng sắt → nền đá xám xanh đậm (artstyle)', () => {
    expect(getTerrainColor(TERRAIN_IRON_ORE)).toBe(0x454e5c);
  });

  it('quặng đồng → nền đất nâu (artstyle)', () => {
    expect(getTerrainColor(TERRAIN_COPPER_ORE)).toBe(0x6e4a33);
  });

  it('cát → kem nhạt (artstyle)', () => {
    expect(getTerrainColor(TERRAIN_SAND)).toBe(0xf2e3b3);
  });

  it('nước → xanh ngọc teal (artstyle)', () => {
    expect(getTerrainColor(TERRAIN_WATER)).toBe(0x1f8fa0);
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
