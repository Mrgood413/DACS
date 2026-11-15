import { describe, expect, it } from 'vitest';
import { createMap } from '../map/createMap';
import { getMinimapScale } from './getMinimapScale';

describe('getMinimapScale', () => {
  it('map 100×100 → 0.0625', () => {
    expect(getMinimapScale(createMap(100, 100))).toBe(0.0625);
  });

  it('map 200×100 → 0.03125', () => {
    expect(getMinimapScale(createMap(200, 100))).toBe(0.03125);
  });
});
