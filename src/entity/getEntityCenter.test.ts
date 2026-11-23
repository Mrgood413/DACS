import { describe, expect, it } from 'vitest';
import { BUILDING_CORE, UNIT_DRONE } from '../config';
import { createEntity } from './createEntity';
import { getEntityCenter } from './getEntityCenter';

describe('getEntityCenter', () => {
  it('nhà chính 3×3 ở ô (48, 75) → tâm (49.5 × 32, 76.5 × 32) = (1584, 2448)', () => {
    expect(getEntityCenter(createEntity(BUILDING_CORE, 48, 75))).toEqual({ x: 1584, y: 2448 });
  });

  it('drone 1×1 ở ô (0, 0) → tâm (16, 16)', () => {
    expect(getEntityCenter(createEntity(UNIT_DRONE, 0, 0))).toEqual({ x: 16, y: 16 });
  });
});
