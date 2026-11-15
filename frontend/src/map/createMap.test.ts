import { describe, expect, it } from 'vitest';
import { TILE_GRASS } from '../config';
import { createMap } from './createMap';

describe('createMap', () => {
  it('tạo map 3×2, mọi ô là cỏ', () => {
    const map = createMap(3, 2);
    expect(map.width).toBe(3);
    expect(map.height).toBe(2);
    expect(map.tiles.length).toBe(6);
    for (const tile of map.tiles) {
      expect(tile).toBe(TILE_GRASS);
    }
  });

  it('tạo map 100×100 đủ 10000 ô', () => {
    const map = createMap(100, 100);
    expect(map.tiles.length).toBe(10000);
  });

  it('ném lỗi khi width = 0', () => {
    expect(() => createMap(0, 5)).toThrow('Kích thước map không hợp lệ');
  });

  it('ném lỗi khi width là số lẻ (2.5)', () => {
    expect(() => createMap(2.5, 3)).toThrow('Kích thước map không hợp lệ');
  });
});
