import { describe, expect, it } from 'vitest';
import { BUILDING_CORE, BUILDING_TURRET, UNIT_BUG, UNIT_DRONE } from '../config';
import { isSelectableUnit } from './isSelectableUnit';

describe('isSelectableUnit', () => {
  it('drone của người chơi → chọn được', () => {
    expect(isSelectableUnit(UNIT_DRONE)).toBe(true);
  });

  it('quái (bug) → không chọn được', () => {
    expect(isSelectableUnit(UNIT_BUG)).toBe(false);
  });

  it('công trình → không chọn được', () => {
    expect(isSelectableUnit(BUILDING_CORE)).toBe(false);
    expect(isSelectableUnit(BUILDING_TURRET)).toBe(false);
  });
});
