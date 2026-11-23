import { describe, expect, it } from 'vitest';
import { UNIT_DRONE } from '../config';
import { createEntity } from './createEntity';
import { getNextEntityId } from './getNextEntityId';

function withId(id: number) {
  return { ...createEntity(UNIT_DRONE, 0, 0), id };
}

describe('getNextEntityId', () => {
  it('id lớn nhất + 1, không phụ thuộc thứ tự', () => {
    expect(getNextEntityId([withId(3), withId(9), withId(5)])).toBe(10);
  });

  it('danh sách rỗng → 1', () => {
    expect(getNextEntityId([])).toBe(1);
  });
});
