import { describe, expect, it } from 'vitest';
import { BUILDING_DRILL, BUILDING_IRON_WALL } from '../config';
import { createConstructionSite } from './createConstructionSite';

describe('createConstructionSite', () => {
  it('công trình mới: đúng id và vị trí, 0 máu, đang xây, máu tối đa 100', () => {
    const site = createConstructionSite(42, BUILDING_IRON_WALL, 5, 6);
    expect(site.id).toBe(42);
    expect(site.x).toBe(5);
    expect(site.y).toBe(6);
    expect(site.hp).toBe(0);
    expect(site.maxHp).toBe(100);
    expect(site.constructing).toBe(true);
  });

  it('kích thước lấy từ định nghĩa: drill 2×2', () => {
    const site = createConstructionSite(1, BUILDING_DRILL, 0, 0);
    expect(site.width).toBe(2);
    expect(site.height).toBe(2);
  });

  it('toạ độ âm → ném lỗi giống createEntity', () => {
    expect(() => createConstructionSite(1, BUILDING_IRON_WALL, -1, 0)).toThrow();
  });
});
