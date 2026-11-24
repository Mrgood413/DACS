import { describe, expect, it } from 'vitest';
import {
  BUILDING_BANNER,
  BUILDING_COPPER_WALL,
  BUILDING_CORE,
  BUILDING_DRILL,
  BUILDING_ELECTRIC_TURRET,
  BUILDING_IRON_WALL,
  BUILDING_TURRET,
  UNIT_BUG,
  UNIT_DRONE,
} from '../config';
import { getEntityDefinition } from './getEntityDefinition';

describe('getEntityDefinition', () => {
  it('nhà chính: 3×3, Architecture, không xoay được', () => {
    expect(getEntityDefinition(BUILDING_CORE)).toEqual({ type: BUILDING_CORE, width: 3, height: 3, group: 'Architecture', rotatable: false });
  });

  it('trụ súng: 1×1, Architecture, không xoay được', () => {
    expect(getEntityDefinition(BUILDING_TURRET)).toEqual({ type: BUILDING_TURRET, width: 1, height: 1, group: 'Architecture', rotatable: false });
  });

  it('trụ súng điện: 1×1, Architecture, không xoay được', () => {
    expect(getEntityDefinition(BUILDING_ELECTRIC_TURRET)).toEqual({ type: BUILDING_ELECTRIC_TURRET, width: 1, height: 1, group: 'Architecture', rotatable: false });
  });

  it('dàn khoan: 2×2, Architecture, không xoay được', () => {
    expect(getEntityDefinition(BUILDING_DRILL)).toEqual({ type: BUILDING_DRILL, width: 2, height: 2, group: 'Architecture', rotatable: false });
  });

  it('tường sắt: 1×1, Architecture, không xoay được', () => {
    expect(getEntityDefinition(BUILDING_IRON_WALL)).toEqual({ type: BUILDING_IRON_WALL, width: 1, height: 1, group: 'Architecture', rotatable: false });
  });

  it('tường đồng: 1×1, Architecture, không xoay được', () => {
    expect(getEntityDefinition(BUILDING_COPPER_WALL)).toEqual({ type: BUILDING_COPPER_WALL, width: 1, height: 1, group: 'Architecture', rotatable: false });
  });

  it('băng rôn: 1×1, Architecture, xoay được 4 hướng', () => {
    expect(getEntityDefinition(BUILDING_BANNER)).toEqual({ type: BUILDING_BANNER, width: 1, height: 1, group: 'Architecture', rotatable: true });
  });

  it('drone: 1×1, Unit, không xoay được', () => {
    expect(getEntityDefinition(UNIT_DRONE)).toEqual({ type: UNIT_DRONE, width: 1, height: 1, group: 'Unit', rotatable: false });
  });

  it('bọ: 1×1, Unit, không xoay được', () => {
    expect(getEntityDefinition(UNIT_BUG)).toEqual({ type: UNIT_BUG, width: 1, height: 1, group: 'Unit', rotatable: false });
  });

  it('loại không hợp lệ → ném lỗi rõ ràng', () => {
    expect(() => getEntityDefinition(0)).toThrow('Loại thực thể không hợp lệ: 0');
    expect(() => getEntityDefinition(99)).toThrow('Loại thực thể không hợp lệ: 99');
    expect(() => getEntityDefinition(-1)).toThrow('Loại thực thể không hợp lệ: -1');
  });
});
