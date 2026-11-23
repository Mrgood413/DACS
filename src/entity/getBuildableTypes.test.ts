import { describe, expect, it } from 'vitest';
import { BUILDING_BANNER, BUILDING_CORE, BUILDING_ELECTRIC_TURRET } from '../config';
import { getBuildableTypes } from './getBuildableTypes';
import { getEntityDefinition } from './getEntityDefinition';

describe('getBuildableTypes', () => {
  it('có 6 loại công trình, bắt đầu bằng băng chuyền, kết thúc bằng trụ điện', () => {
    const types = getBuildableTypes();
    expect(types).toHaveLength(6);
    expect(types[0]).toBe(BUILDING_BANNER);
    expect(types[5]).toBe(BUILDING_ELECTRIC_TURRET);
  });

  it('không có nhà chính và không có đơn vị — chỉ công trình', () => {
    const types = getBuildableTypes();
    expect(types).not.toContain(BUILDING_CORE);
    for (const type of types) {
      expect(getEntityDefinition(type).group).toBe('Architecture');
    }
  });

  it('không trùng loại', () => {
    const types = getBuildableTypes();
    expect(new Set(types).size).toBe(types.length);
  });

  it('trả mảng mới: sửa kết quả không làm hỏng lần gọi sau', () => {
    getBuildableTypes().pop();
    expect(getBuildableTypes()).toHaveLength(6);
  });
});
