import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_COPPER_WALL, BUILDING_CORE, BUILDING_DRILL, BUILDING_ELECTRIC_TURRET, BUILDING_IRON_WALL, BUILDING_TURRET, UNIT_BUG, UNIT_DRONE } from '../config';
import { createEnvironmentMap } from '../map/createEnvironmentMap';
import { getDemoEntityPositions } from './getDemoEntityPositions';

/** Tính danh sách ô chiếm bởi một thực thể (kết hợp width/height từ createEntity). */
function occupiedCells(x: number, y: number, width: number, height: number): Array<[number, number]> {
  const cells: Array<[number, number]> = [];
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      cells.push([x + dx, y + dy]);
    }
  }
  return cells;
}

describe('getDemoEntityPositions', () => {
  const map = createEnvironmentMap(100, 100);
  const positions = getDemoEntityPositions(map);
  const byType = new Map(positions.map((p) => [p.type, p]));

  it('trả về đủ 9 vị trí, mỗi loại một vị trí', () => {
    expect(positions.length).toBe(9);
    expect(new Set(positions.map((p) => p.type)).size).toBe(9);
  });

  it('thứ tự từ dưới đi lên, mỗi hàng từ phải qua trái (lưới 3×3 ở góc dưới-phải)', () => {
    // Hàng dưới (y lớn nhất): nhà chính phải nhất → trụ súng → trụ súng điện trái nhất.
    expect(byType.get(BUILDING_CORE)).toMatchObject({ x: 92, y: 92 });
    expect(byType.get(BUILDING_TURRET)).toMatchObject({ x: 87, y: 93 });
    expect(byType.get(BUILDING_ELECTRIC_TURRET)).toMatchObject({ x: 81, y: 93 });
    // Hàng giữa: dàn khoan phải nhất → tường sắt → tường đồng trái nhất.
    expect(byType.get(BUILDING_DRILL)).toMatchObject({ x: 92, y: 86 });
    expect(byType.get(BUILDING_IRON_WALL)).toMatchObject({ x: 87, y: 87 });
    expect(byType.get(BUILDING_COPPER_WALL)).toMatchObject({ x: 81, y: 87 });
    // Hàng trên: băng rôn phải nhất → drone → bọ trái nhất.
    expect(byType.get(BUILDING_BANNER)).toMatchObject({ x: 93, y: 81 });
    expect(byType.get(UNIT_DRONE)).toMatchObject({ x: 87, y: 81 });
    expect(byType.get(UNIT_BUG)).toMatchObject({ x: 81, y: 81 });
  });

  it('các thực thể cùng hàng ngang hàng nhau (cùng tâm dọc)', () => {
    // Hàng dưới: trụ súng và trụ súng điện cùng tâm dọc (y + (height-1)/2 bằng nhau).
    const turret = byType.get(BUILDING_TURRET)!;
    const electric = byType.get(BUILDING_ELECTRIC_TURRET)!;
    expect(turret.y).toBe(electric.y);
    // Hàng giữa: tường sắt và tường đồng cùng tâm dọc.
    const iron = byType.get(BUILDING_IRON_WALL)!;
    const copper = byType.get(BUILDING_COPPER_WALL)!;
    expect(iron.y).toBe(copper.y);
    // Hàng trên: drone và bọ cùng tâm dọc.
    const drone = byType.get(UNIT_DRONE)!;
    const bug = byType.get(UNIT_BUG)!;
    expect(drone.y).toBe(bug.y);
  });

  it('băng rôn xoay hướng 1, các thực thể khác không xoay', () => {
    expect(byType.get(BUILDING_BANNER)!.rotation).toBe(1);
    for (const position of positions) {
      if (position.type !== BUILDING_BANNER) {
        expect(position.rotation).toBe(0);
      }
    }
  });

  it('tất cả thực thể (kể cả kích thước 3×3, 2×2) nằm trong map, chừa mép 4 ô', () => {
    for (const position of positions) {
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeGreaterThanOrEqual(0);
    }
    const core = byType.get(BUILDING_CORE)!;
    expect(core.x + 3).toBeLessThanOrEqual(map.width - 4);
    expect(core.y + 3).toBeLessThanOrEqual(map.height - 4);
  });

  it('không có hai thực thể nào chồng lấn ô', () => {
    const sizes: Record<number, [number, number]> = {
      [BUILDING_CORE]: [3, 3],
      [BUILDING_DRILL]: [2, 2],
      [BUILDING_TURRET]: [1, 1],
      [BUILDING_ELECTRIC_TURRET]: [1, 1],
      [BUILDING_IRON_WALL]: [1, 1],
      [BUILDING_COPPER_WALL]: [1, 1],
      [BUILDING_BANNER]: [1, 1],
      [UNIT_DRONE]: [1, 1],
      [UNIT_BUG]: [1, 1],
    };
    const occupied = new Map<string, number>();
    for (const position of positions) {
      const [width, height] = sizes[position.type];
      for (const [x, y] of occupiedCells(position.x, position.y, width, height)) {
        const key = `${x},${y}`;
        expect(occupied.has(key), `ô (${key}) bị chồng lấn`).toBe(false);
        occupied.set(key, position.type);
      }
    }
  });
});
